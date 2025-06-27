/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { UpdateUserDto } from './dto/update.user.dto';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { Posts } from 'src/posts/posts.model';
import { Orders } from 'src/orders/orders.model';
import { PasswordUserDto } from './dto/password.user.dto';
import * as sgMail from '@sendgrid/mail';
import {
  changePasswordMsg,
  restorePasswordMsg,
} from './utils/message-variables';
import { MailUserDto } from './dto/email.user.dto';
import { UpdatePasswordUserDto } from './dto/updatePassword.user.dto';
import { Connection, ClientSession } from 'mongoose';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly ACCESS_TOKEN_EXPIRY =
    process.env.ACCESS_TOKEN_EXPIRY || '1h';
  private readonly REFRESH_TOKEN_EXPIRY =
    process.env.REFRESH_TOKEN_EXPIRY || '24h';
  private readonly FROM_EMAIL = process.env.FROM_EMAIL || 'lusiy321@gmail.com';
  private readonly FRONTEND_URL =
    process.env.FRONTEND_URL || 'https://swap-server.cyclic.cloud';

  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Posts.name) private postModel: Posts,
    @InjectModel(Orders.name) private orderModel: Orders,
    @InjectConnection() private connection: Connection,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
  async findById(id: string): Promise<User> {
    if (!id) {
      throw new BadRequest('User ID is required');
    }

    try {
      const user = await this.userModel.findById(id).lean().exec();
      if (!user) {
        throw new NotFound('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by ID ${id}:`, error);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new BadRequest('Invalid user ID format');
    }
  }
  async create(user: CreateUserDto): Promise<User> {
    const { email, password } = user;
    const lowerCaseEmail = email.toLowerCase();

    const session: ClientSession = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        // Проверяем существование пользователя
        const existingUser = await this.userModel
          .findOne({
            email: lowerCaseEmail,
          })
          .session(session);

        if (existingUser) {
          throw new Conflict(`User with email ${email} already exists`);
        }

        // Создаем пользователя
        const userData = {
          ...user,
          email: lowerCaseEmail,
          password: hashSync(password, 10),
        };

        const [createdUser] = await this.userModel.create([userData], {
          session,
        });

        // Устанавливаем имя из email
        const emailName = lowerCaseEmail.split('@')[0];
        createdUser.firstName = createdUser.firstName || emailName;
        await createdUser.save({ session });

        // Отправляем письмо верификации (асинхронно)
        const verificationLink = `${this.FRONTEND_URL}/auth/verify-email/${createdUser._id}`;
        this.sendVerificationEmail(lowerCaseEmail, verificationLink).catch(
          (error) =>
            this.logger.error('Failed to send verification email:', error),
        );

        return createdUser;
      });

      // Возвращаем созданного пользователя
      return await this.userModel
        .findOne({ email: lowerCaseEmail })
        .lean()
        .exec();
    } catch (error) {
      this.logger.error('Error creating user:', error);
      if (error instanceof Conflict) {
        throw error;
      }
      throw new BadRequest('Failed to create user');
    } finally {
      await session.endSession();
    }
  }
  async sendVerificationEmail(
    email: string,
    verificationLink: string,
  ): Promise<void> {
    const msg = {
      to: email,
      from: this.FROM_EMAIL,
      subject: 'Email Verification from Swap',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thank you for registering with Swap! Please click the link below to verify your email address:</p>
          <p><a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
          <p>If you did not create an account, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}:`,
        error,
      );
      throw new Error('Failed to send verification email');
    }
  }
  async verifyUserEmail(id: string): Promise<User> {
    if (!id) {
      throw new BadRequest('User ID is required');
    }

    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, { verify: true }, { new: true, lean: true })
        .exec();

      if (!user) {
        throw new NotFound('User not found');
      }

      this.logger.log(`User ${id} email verified successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Error verifying email for user ${id}:`, error);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new BadRequest('Failed to verify email');
    }
  }
  async changePassword(req: any, newPass: PasswordUserDto): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('JWT token expired or invalid');
    }

    const { oldPassword, password } = newPass;

    try {
      // Проверяем старый пароль
      if (!compareSync(oldPassword, user.password)) {
        throw new BadRequest('Current password is incorrect');
      }

      // Обновляем пароль
      const hashedPassword = hashSync(password, 10);
      await this.userModel
        .findByIdAndUpdate(
          user._id,
          { password: hashedPassword },
          { new: true },
        )
        .exec();

      // Отправляем уведомление (асинхронно)
      this.sendPasswordChangeNotification(user.email).catch((error) =>
        this.logger.error(
          'Failed to send password change notification:',
          error,
        ),
      );

      this.logger.log(`Password changed for user ${user._id}`);
      return await this.userModel.findById(user._id).lean().exec();
    } catch (error) {
      this.logger.error(`Error changing password for user ${user._id}:`, error);
      if (error instanceof BadRequest) {
        throw error;
      }
      throw new BadRequest('Failed to change password');
    }
  }

  private async sendPasswordChangeNotification(email: string): Promise<void> {
    const msg = {
      to: email,
      from: this.FROM_EMAIL,
      subject: 'Your password has been changed on Swap',
      html: changePasswordMsg,
    };
    await sgMail.send(msg);
  }
  async restorePassword(emailDto: MailUserDto): Promise<void> {
    const { email } = emailDto;

    try {
      const user = await this.userModel
        .findOne({ email: email.toLowerCase() })
        .lean()
        .exec();

      if (!user) {
        // Не раскрываем информацию о существовании пользователя
        this.logger.warn(
          `Password restore attempt for non-existent email: ${email}`,
        );
        return;
      }

      const msg = {
        to: user.email,
        from: this.FROM_EMAIL,
        subject: 'Reset your password on Swap',
        html: restorePasswordMsg.replace(
          '{{resetLink}}',
          `${this.FRONTEND_URL}/reset-password/${user._id}`,
        ),
      };

      await sgMail.send(msg);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Error sending password reset email to ${email}:`,
        error,
      );
      throw new BadRequest('Failed to send password reset email');
    }
  }
  async updateRestorePassword(
    id: string,
    newPass: UpdatePasswordUserDto,
  ): Promise<User> {
    if (!id) {
      throw new BadRequest('User ID is required');
    }

    const { password } = newPass;

    try {
      const hashedPassword = hashSync(password, 10);
      const user = await this.userModel
        .findByIdAndUpdate(
          id,
          { password: hashedPassword },
          { new: true, lean: true },
        )
        .exec();

      if (!user) {
        throw new NotFound('User not found');
      }

      // Отправляем уведомление (асинхронно)
      this.sendPasswordChangeNotification(user.email).catch((error) =>
        this.logger.error(
          'Failed to send password change notification:',
          error,
        ),
      );

      this.logger.log(`Password restored for user ${id}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error updating restored password for user ${id}:`,
        error,
      );
      if (error instanceof NotFound) {
        throw error;
      }
      throw new BadRequest('Failed to update password');
    }
  }
  async login(user: CreateUserDto): Promise<User> {
    const { email, password } = user;
    const lowerCaseEmail = email.toLowerCase();

    try {
      const authUser = await this.userModel
        .findOne({ email: lowerCaseEmail })
        .exec();

      if (!authUser) {
        throw new Unauthorized('Invalid email or password');
      }

      if (!compareSync(password, authUser.password)) {
        throw new Unauthorized('Invalid email or password');
      }

      if (!authUser.verify) {
        throw new Unauthorized('Please verify your email before logging in');
      }

      if (authUser.ban) {
        throw new Unauthorized('Your account has been banned');
      }

      // Создание токена и обновление пользователя
      const tokenData = await this.createToken(authUser);

      this.logger.log(`User ${authUser._id} logged in successfully`);
      return tokenData;
    } catch (error) {
      this.logger.error(`Login failed for email ${lowerCaseEmail}:`, error);
      if (error instanceof Unauthorized) {
        throw error;
      }
      throw new BadRequest('Login failed');
    }
  }
  async logout(req: any): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('JWT token expired or invalid');
    }

    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          user._id,
          { token: null, isOnline: false },
          { new: true, lean: true },
        )
        .exec();

      this.logger.log(`User ${user._id} logged out successfully`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error logging out user ${user._id}:`, error);
      throw new BadRequest('Logout failed');
    }
  }
  async update(user: UpdateUserDto, req: any): Promise<User> {
    const authenticatedUser = await this.findToken(req);
    if (!authenticatedUser) {
      throw new Unauthorized('JWT token expired or invalid');
    }

    const { firstName, lastName, phone, location, avatarURL } = user;

    // Фильтруем только те поля, которые действительно изменились
    const updateFields: any = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (avatarURL !== undefined) updateFields.avatarURL = avatarURL;

    if (Object.keys(updateFields).length === 0) {
      return await this.userModel.findById(authenticatedUser._id).lean().exec();
    }

    const session: ClientSession = await this.connection.startSession();

    try {
      let updatedUser: User;

      await session.withTransaction(async () => {
        // Обновляем пользователя
        updatedUser = await this.userModel
          .findByIdAndUpdate(authenticatedUser._id, updateFields, {
            new: true,
            session,
          })
          .exec();

        if (!updatedUser) {
          throw new NotFound('User not found');
        }

        // Обновляем связанные данные в фоновом режиме
        this.updateUserData(updatedUser._id.toString()).catch((error) =>
          this.logger.error('Failed to update related user data:', error),
        );
      });

      this.logger.log(`User ${authenticatedUser._id} updated successfully`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user ${authenticatedUser._id}:`, error);
      if (error instanceof NotFound || error instanceof Unauthorized) {
        throw error;
      }
      throw new BadRequest('Failed to update user');
    } finally {
      await session.endSession();
    }
  }
  async updateUserData(userId: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId).lean().exec();
      if (!user) {
        throw new NotFound('User not found');
      }

      const userInfo = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarURL: user.avatarURL,
        location: user.location,
      };

      // Используем Promise.allSettled для параллельного выполнения всех обновлений
      const updatePromises = [
        // Обновление постов владельца
        this.postModel
          .updateMany({ 'owner.id': user._id }, { $set: { owner: userInfo } })
          .exec(),

        // Обновление комментариев пользователя
        this.postModel
          .updateMany(
            { 'comments.user.id': user._id },
            {
              $set: {
                'comments.$[comment].user': userInfo,
              },
            },
            { arrayFilters: [{ 'comment.user.id': user._id }] },
          )
          .exec(),

        // Обновление предложений к обмену
        this.postModel
          .updateMany(
            { 'toExchange.user.id': user._id },
            {
              $set: {
                'toExchange.$[exchange].user': userInfo,
              },
            },
            { arrayFilters: [{ 'exchange.user.id': user._id }] },
          )
          .exec(),

        // Обновление ответов на комментарии
        this.postModel
          .updateMany(
            { 'comments.answer.user.id': user._id },
            {
              $set: {
                'comments.$[comment].answer.$[answer].user': userInfo,
              },
            },
            {
              arrayFilters: [
                { 'comment.answer': { $exists: true } },
                { 'answer.user.id': user._id },
              ],
            },
          )
          .exec(),

        // Обновление заказов где пользователь владелец продукта
        this.orderModel
          .updateMany(
            { 'product.owner.id': user._id },
            { $set: { 'product.owner': userInfo } },
          )
          .exec(),

        // Обновление заказов где пользователь делает предложение
        this.orderModel
          .updateMany(
            { 'offer.owner.id': user._id },
            { $set: { 'offer.owner': userInfo } },
          )
          .exec(),
      ];

      const results = await Promise.allSettled(updatePromises);

      // Логируем неуспешные операции
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          this.logger.error(
            `Failed to update related data (operation ${index}):`,
            result.reason,
          );
        }
      });

      this.logger.log(`User data updated for user ${userId}`);
    } catch (error) {
      this.logger.error(`Error updating user data for ${userId}:`, error);
      throw error;
    }
  }
  async findOrCreateUser(
    googleId: string,
    firstName: string,
    email: string,
  ): Promise<User> {
    try {
      let user = await this.userModel.findOne({ googleId }).exec();

      if (!user) {
        const userData = {
          googleId,
          firstName,
          email: email.toLowerCase(),
          password: hashSync(googleId, 10),
          verify: true, // Google users are pre-verified
        };

        user = await this.userModel.create(userData);
        this.logger.log(`New Google user created: ${user._id}`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding/creating Google user:`, error);
      throw new BadRequest('Failed to authenticate with Google');
    }
  }
  async findToken(req: any): Promise<User | null> {
    try {
      const { authorization = '' } = req.headers;

      if (!authorization.startsWith('Bearer ')) {
        throw new Unauthorized('Invalid authorization header format');
      }

      const token = authorization.slice(7); // Remove 'Bearer ' prefix

      if (!token) {
        throw new Unauthorized('Token not provided');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      if (!SECRET_KEY) {
        throw new Error('SECRET_KEY environment variable is not set');
      }

      const decoded = verify(token, SECRET_KEY) as JwtPayload;

      if (!decoded.id) {
        throw new Unauthorized('Invalid token payload');
      }

      const user = await this.userModel.findById(decoded.id).exec();

      if (!user) {
        throw new Unauthorized('User not found');
      }

      if (user.token !== token) {
        throw new Unauthorized('Token mismatch');
      }

      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Unauthorized('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Unauthorized('Token expired');
      }
      if (error instanceof Unauthorized) {
        throw error;
      }
      this.logger.error('Error validating token:', error);
      throw new Unauthorized('Token validation failed');
    }
  }
  async createToken(authUser: { _id: string }): Promise<User> {
    try {
      const payload = {
        id: authUser._id,
        iat: Math.floor(Date.now() / 1000),
      };

      const SECRET_KEY = process.env.SECRET_KEY;
      if (!SECRET_KEY) {
        throw new Error('SECRET_KEY environment variable is not set');
      }

      const token = sign(payload, SECRET_KEY, {
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
      });

      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          authUser._id,
          {
            token,
            isOnline: true,
          },
          { new: true, lean: true },
        )
        .exec();

      if (!updatedUser) {
        throw new NotFound('User not found during token creation');
      }

      this.logger.log(`Token created for user ${authUser._id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Error creating token for user ${authUser._id}:`,
        error,
      );
      throw new BadRequest('Failed to create authentication token');
    }
  }
  async refreshAccessToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;

      if (!authorization.startsWith('Bearer ')) {
        throw new Unauthorized('Invalid authorization header format');
      }

      const token = authorization.slice(7);

      if (!token) {
        throw new Unauthorized('Token not provided');
      }

      const user = await this.userModel.findOne({ token }).exec();

      if (!user) {
        throw new Unauthorized('Invalid refresh token');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      if (!SECRET_KEY) {
        throw new Error('SECRET_KEY environment variable is not set');
      }

      const payload = {
        id: user._id,
        iat: Math.floor(Date.now() / 1000),
      };

      const newToken = sign(payload, SECRET_KEY, {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
      });

      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          user._id,
          { token: newToken },
          { new: true, lean: true },
        )
        .exec();

      this.logger.log(`Token refreshed for user ${user._id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error('Error refreshing token:', error);
      if (error instanceof Unauthorized) {
        throw error;
      }
      throw new BadRequest('Invalid refresh token');
    }
  }
}

// Оптимизированные методы схемы
UserSchema.methods.setPassword = function (password: string): string {
  this.password = hashSync(password, 10);
  return this.password;
};

UserSchema.methods.setName = function (email: string): void {
  if (!this.firstName) {
    const parts = email.split('@');
    this.firstName = parts[0];
  }
};

UserSchema.methods.comparePassword = function (password: string): boolean {
  return compareSync(password, this.password);
};

// Добавляем индексы для оптимизации
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ token: 1 });
UserSchema.index({ verify: 1 });
UserSchema.index({ ban: 1 });

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Posts.name) private postModel: Posts,
    @InjectModel(Orders.name) private orderModel: Orders,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async findById(id: string): Promise<User> {
    try {
      const find = await this.userModel.findById(id).exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const { email } = user;
      const lowerCaseEmail = email.toLowerCase();

      const registrationUser = await this.userModel.findOne({
        email: lowerCaseEmail,
      });
      if (registrationUser) {
        throw new Conflict(`User with ${email} in use`);
      }

      const createdUser = await this.userModel.create(user);
      createdUser.setName(lowerCaseEmail);
      createdUser.setPassword(user.password);
      createdUser.save();
      const verificationLink = `https://swap-server.cyclic.cloud/auth/verify-email/${createdUser._id}`;
      await this.sendVerificationEmail(email, verificationLink);
      return await this.userModel.findById(createdUser._id);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
  ): Promise<void> {
    const msg = {
      to: email,
      from: 'lusiy321@gmail.com',
      subject: 'Email Verification from Swep',
      html: `<p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Click</a></p>`,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  }

  async verifyUserEmail(id: any) {
    try {
      const user = await this.userModel.findById(id);
      user.verify = true;
      user.save();
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async changePassword(req: any, newPass: PasswordUserDto): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const { oldPassword, password } = newPass;
      if (user.comparePassword(oldPassword) === true) {
        user.setPassword(password);
        user.save();
        const msg = {
          to: user.email,
          from: 'lusiy321@gmail.com',
          subject: 'Your password has been changed on swep.com',
          html: changePasswordMsg,
        };
        await sgMail.send(msg);
        return await this.userModel.findById(user._id);
      }
      throw new BadRequest('Password is not avaible');
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async restorePassword(email: MailUserDto) {
    const restoreMail: User = await this.userModel.findOne(email);
    try {
      if (restoreMail) {
        const msg: any = {
          to: restoreMail.email,
          from: 'lusiy321@gmail.com',
          subject: 'Change your password on swep.com',
          html: restorePasswordMsg,
        };
        return await sgMail.send(msg);
      }
    } catch (e) {
      throw new BadRequest('User not found');
    }
  }

  async updateRestorePassword(
    id: string,
    newPass: UpdatePasswordUserDto,
  ): Promise<User> {
    const user = await this.userModel.findById(id);
    const { password } = newPass;
    try {
      if (user) {
        user.setPassword(password);
        user.save();
        const msg = {
          to: user.email,
          from: 'lusiy321@gmail.com',
          subject: 'Your password has been changed on swep.com',
          html: changePasswordMsg,
        };
        await sgMail.send(msg);
        return await this.userModel.findById(user._id);
      }

      throw new BadRequest('User not found');
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async login(user: CreateUserDto): Promise<User> {
    try {
      const { email, password } = user;
      const lowerCaseEmail = email.toLowerCase();
      const authUser = await this.userModel.findOne({ email: lowerCaseEmail });
      if (!authUser || !authUser.comparePassword(password)) {
        throw new Unauthorized(`Email or password is wrong`);
      }
      return this.createToken(authUser);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async logout(req: any): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      await this.userModel.findByIdAndUpdate({ _id: user.id }, { token: null });
      return await this.userModel.findById({ _id: user.id });
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async update(user: UpdateUserDto, req: any): Promise<User> {
    const { firstName, lastName, phone, location, avatarURL } = user;
    const findId = await this.findToken(req);
    if (!findId) {
      throw new Unauthorized('jwt expired');
    }

    if (firstName || lastName || phone || location || avatarURL) {
      await this.userModel.findByIdAndUpdate(
        { _id: findId.id },
        { firstName, lastName, phone, location, avatarURL },
      );
      const userUpdate = this.userModel.findById({ _id: findId.id });
      this.updateUserData(findId.id);

      return userUpdate;
    }
  }

  async updateUserData(findId: string): Promise<Posts[]> {
    const user = await this.userModel.findById({ _id: findId });
    await this.postModel.updateMany(
      { 'owner.id': user.id },
      {
        $set: {
          owner: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarURL: user.avatarURL,
            location: user.location,
          },
        },
      },
    );
    await this.postModel.updateMany(
      { 'comments.user.id': user.id },
      {
        $set: {
          'comments.$[comment].user': {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarURL: user.avatarURL,
            location: user.location,
          },
        },
      },
      { arrayFilters: [{ 'comment.user.id': user.id }] },
    );
    await this.postModel.updateMany(
      { 'toExchange.user.id': user.id },
      {
        $set: {
          'toExchange.$[toExchange].user': {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarURL: user.avatarURL,
            location: user.location,
          },
        },
      },
      { arrayFilters: [{ 'toExchange.user.id': user.id }] },
    );
    await this.postModel.updateMany(
      { 'comments.answer.user.id': user.id },
      {
        $set: {
          'comments.$[comment].answer.$[ans].user': {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarURL: user.avatarURL,
            location: user.location,
          },
        },
      },
      {
        arrayFilters: [
          { 'comment.user.id': user.id },
          { 'ans.user.id': user.id },
        ],
      },
    );
    await this.orderModel.updateMany(
      { 'product.owner.id': user.id },
      {
        $set: {
          owner: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarURL: user.avatarURL,
            location: user.location,
          },
        },
      },
    );
    await this.orderModel.updateMany(
      { 'offer.owner.id': user.id },
      {
        $set: {
          owner: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarURL: user.avatarURL,
            location: user.location,
          },
        },
      },
    );
    return;
  }  

  async findOrCreateUser(
    googleId: string,
    firstName: string,
    email: string,
  ): Promise<any> {
    try {
      let user = await this.userModel.findOne({ googleId });
      if (!user) {
        user = await this.userModel.create({
          googleId,
          firstName,
          email,
        });
        user.setPassword(googleId);
        return user.save();
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });

      return user;
    } catch (e) {
      throw new Unauthorized('jwt expired');
    }
  }

  async createToken(authUser: { _id: string }) {
    const payload = {
      id: authUser._id,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = sign(payload, SECRET_KEY, { expiresIn: '1m' });
    await this.userModel.findByIdAndUpdate(authUser._id, { token });
    const authentificationUser = await this.userModel.findById({
      _id: authUser._id,
    });
    return authentificationUser;
  }

  async refreshAccessToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const user = await this.userModel.findOne({ token: token });
      if (!user) {
        throw new NotFound('User not found');
      }
      const payload = {
        id: user._id,
      };
      const tokenRef = sign(payload, SECRET_KEY, { expiresIn: '24h' });
      await this.userModel.findByIdAndUpdate(user._id, { token: tokenRef });
      const authentificationUser = await this.userModel.findById({
        _id: user.id,
      });
      return authentificationUser;
    } catch (error) {
      throw new BadRequest('Invalid refresh token');
    }
  }
}

UserSchema.methods.setPassword = async function (password: string) {
  return (this.password = hashSync(password, 10));
};

UserSchema.methods.setName = function (email: string) {
  const parts = email.split('@');
  this.firstName = parts[0];
};
UserSchema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password);
};

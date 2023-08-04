/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { UpdateUserDto } from './dto/update.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { Posts } from 'src/posts/posts.model';
import { Orders } from 'src/orders/orders.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: User,
    @InjectModel(Posts.name) private postModel: Posts,
    @InjectModel(Orders.name) private orderModel: Orders,
  ) {}

  async findAll(req: any): Promise<User[]> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user.role === 'admin') {
        return this.userModel.find().exec();
      } else if (user.role === 'moderator') {
        const subUsers = this.userModel
          .find({ $or: [{ _id: user._id }, { role: 'user' }] })
          .exec();
        return subUsers;
      } else {
        return await this.userModel.findById(user._id).exec();
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
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
      const registrationUser = await this.userModel.findOne({ email });
      if (registrationUser) {
        throw new Conflict(`User with ${email} in use`);
      }
      const createdUser = await this.userModel.create(user);
      createdUser.setName(user.email);
      createdUser.setPassword(user.password);
      createdUser.save();
      return await this.userModel.findById(createdUser._id);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async login(user: CreateUserDto): Promise<User> {
    try {
      const { email, password } = user;
      const authUser = await this.userModel.findOne({ email });
      if (!authUser || !authUser.comparePassword(password)) {
        throw new Unauthorized(`Email or password is wrong`);
      }
      return this.createToken(authUser);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async GoogleLogin(user: GoogleUserDto): Promise<User> {
    try {
      const { email } = user;
      const authUser = await this.userModel.findOne({ email });
      if (!authUser) {
        throw new Unauthorized(`Authorization failure`);
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

  async delete(id: string, req: any): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (user.role === 'admin') {
        const find = await this.userModel.findByIdAndRemove(id).exec();
        return find;
      } else {
        throw new Conflict('Only admin can delete user');
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async setModerator(id: string, req: any): Promise<User> {
    const admin = await this.findToken(req);
    const newSub = await this.userModel.findById(id).exec();
    if (!admin) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (!admin || !newSub) {
        throw new Conflict('User not found');
      }

      if (admin.role === 'admin' && newSub.role === 'user') {
        newSub.role = 'moderator';
        return newSub.save();
      } else if (admin.role === 'admin' && newSub.role === 'moderator') {
        newSub.role = 'user';
        return newSub.save();
      } else {
        throw new Conflict(
          'Only moderator and their subordinates can change user moderator',
        );
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async banUser(id: string, req: any): Promise<User> {
    const admin = await this.findToken(req);
    const newSub = await this.userModel.findById(id);
    if (!admin) {
      throw new Unauthorized('jwt expired');
    }

    if (!admin || !newSub) {
      throw new Conflict('User not found');
    }
    try {
      const adm = admin.role === 'admin' || admin.role === 'moderator';

      if (adm && newSub.ban === false) {
        newSub.ban = true;
        newSub.save();
        return this.userModel.findById(id);
      } else if (adm && newSub.ban === true) {
        newSub.ban = false;
        newSub.save();
        return this.userModel.findById(id);
      } else {
        return this.userModel.findById(id);
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
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

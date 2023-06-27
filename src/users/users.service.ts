/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update.user.dto';
import { RoleUserDto } from './dto/role.user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: User) {}

  async findAll(req: any): Promise<User[]> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user: any = await this.userModel.findById({ _id: findId.id });
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

  async findById(id: string, req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });
      if (user.role === 'admin' || user.role === 'moderator') {
        const find = await this.userModel.findById(id).exec();
        return find;
      }
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
      const payload = {
        id: authUser._id,
      };
      const SECRET_KEY = process.env.SECRET_KEY;
      const token = sign(payload, SECRET_KEY, { expiresIn: '24h' });
      await this.userModel.findByIdAndUpdate(authUser._id, { token });
      const authentificationUser = await this.userModel.findById({
        _id: authUser._id,
      });
      return authentificationUser;
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async logout(req: any): Promise<User> {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new Unauthorized('Not authorized');
    }
    try {
      const SECRET_KEY = process.env.SECRET_KEY;
      const user = verify(token, SECRET_KEY) as JwtPayload;

      await this.userModel.findByIdAndUpdate({ _id: user.id }, { token: null });

      return await this.userModel.findById({ _id: user.id });
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async update(user: UpdateUserDto, req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');
      const { firstName, lastName, phone, location, avatarURL, isOnline } =
        user;

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      await this.userModel.findByIdAndUpdate(
        { _id: findId.id },
        { firstName, lastName, phone, location, avatarURL, isOnline },
      );
      const userUpdate = this.userModel.findById({ _id: findId.id });
      return userUpdate;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async delete(id: string, req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });
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
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const userToUpdate = await this.userModel
        .findById({ _id: findId.id })
        .exec();
      const newSub = await this.userModel.findById(id).exec();

      if (!userToUpdate || !newSub) {
        throw new Conflict('User or moderator not found');
      }

      if (userToUpdate.role === 'user' && newSub.role === 'moderator') {
        userToUpdate.moderator = newSub._id;
        return userToUpdate.save();
      } else if (userToUpdate.role === 'moderator' && newSub.role === 'user') {
        newSub.moderator = userToUpdate._id;
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

  async setRole(id: string, role: RoleUserDto, req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const userAdmin = await this.userModel
        .findById({ _id: findId.id })
        .exec();
      const newRoleSub = await this.userModel.findById(id).exec();

      if (!userAdmin || !newRoleSub) {
        throw new Conflict('User or admin not found');
      }

      if (userAdmin.role === 'admin') {
        newRoleSub.role = role.role;
        return await newRoleSub.save();
      } else {
        throw new Conflict('Only admin  can change user role');
      }
    } catch (e) {
      throw new Conflict(e.message);
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

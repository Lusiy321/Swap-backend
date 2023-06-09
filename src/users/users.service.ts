/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt';



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: User) {}

  async findAll(user: User): Promise<User[]> {
    if (user.role === 'admin') {
      return this.userModel.find().exec();
    } else if (user.role === 'boss') {
      return this.userModel
        .find({ _id: { $in: [...user.subordinates, user._id] } })
        .exec();
    } else {
      return this.userModel.findById(user._id).exec();
    }
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create(dto);
    createdUser.setName(dto.email);
    createdUser.setPassword(dto.password);
    return createdUser.save();
  }

  async update(id: string, user: User, loggedInUser: User): Promise<User> {
    const existingUser: any = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new Error('User not found');
    }

    if (
      loggedInUser.role === 'boss' &&
      loggedInUser.subordinates.includes(existingUser._id)
    ) {
      return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    } else {
      throw new Error('Only boss and their subordinates can update user');
    }
  }

  async delete(id: string, loggedInUser: User): Promise<User> {
    const existingUser: any = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new Error('User not found');
    }

    if (
      loggedInUser.role === 'boss' &&
      loggedInUser.subordinates.includes(existingUser._id)
    ) {
      return this.userModel.findByIdAndRemove(id).exec();
    } else {
      throw new Error('Only boss and their subordinates can delete user');
    }
  }

  async setBoss(
    userId: string,
    bossId: string,
    loggedInUser: User,
  ): Promise<User> {
    const userToUpdate = await this.userModel.findById(userId).exec();
    const newBoss: any = await this.userModel.findById(bossId).exec();

    if (!userToUpdate || !newBoss) {
      throw new Error('User or boss not found');
    }

    if (
      loggedInUser.role === 'boss' &&
      loggedInUser.subordinates.includes(newBoss._id)
    ) {
      userToUpdate.boss = newBoss._id;
      return userToUpdate.save();
    } else {
      throw new Error('Only boss and their subordinates can change user boss');
    }
  }
}

UserSchema.methods.setPassword = async function (password: string) {  
  return this.password = hashSync(password, 10);
};

UserSchema.methods.setName = function (email: string) {
  const parts = email.split("@");
  this.name = parts[0];
};
UserSchema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password);
};
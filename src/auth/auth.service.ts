/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
   constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}
    async validateUser(details: User) {
    console.log('AuthService');
    console.log(details);
    const user = await this.userModel.findOne({ email: details.email });
    console.log(user);
    if (user) return user;
    console.log('User not found. Creating...');
    const newUser = this.userModel.create(details);
    return (await newUser).save();
  }

  async findUser(id: number) {
    const user = await this.userModel.findById({ id });
    return user;
  }
}
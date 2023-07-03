/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.model';
import { GoogleUserDto } from 'src/users/dto/google.user.dto';
import { NotFound } from 'http-errors';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async validateUser(details: GoogleUserDto) {
    try {
      const user = await this.userModel.findOne({ email: details.email });
      if (!user) {
        const newUser = this.userModel.create(details);
        return (await newUser).save();
      }
      return user;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findUser(id: number) {
    const user = await this.userModel.findById({ id });
    return user;
  }
}

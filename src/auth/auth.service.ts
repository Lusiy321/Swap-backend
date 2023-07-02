/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create.user.dto';

@Injectable()
export class AuthService {
   constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}
    async validateUser(details: CreateUserDto) {
    
    const user = await this.userModel.findOne({ email: details.email });
    console.log(user);
      if (!user) {
      const newUser = this.userModel.create(details);
    return (await newUser).save();
    }    
    
  }

  async findUser(id: number) {
    const user = await this.userModel.findById({ id });
    return user;
  }
}
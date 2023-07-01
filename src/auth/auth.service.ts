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
    async findOrCreateUser(googleId: string, firstName: string, email: string): Promise<any> {
    let user = await this.userModel.findOne({ googleId });

    if (!user) {
      
      user = await this.userModel.create({
        googleId,
        firstName,
        email,
      });
    }
    
    return user.save();
  }
}
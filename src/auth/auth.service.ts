/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/users.model';
import { GoogleUserDto } from 'src/users/dto/google.user.dto';
import { NotFound } from 'http-errors';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  static validateUser(): AuthService {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(User.name) private userModel: User,
    private readonly jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(details: GoogleUserDto) {
    try {
      const user = await this.userModel.findOne({ googleId: details.googleId });
      if (!user) {
        const newUser = this.userModel.create(details);
        newUser.save();
        const userUpdateToken = await this.userModel.findOne({
          email: details.email,
        });
        this.userService.createToken(userUpdateToken);
        return await this.userModel.findById({
          _id: userUpdateToken._id,
        });
      }
      this.userService.createToken(user);

      return await this.userModel.findOne({
        _id: user.id,
      });
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findUser(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }
}

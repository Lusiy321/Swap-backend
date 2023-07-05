/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async generateAccessToken(userId: string): Promise<string> {
    const payload = { _id: userId };
    const options = { expiresIn: '15m' };

    return this.jwtService.signAsync(payload, options);
  }

 
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const userId = decoded._id;

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const accessToken = await this.generateAccessToken(userId);

      return accessToken;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

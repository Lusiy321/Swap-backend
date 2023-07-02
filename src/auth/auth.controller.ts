/* eslint-disable prettier/prettier */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';

@Controller('auth')
export class AuthController {
  [x: string]: any;
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect() {
    return { msg: 'Google Ok' }; 
  }

  @Get('status')
  user(@Req() request: any) {
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';
import { UsersService } from 'src/users/users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoogleUserDto } from 'src/users/dto/google.user.dto';
import { PasswordUserDto } from 'src/users/dto/password.user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/users.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    private readonly usersService: UsersService,
  ) {}
  [x: string]: any;

  @ApiOperation({ summary: 'Login Google User' })
  @ApiResponse({ status: 200, type: GoogleUserDto })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return;
  }

  @ApiOperation({ summary: 'Google Authentication' })
  @ApiResponse({ status: 200, type: GoogleUserDto })
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Res() res: any, @Req() req: any) {
    const userId = req.user.id;
    const user = await this.userModel.findById(userId);
    return res.redirect(
      `https://my-app-hazel-nine.vercel.app/product/?token=${user.token}`,
    );
  }

  @ApiOperation({ summary: 'Google Authentication status' })
  @Get('status')
  async user(@Req() request: any) {
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('refresh')
  async refresh(@Req() request: any) {
    return this.usersService.refreshAccessToken(request);
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('change-password')
  async cangePwd(@Req() request: any, @Body() password: PasswordUserDto) {
    return this.usersService.changePassword(request, password);
  }

  @ApiOperation({ summary: 'Verify user email' })
  @Patch('verify-email')
  async verifyEmail(@Req() request: any) {
    return this.usersService.verifyUserEmail(request);
  }
}

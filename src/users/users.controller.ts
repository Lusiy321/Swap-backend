/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';
import { RoleUserDto } from './dto/role.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 200, type: User })
  @Post('/')
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, type: User })
  @Post('login')
  async login(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.login(user);
  }

  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('logout')
  async logout(@Req() request: any): Promise<User> {
    return this.usersService.logout(request);
  }

  @ApiOperation({ summary: 'Get All Users (admin only and moderator role)' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/')
  async findAll(@Req() request: any): Promise<User[]> {
    return this.usersService.findAll(request);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Get(':id')
  async findById(@Param('id') id: string, @Req() request: any): Promise<User> {
    return this.usersService.findById(id, request);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('/')
  async update(
    @Body() user: UpdateUserDto,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.update(user, request);
  }

  @ApiOperation({ summary: 'Delet user (admin only)' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() request: any): Promise<User> {
    return this.usersService.delete(id, request);
  }

  @ApiOperation({ summary: 'Set user role ID admin, moderator or user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/role/:Id')
  async setRole(
    @Param('Id') id: string,
    @Body() role: RoleUserDto,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.setRole(id, role, request);
  }
}

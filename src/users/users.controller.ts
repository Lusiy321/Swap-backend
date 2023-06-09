/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,  
} from '@nestjs/common';
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }
  
  @Get()
  async findAll(@Req() request: any): Promise<User[]> {
    return this.usersService.findAll(request.user);
  }
  
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: User,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.update(id, user, request.user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() request: any): Promise<User> {
    return this.usersService.delete(id, request.user);
  }

  @Put(':id/boss/:bossId')
  async setBoss(
    @Param('id') userId: string,
    @Param('bossId') bossId: string,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.setBoss(userId, bossId, request.user);
  }
}

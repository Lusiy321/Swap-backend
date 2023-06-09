import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() request): Promise<User[]> {
    return this.usersService.findAll(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: User,
    @Req() request,
  ): Promise<User> {
    return this.usersService.update(id, user, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() request): Promise<User> {
    return this.usersService.delete(id, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/boss/:bossId')
  async setBoss(
    @Param('id') userId: string,
    @Param('bossId') bossId: string,
    @Req() request,
  ): Promise<User> {
    return this.usersService.setBoss(userId, bossId, request.user);
  }
}

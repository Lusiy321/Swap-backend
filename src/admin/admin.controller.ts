/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/users/users.model';
import { AdminService } from './admin.service';
import { VerifyPostDto } from 'src/posts/dto/verify.post.dto';
import { Posts } from 'src/posts/posts.model';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  [x: string]: any;

  @ApiOperation({ summary: 'Set ban user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/ban/:Id')
  async setBan(@Param('Id') id: string, @Req() request: any): Promise<User> {
    return this.adminService.banUser(id, request);
  }

  @ApiOperation({ summary: 'Set moderator' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/role/:Id')
  async setRole(@Param('Id') id: string, @Req() request: any): Promise<User> {
    return this.adminService.setModerator(id, request);
  }

  @ApiOperation({ summary: 'Delet user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: any): Promise<User> {
    return this.adminService.delete(id, request);
  }

  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/')
  async findAll(@Req() request: any): Promise<User[]> {
    return this.adminService.findAll(request);
  }
  @ApiOperation({
    summary: 'Verify post enum: [new, aprove, rejected]',
  })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/verify/:Id')
  async setVerify(
    @Body() post: VerifyPostDto,
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.adminService.verifyPost(id, request, post);
  }

  @ApiOperation({ summary: 'Get new Post' })
  @ApiResponse({ status: 200, type: [Posts] })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/new')
  async findNew(@Req() request: any): Promise<Posts[]> {
    return this.adminService.findNewPosts(request);
  }

  @ApiOperation({
    summary: 'Add category',
  })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/category/add/:Id')
  async addCategory(
    @Param('Id') category: string,
    @Req() request: any,
  ): Promise<void> {
    return this.adminService.addCategory(category, request);
  }
}

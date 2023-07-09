/* eslint-disable prettier/prettier */
import { PostsService } from './posts.service';
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create.post.dto';
import { Posts } from './posts.model';

@ApiTags('Post')
@Controller('posts')
    
export class PostsController {
    constructor(private readonly postService: PostsService) { }

@ApiOperation({ summary: 'Create Post' })
@ApiResponse({ status: 200, type: Posts })
@ApiBearerAuth('BearerAuthMethod')
@Post('/')
  async create(@Body() post: CreatePostDto, @Req() request: any,): Promise<Posts> {
    return this.postService.createPost(post, request);
}


@ApiOperation({ summary: 'Get All Post' })
@ApiResponse({ status: 200, type: [Posts] })
@Get('/')
  async findAll(): Promise<Posts[]> {
    return this.postService.findAllPosts();
}
    
@ApiOperation({ summary: 'Get post by ID' })
@ApiResponse({ status: 200, type: Posts })  
@Get('/find/:id')
  async findById(@Param('id') id: string): Promise<Posts> {
    return this.postService.findPostById(id);
}

@ApiOperation({ summary: 'Update post' })
@ApiResponse({ status: 200, type: Posts })
@ApiBearerAuth('BearerAuthMethod')
@Put('/:id')
  async update(
    @Body() post: CreatePostDto,
    @Req() request: any,
    @Param('id') id: string,
  ): Promise<Posts> {
    return this.postService.updatePost(post, id, request);
}

@ApiOperation({ summary: 'Delet user (admin only)' })
@ApiResponse({ status: 200, type: Posts })
@ApiBearerAuth('BearerAuthMethod')
@Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: any): Promise<Posts> {
    return this.postService.deletePost(id, request);
}
    
@ApiOperation({ summary: 'Verify user' })
@ApiResponse({ status: 200, type: Posts })
@ApiBearerAuth('BearerAuthMethod')
@Patch('/verify/:Id')
  async setBan(@Param('Id') id: string, @Req() request: any): Promise<Posts> {
    return this.postService.verifyPost(id, request);
  }
    
}

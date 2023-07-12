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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create.post.dto';
import { Posts } from './posts.model';
import { VerifyPostDto } from './dto/verify.post.dto';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @ApiOperation({ summary: 'Create Post' })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/')
  async create(
    @Body() post: CreatePostDto,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.createPost(post, request);
  }

  @ApiOperation({ summary: 'Get all Post (admin of moderator only)' })
  @ApiResponse({ status: 200, type: [Posts] })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/all')
  async findAll(@Req() request: any): Promise<Posts[]> {
    return this.postService.findAllPosts(request);
  }

  @ApiOperation({ summary: 'Get new Post (admin of moderator only)' })
  @ApiResponse({ status: 200, type: [Posts] })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/new')
  async findNew(@Req() request: any): Promise<Posts[]> {
    return this.postService.findNewPosts(request);
  }

  @ApiOperation({ summary: 'Get my Posts' })
  @ApiResponse({ status: 200, type: [Posts] })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/my')
  async findMy(@Req() request: any): Promise<Posts[]> {
    return this.postService.findMyPosts(request);
  }

  @ApiOperation({ summary: 'Get all aproved Post' })
  @ApiResponse({ status: 200, type: [Posts] })
  @Get('/')
  async findAllAprove(): Promise<Posts[]> {
    return this.postService.findAllAprovedPosts();
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

  @ApiOperation({ summary: 'Verify user enum: [new, aprove, rejected]' })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/verify/:Id')
  async setVerify(
    @Body() post: VerifyPostDto,
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.verifyPost(id, request, post);
  }

  @ApiOperation({ summary: 'Favorite post' })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/fav/:Id')
  async setFavorite(
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.favoritePost(id, request);
  }

  @ApiOperation({ summary: 'Get my favorite post' })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/myfav')
  async setMyFavorite(    
    @Req() request: any,
  ): Promise<Posts[]> {
    return this.postService.findMyFavPosts(request);
  }

  @ApiOperation({ summary: 'Post views' })
  @ApiResponse({ status: 200, type: Posts })
  @Patch('/view/:Id')
  async setViews(@Param('Id') id: string): Promise<Posts> {
    return this.postService.viewPost(id);
  }
}

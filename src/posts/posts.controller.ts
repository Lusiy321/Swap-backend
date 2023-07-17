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
import { CreateCommentDto } from './dto/create.comment.dto';

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
    return this.postService.findAllApprovedPosts();
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

  @ApiOperation({ summary: 'Delet user (admin of moderator only)' })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: any): Promise<Posts> {
    return this.postService.deletePost(id, request);
  }

  @ApiOperation({
    summary:
      'Verify user enum: [new, aprove, rejected] (admin of moderator only)',
  })
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

  @ApiOperation({
    summary: 'Post status (active of not active) (This user only)',
  })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/active/:Id')
  async setActive(
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.activePost(id, request);
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
  async setMyFavorite(@Req() request: any): Promise<Posts[]> {
    return this.postService.findMyFavPosts(request);
  }

  @ApiOperation({ summary: 'Post views' })
  @ApiResponse({ status: 200, type: Posts })
  @Patch('/view/:Id')
  async setViews(@Param('Id') id: string): Promise<Posts> {
    return this.postService.viewPost(id);
  }

  @ApiOperation({
    summary: 'Set comments',
  })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/comments/:Id')
  async setComments(
    @Body() comments: CreateCommentDto,
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.commentPosts(id, request, comments);
  }

  @ApiOperation({
    summary: 'Set comment for comments',
  })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/comments/:postId/:commentId')
  async setAnswerComments(
    @Body() answer: CreateCommentDto,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.answerCommentPosts(
      postId,
      request,
      commentId,
      answer,
    );
  }

  @ApiOperation({
    summary: 'Set propouse for exchange',
  })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/to-exchange/:postId/:userPostId')
  async setExchange(
    @Param('postId') postId: string,
    @Param('userPostId') userPostId: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.toExchangePosts(postId, userPostId, request);
  }

  @ApiOperation({
    summary: 'Set propouse for exchange',
  })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/to-exchange-true/:postId/:userPostId')
  async setExchangeTrue(
    @Param('postId') postId: string,
    @Param('userPostId') userPostId: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.exchangeTruePosts(postId, userPostId, request);
  }

  @ApiOperation({
    summary: 'Set propouse for exchange',
  })
  @ApiResponse({ status: 200, type: Posts })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/to-exchange-false/:postId/:userPostId')
  async setExchangeFalse(
    @Param('postId') postId: string,
    @Param('userPostId') userPostId: string,
    @Req() request: any,
  ): Promise<Posts> {
    return this.postService.exchangeFalsePosts(postId, userPostId, request);
  }
}

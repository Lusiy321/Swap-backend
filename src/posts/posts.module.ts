/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './posts.model';

@Module({
    imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema, collection: 'posts' },
    ]),
  
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

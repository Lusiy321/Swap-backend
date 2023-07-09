/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Posts, PostSchema } from './posts.model';

@Module({
    imports: [
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
    ]),
  
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

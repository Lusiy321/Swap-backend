/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Posts, PostSchema } from './posts.model';
import { User, UserSchema } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
    ]),
      MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
  
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SendGridModule } from './utils/sendgrid.module';
import { PostSchema, Posts } from 'src/posts/posts.model';

@Module({
  imports: [
    SendGridModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1day' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
    ]),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}

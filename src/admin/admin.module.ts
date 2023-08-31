/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostSchema, Posts } from '../posts/posts.model';
import { User, UserSchema } from '../users/users.model';
import { OrderSchema, Orders } from 'src/orders/orders.model';
import { UsersModule } from 'src/users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

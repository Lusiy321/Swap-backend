/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderSchema, Orders } from './orders.model';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './orders.service';
import { User, UserSchema } from 'src/users/users.model';
import { PostSchema, Posts } from 'src/posts/posts.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrdersModule {}

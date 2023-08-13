/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderSchema, Orders } from './orders.model';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './orders.service';
import { User, UserSchema } from 'src/users/users.model';
import { PostSchema, Posts } from 'src/posts/posts.model';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { OrdersArhive, OrdersArhiveSchema } from './orders-arhive.model';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
    MongooseModule.forFeature([
      {
        name: OrdersArhive.name,
        schema: OrdersArhiveSchema,
        collection: 'orders-arhive',
      },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
    ]),
  ],
  exports: [OrderService],
  controllers: [OrdersController],
  providers: [OrderService, UsersService],
})
export class OrdersModule {}

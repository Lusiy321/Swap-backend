/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/users.model';
import { PassportModule } from '@nestjs/passport';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { PostSchema, Posts } from './posts/posts.model';
import { AuthModule } from './auth/auth.module';
import { OrderService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { OrderSchema, Orders } from './orders/orders.model';
import { UsersService } from './users/users.service';
import { OrdersArhive, OrdersArhiveSchema } from './orders/orders-arhive.model';
import { AuctionModule } from './auction/auction.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { UsersController } from './users/users.controller';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot(process.env.DB_HOST),
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
    ]),
    MongooseModule.forFeature([
      {
        name: OrdersArhive.name,
        schema: OrdersArhiveSchema,
        collection: 'orders-arhive',
      },
    ]),
    UsersModule,
    PassportModule.register({ session: true }),
    PostsModule,
    OrdersModule,
    AuctionModule,
    AdminModule,
  ],
  controllers: [
    PostsController,
    AdminController,
    UsersController,
    OrdersController,
  ],
  providers: [PostsService, OrderService, UsersService, AdminService],
})
export class AppModule {}

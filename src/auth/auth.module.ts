/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { User, UserSchema } from '../users/users.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { SessionSerializer } from './utils/Serializer';
import { UsersModule } from 'src/users/users.module';
import { OrderSchema, Orders } from 'src/orders/orders.model';
import { PostSchema, Posts } from 'src/posts/posts.model';

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
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    SessionSerializer,
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    AuthService,
  ],
})
export class AuthModule {}

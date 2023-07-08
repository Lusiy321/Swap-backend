/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';




@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    MongooseModule.forRoot(process.env.DB_HOST),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema, collection: 'users' }]),
    UsersModule, PassportModule.register({ session: true }), PostsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class AppModule {}

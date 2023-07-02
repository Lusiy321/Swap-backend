/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { User, UserSchema } from '../users/users.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { SessionSerializer } from './utils/Serializer';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema, collection: 'users' }]),
    
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
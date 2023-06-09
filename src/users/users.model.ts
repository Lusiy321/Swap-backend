/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Model<User> {
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
    
  })
  name: string;

  @Prop({ type: String, required: [true, 'Email is required'] })
  email: string;

  @Prop({
    type: String,
    minlength: 6,    
    required: [true, 'Password is required'],
  })
  password: string;

  @Prop({ required: true, enum: ['admin', 'boss', 'user'], default: 'user' })
  role: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'User' }], default: [] })
  subordinates: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);

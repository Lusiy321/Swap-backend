/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { role } from './dto/role.user.dto';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User extends Model<User> {
  @ApiProperty({ example: 'Petro', description: 'User first name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
  })
  firstName: string;

  @ApiProperty({ example: 'Poroshenko', description: 'User last name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
  })
  lastName: string;

  @ApiProperty({ example: 'poroshenko@gmail.com', description: 'User email' })
  @Prop({ type: String, required: [true, 'Email is required'] })
  email: string;

  @ApiProperty({ example: 'Petro-123545', description: 'User password' })
  @Prop({
    type: String,
    minlength: 8,
    required: [true, 'Password is required'],
  })
  password: string;

  @ApiProperty({
    example: '+380987894556',
    description: 'User phone number',
  })
  @Prop({
    type: String,
    minlength: 13,
    maxlength: 13,
    default: '+38000000000',
  })
  phone: string;

  @ApiProperty({
    example: 'Kyiv',
    description: 'User location',
  })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
    default: 'Kyiv',
  })
  location: string;

  @ApiProperty({
    example: 'https://',
    description: 'User avatarURL',
  })
  @Prop({
    type: String,
    default: 'https://',
  })
  avatarURL: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @Prop({
    enum: ['admin', 'moderator', 'user'],
    default: 'user',
  })
  role: role;

  @ApiProperty({ example: 'true', description: 'User status' })
  @Prop({
    type: Boolean,
    default: false,
  })
  isOnline: boolean;

  @ApiProperty({
    example: ['64849dc0b92d9a89e4bbf568'],
    description: 'User post ID',
  })
  @Prop({ type: [{ type: 'ObjectId', ref: 'Post' }], default: [] })
  postsId: Array<string>;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'JWT token',
  })
  @Prop({ type: String, default: null })
  token: string;

  @ApiProperty({ example: 'true', description: 'User status' })
  @Prop({
    type: Boolean,
    default: false,
  })
  verify: boolean;

  @ApiProperty({
    example: 'jE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'Verification token',
  })
  @Prop({ type: String, default: null })
  verificationToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

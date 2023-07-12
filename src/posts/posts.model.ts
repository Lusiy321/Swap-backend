/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';
import { verify } from './dto/verify.post.dto';

export type PostDocument = Posts & Document;

@Schema({ versionKey: false, timestamps: true })
export class Posts extends Model<Posts> {
  @ApiProperty({ example: 'My first post', description: 'Post title' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 50,
    required: [true, 'Title is required'],
  })
  title: string;

  @ApiProperty({
    example: 'Change my item for your item',
    description: 'Post description',
  })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 280,
    required: [true, 'Description is required'],
  })
  description: string;

  @ApiProperty({ example: 'Electronics', description: 'Post category' })
  @Prop({ type: String })
  category: string;

  @ApiProperty({
    example:
      'https://ldsound.info/wp-content/uploads/2013/07/25%D0%B0%D1%81128-ldsound_ru-1.jpg',
    description: 'Post image',
  })
  @Prop({
    type: String,
    default:
      'https://ldsound.info/wp-content/uploads/2013/07/25%D0%B0%D1%81128-ldsound_ru-1.jpg',
  })
  img: string;

  @ApiProperty({
    example: '649b2cc373ebdf1b04d734ff',
    description: 'Post favorite',
  })
  @Prop({
    type: Array,
    default: [],
  })
  favorite: Array<string>;

  @ApiProperty({
    example: {
      id: '6470ad832cfa126519500989',
      email: 'inga@mail.com',
      phone: '+38000000000',
    },
    description: 'Post owner',
  })
  @Prop({
    type: Object,
  })
  owner: UpdateUserDto;

  @ApiProperty({
    example: '100',
    description: 'Item price',
  })
  @Prop({
    type: Number,
    default: '0',
  })
  price: number;

  @ApiProperty({ example: 'true', description: 'Post status' })
  @Prop({
    enum: ['new', 'aprove', 'rejected'],
    default: 'new',
  })
  verify: verify;

  @ApiProperty({
    example: '200',
    description: 'Item price',
  })
  @Prop({
    type: Number,
    default: '0',
  })
  views: number;
}

export const PostSchema = SchemaFactory.createForClass(Posts);

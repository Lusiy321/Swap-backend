/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';
import { verify } from './dto/verify.post.dto';
import { CreateCommentDto } from './dto/create.comment.dto';

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
      id: '649aa533a4fc5710d7ceaac3',
      firstName: 'Poroshok',
      lastName: 'Poroh',
      phone: '+380984561225',
      avatarURL:
        'https://res.cloudinary.com/dvt0czglz/image/upload/v1688504857/lsrcstjlmitwcrhhdjon.jpg',
      location: 'Jitomir',
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
    enum: ['new', 'approve', 'rejected'],
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

  @ApiProperty({ example: 'true', description: 'Post to exchange' })
  @Prop({
    type: Array<CreateCommentDto>,
    default: [],
  })
  comments: [CreateCommentDto];

  @ApiProperty({ example: 'true', description: 'Post to exchange' })
  @Prop({
    type: Array<{ data: string; agree: null }>,
    default: [],
  })
  toExchange: [{ data: string; agree: boolean }];
}

export const PostSchema = SchemaFactory.createForClass(Posts);

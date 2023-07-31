/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { verify } from './dto/verify.post.dto';
import { Comment } from './utils/comment.interface';
import { Exchange } from './utils/exchange.interface';

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
    example: 'Kyiv',
    description: 'Item location',
  })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
    default: 'Kyiv',
  })
  location: string;

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
  owner: object;

  @ApiProperty({
    example: '100',
    description: 'Item price',
  })
  @Prop({
    type: Number,
    default: '0',
  })
  price: number;

  @ApiProperty({ example: 'true', description: 'Post moderate status' })
  @Prop({
    enum: ['new', 'approve', 'rejected'],
    default: 'new',
  })
  verify: verify;

  @ApiProperty({ example: 'true', description: 'Post status' })
  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: '200',
    description: 'Item price',
  })
  @Prop({
    type: Number,
    default: '0',
  })
  views: number;

  @ApiProperty({ example: '[]', description: 'Post comments' })
  @Prop({
    type: [
      {
        id: String,
        text: { type: String, required: true },
        user: {
          id: { type: String },
          firstName: String,
          lastName: String,
          phone: String,
          avatarURL: String,
          location: String,
        },
        answer: [
          {
            id: String,
            text: { type: String, required: true },
            user: {
              id: String,
              firstName: String,
              lastName: String,
              phone: String,
              avatarURL: String,
              location: String,
            },
          },
        ],
      },
      { _id: false },
    ],
    default: [],
  })
  comments: Comment[];

  @ApiProperty({ example: '[]', description: 'Post to exchange' })
  @Prop({
    type: [
      {
        id: String,
        agree: { type: Boolean, required: null },
        data: Object,
        user: {
          id: { type: String },
          firstName: String,
          lastName: String,
          phone: String,
          avatarURL: String,
          location: String,
        },
      },
      { _id: false },
    ],
    default: [],
  })
  toExchange: Exchange[];
}

export const PostSchema = SchemaFactory.createForClass(Posts);

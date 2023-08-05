/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Posts } from 'src/posts/posts.model';
import { Chat } from './utils/chat.interface';

export type OrderDocument = Orders & Document;

@Schema({ versionKey: false, timestamps: true })
export class Orders extends Model<Orders> {
  @ApiProperty({
    example: '649aa533a4fc5710d7ceaac3',
    description: 'Item for exchange',
  })
  @Prop({
    type: Object,
  })
  product: Posts;

  @ApiProperty({
    example: '649aa533a4fc5710d7ceaaAA',
    description: 'Offer for exchange',
  })
  @Prop({
    type: Object,
  })
  offer: Posts;

  @ApiProperty({ example: 'true', description: 'order status' })
  @Prop({
    type: Boolean,
    default: null,
  })
  status: boolean;

  @ApiProperty({
    example: {
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
    description: 'Order chat',
  })
  @Prop({
    type: [
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
    default: [],
  })
  chat: Chat[];
}

export const OrderSchema = SchemaFactory.createForClass(Orders);

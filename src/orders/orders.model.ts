/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

export type OrderDocument = Orders & Document;

@Schema({ versionKey: false, timestamps: true })
export class Orders extends Model<Orders> {
  @ApiProperty({
    example: '649aa533a4fc5710d7ceaac3',
    description: 'Item for exchange',
  })
  @Prop({
    type: String,
  })
  product: string;

  @ApiProperty({
    example: '649aa533a4fc5710d7ceaaAA',
    description: 'Offer for exchange',
  })
  @Prop({
    type: String,
    required: [true, 'Title is required'],
  })
  offer: string;

  @ApiProperty({ example: 'true', description: 'order status' })
  @Prop({
    type: Boolean,
    default: true,
  })
  status: boolean;

  @ApiProperty({
    example: {
      userId: '649aa533a4fc5710d7ceaac3',
      text: 'Go to change',
      time: '20.01.2023 17:59',
    },
    description: 'Order chat',
  })
  @Prop({
    type: Array,
    default: [],
  })
  chat: Array<object>;
}

export const OrderSchema = SchemaFactory.createForClass(Orders);

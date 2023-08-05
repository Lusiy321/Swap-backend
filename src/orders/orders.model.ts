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
    type: Object,
  })
  product: object;

  @ApiProperty({
    example: '649aa533a4fc5710d7ceaaAA',
    description: 'Offer for exchange',
  })
  @Prop({
    type: Object,
  })
  offer: object;

  @ApiProperty({ example: 'true', description: 'order status' })
  @Prop({
    type: Boolean,
    default: null,
  })
  status: boolean;

  @ApiProperty({
    example: {
      id: String,
      firstName: String,
      lastName: String,
      phone: String,
      avatarURL: String,
      location: String,
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

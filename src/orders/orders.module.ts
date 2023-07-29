/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderSchema, Orders } from './orders.model';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrdersModule {}

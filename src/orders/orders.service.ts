/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Orders } from './orders.model';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { CreateOredrDto } from './utils/create.order.dto';
import { NotFound } from 'http-errors';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Orders,
    @InjectModel(User.name) private userModel: User,
    @InjectModel(Posts.name) private postModel: Posts,
  ) {}

  async createOrder(postId: string, userPostId: string): Promise<Orders> {
    try {
      const prod = await this.postModel.findById(postId);
      const offer = await this.postModel.findById(userPostId);

      if (!prod || !offer) {
        throw new NotFound('Product or Offer not found');
      }

      const order: CreateOredrDto = {
        product: prod,
        offer: offer,
      };

      const newOrder = await this.orderModel.create(order);

      return newOrder;
    } catch (e) {
      throw new NotFound('Product or Offer not found');
    }
  }
}

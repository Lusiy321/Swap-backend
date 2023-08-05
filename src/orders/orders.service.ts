/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Orders } from './orders.model';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from 'src/posts/posts.model';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/users.model';
import { CreateOredrDto } from './utils/dto/create.order.dto';
import { NotFound, Unauthorized } from 'http-errors';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from './utils/dto/create.message.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Orders,
    @InjectModel(User.name) private userModel: User,
    @InjectModel(Posts.name) private postModel: Posts,
    private userService: UsersService,
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

  async findMyOwnOrder(req: any) {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const post = await this.orderModel
        .find({ 'product.owner.id': user.id })
        .exec();

      if (Array.isArray(post) && post.length === 0) {
        return await this.orderModel.find({ 'offer.owner.id': user.id }).exec();
      }
      return post;
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findOrderById(id: string): Promise<Orders> {
    try {
      const find = await this.orderModel.findById(id).exec();
      return find;
    } catch (e) {
      throw new NotFound('Order not found');
    }
  }

  async chatMessage(
    postId: string,
    req: any,
    message: CreateMessageDto,
  ): Promise<Orders> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }

    try {
      const post = await this.orderModel.findById(postId);

      if (post) {
        const { id, firstName, lastName, phone, avatarURL, location } = user;

        message.user = {
          id,
          firstName,
          lastName,
          phone,
          avatarURL,
          location,
        };
        message.id = uuidv4();
        message.time = Date.now();
        const array = post.chat;
        array.push(message);
        await this.orderModel.updateOne(
          { _id: postId },
          { $set: { chat: array } },
        );
        return await this.orderModel.findById(postId);
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }
}

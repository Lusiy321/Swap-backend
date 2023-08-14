/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Orders } from './orders.model';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from 'src/posts/posts.model';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/users.model';
import { CreateOredrDto } from './dto/create.order.dto';
import { NotFound, Unauthorized } from 'http-errors';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from './dto/create.message.dto';
import { OrdersArhive } from './orders-arhive.model';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Orders,
    @InjectModel(User.name) private userModel: User,
    @InjectModel(Posts.name) private postModel: Posts,
    @InjectModel(OrdersArhive.name)
    private orderArchiveModel: Model<OrdersArhive>,
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
      const postProduct = await this.orderModel
        .find({ 'product.owner.id': user.id })
        .exec();
      const postOffer = await this.orderModel
        .find({ 'offer.owner.id': user.id })
        .exec();
      postProduct.push(...postOffer);

      if (Array.isArray(postProduct) && postProduct.length === 0) {
        return new NotFound('Post not found');
      }
      return postProduct;
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

  async approveOrderAndArhive(orderId: string, req: any): Promise<Orders> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }

    try {
      const order = await this.orderModel.findById(orderId).exec();
      if (order.product.owner.id === user.id) {
        order.productStatus = true;
        order.save();
      } else if (order.offer.owner.id === user.id) {
        order.offerStatus = true;
        order.save();
      } else {
        throw new NotFound('User not found');
      }
      if (order.productStatus === true && order.offerStatus === true) {
        order.status = true;
        order.save();
        const archivedOrder = new this.orderArchiveModel(order.toObject());
        await archivedOrder.save();
        await this.orderModel.findByIdAndDelete(orderId);
        await this.postModel.findByIdAndDelete(order.product.id);
        await this.postModel.findByIdAndDelete(order.offer.id);
        return order;
      }

      return order;
    } catch (e) {
      throw new NotFound('Order not found');
    }
  }

  async rejectOrderAndArhive(orderId: string, req: any): Promise<Orders> {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }

    try {
      const order = await this.orderModel.findById(orderId).exec();
      if (order.product.owner.id === user.id) {
        order.productStatus = false;
        order.status = false;
        order.save();
      } else if (order.offer.owner.id === user.id) {
        order.offerStatus = false;
        order.status = false;
        order.save();
      } else {
        throw new NotFound('User not found');
      }

      if (order.productStatus === false && order.offerStatus === false) {
        const archivedOrder = new this.orderArchiveModel(order.toObject());
        await archivedOrder.save();
        await this.orderModel.findByIdAndDelete(orderId);
        return order;
      }

      return order;
    } catch (e) {
      throw new NotFound('Order not found');
    }
  }

  async findAllApproveOrders(req: any) {
    const user = await this.userService.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const userOffer = await this.orderArchiveModel
        .find({ 'offer.owner.id': user.id })
        .exec();
      const userProduct = await this.orderArchiveModel
        .find({ 'product.owner.id': user.id })
        .exec();
      const sumArr = [...userProduct, ...userOffer];
      if (Array.isArray(sumArr) && sumArr.length === 0) {
        throw new NotFound('Order not found');
      }
      return sumArr;
    } catch (e) {
      throw new NotFound('Order not found');
    }
  }
}

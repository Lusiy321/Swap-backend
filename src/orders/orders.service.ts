/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Orders } from './orders.model';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Orders,
    @InjectModel(User.name) private userModel: User,
    @InjectModel(Posts.name) private postModel: Posts,
  ) {}

  
}

import { Orders } from './orders.model';
import { Posts } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from './dto/create.message.dto';
import { OrdersArhive } from './orders-arhive.model';
import { Model } from 'mongoose';
export declare class OrderService {
    private orderModel;
    private userModel;
    private postModel;
    private orderArchiveModel;
    private userService;
    constructor(orderModel: Orders, userModel: User, postModel: Posts, orderArchiveModel: Model<OrdersArhive>, userService: UsersService);
    createOrder(postId: string, userPostId: string): Promise<Orders>;
    findMyOwnOrder(req: any): Promise<any>;
    findOrderById(id: string): Promise<Orders>;
    chatMessage(postId: string, req: any, message: CreateMessageDto): Promise<Orders>;
    approveOrderAndArhive(orderId: string, req: any): Promise<Orders>;
    rejectOrderAndArhive(orderId: string, req: any): Promise<Orders>;
}

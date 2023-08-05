import { Orders } from './orders.model';
import { Posts } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from './utils/dto/create.message.dto';
export declare class OrderService {
    private orderModel;
    private userModel;
    private postModel;
    private userService;
    constructor(orderModel: Orders, userModel: User, postModel: Posts, userService: UsersService);
    createOrder(postId: string, userPostId: string): Promise<Orders>;
    findMyOwnOrder(req: any): Promise<any>;
    findOrderById(id: string): Promise<Orders>;
    chatMessage(postId: string, req: any, message: CreateMessageDto): Promise<Orders>;
}

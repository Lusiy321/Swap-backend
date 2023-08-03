import { Orders } from './orders.model';
import { Posts } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
export declare class OrderService {
    private orderModel;
    private userModel;
    private postModel;
    constructor(orderModel: Orders, userModel: User, postModel: Posts);
}

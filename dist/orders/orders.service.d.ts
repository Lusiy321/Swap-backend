/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
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
    findAllApproveOrders(req: any): Promise<(import("mongoose").Document<unknown, {}, OrdersArhive> & Omit<OrdersArhive & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
}

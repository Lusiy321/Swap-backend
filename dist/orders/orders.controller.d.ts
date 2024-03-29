import { OrderService } from './orders.service';
import { Orders } from './orders.model';
import { CreateMessageDto } from './dto/create.message.dto';
export declare class OrdersController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(req: any): Promise<Orders[]>;
    setMessage(message: CreateMessageDto, id: string, request: any): Promise<Orders>;
    orderAndArhive(id: string, request: any): Promise<Orders>;
    orderReject(id: string, request: any): Promise<Orders>;
    findById(id: string): Promise<Orders>;
    findArhiveById(id: string): Promise<object>;
    findOrder(req: any): Promise<object[]>;
}

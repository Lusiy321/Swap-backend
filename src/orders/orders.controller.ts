import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OrderService } from './orders.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Orders } from './orders.model';
import { CreateMessageDto } from './utils/dto/create.message.dto';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Find my orders' })
  @ApiResponse({ status: 200, type: [Object] })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/')
  async createOrder(@Req() req: any): Promise<Orders[]> {
    return this.orderService.findMyOwnOrder(req);
  }

  @ApiOperation({
    summary: 'Set chat message',
  })
  @ApiResponse({ status: 200, type: Object })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/message/:Id')
  async setMessage(
    @Body() message: CreateMessageDto,
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<Orders> {
    return this.orderService.chatMessage(id, request, message);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, type: Object })
  @Get('/find/:id')
  async findById(@Param('id') id: string): Promise<Orders> {
    return this.orderService.findOrderById(id);
  }
}

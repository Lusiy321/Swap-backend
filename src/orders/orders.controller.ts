/* eslint-disable prettier/prettier */
import { OrderService } from './orders.service';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Orders } from './orders.model';
import { CreateMessageDto } from './dto/create.message.dto';
import { OrdersArhive } from './orders-arhive.model';

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

  @ApiOperation({
    summary: 'Set approve deal',
  })
  @ApiResponse({ status: 200, type: Object })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/approve/:Id')
  async orderAndArhive(
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<Orders> {
    return this.orderService.approveOrderAndArhive(id, request);
  }

  @ApiOperation({
    summary: 'Set reject deal',
  })
  @ApiResponse({ status: 200, type: Object })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/reject/:Id')
  async orderReject(
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<Orders> {
    return this.orderService.rejectOrderAndArhive(id, request);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, type: Object })
  @Get('/find/:id')
  async findById(@Param('id') id: string): Promise<Orders> {
    return this.orderService.findOrderById(id);
  }

  @ApiOperation({ summary: 'Get arhive order by ID' })
  @ApiResponse({ status: 200, type: Object })
  @Get('/find-arhive/:id')
  async findArhiveById(@Param('id') id: string): Promise<object> {
    return this.orderService.findOrderArhiveById(id);
  }

  @ApiOperation({ summary: 'Find my orders' })
  @ApiResponse({ status: 200, type: [Object] })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/orders-arhive')
  async findOrder(@Req() req: any): Promise<object[]> {
    return this.orderService.findAllApproveOrders(req);
  }
}

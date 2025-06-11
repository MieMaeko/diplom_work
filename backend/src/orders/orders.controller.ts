import { Controller, Post, Body, Get, Session, Put, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const newOrder = await this.ordersService.createOrder(createOrderDto);
      return newOrder;
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      throw new Error('Ошибка при оформлении заказа');
    }
  }

  @Get()
  async getAll(@Query('filter') filter?: string) {
    return this.ordersService.getOrders(filter);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(+id, body.status);
  }
}
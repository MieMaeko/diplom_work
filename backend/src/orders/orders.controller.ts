import { Controller, Post, Body, Get, Session } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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

  @Get('my') 
  async getMyOrders(@Session() session: Record<string, any>) {
    if (!session.userId) {
      return { message: 'User not authenticated' };
    }

    const orders = await this.ordersService.getOrdersByUserId(session.userId);
    return orders;
  }

}
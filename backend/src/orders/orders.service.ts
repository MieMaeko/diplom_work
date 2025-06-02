import { OrderStatus } from './dto/order-status.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = this.ordersRepository.create(createOrderDto);
      return await this.ordersRepository.save(order);
    } catch (error) {
      console.error('Ошибка при сохранении заказа:', error);
      throw new Error('Ошибка при сохранении заказа');
    }
  }
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { user_id: userId },
      order: { orders_id: 'DESC' },
    });
  }

  async getOrders(filter?: string): Promise<Order[]> {
    if (filter === 'planned') {
      return await this.ordersRepository.find({
        where: [
          { status: OrderStatus.ОФОРМЛЕН },
          { status: OrderStatus.ГОТОВИТСЯ },
          { status: OrderStatus.В_ДОСТАВКЕ },
        ],
        order: { delivery_date: 'ASC' },
      });
    }

    return await this.ordersRepository.find({
      order: { delivery_date: 'DESC' },
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<{ success: boolean }> {
    await this.ordersRepository.update(id, { status });
    return { success: true };
  }

}

import { OrderStatus } from './dto/order-status.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/user.entity';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { user_id, items, ...orderData } = createOrderDto;

    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) throw new Error('Пользователь не найден');

    const order = this.ordersRepository.create({
      ...orderData,
      user,
      items,
    });

    return await this.ordersRepository.save(order);
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
        relations: ['user', 'items', 'items.product', 'items.filling'],
      });
    }

    if (filter === 'done') {
      return await this.ordersRepository.find({
        where: [{ status: OrderStatus.ДОСТАВЛЕН }],
        order: { delivery_date: 'ASC' },
        relations: ['user', 'items', 'items.product', 'items.filling'],
      });
    }

    return await this.ordersRepository.find({
      order: { delivery_date: 'DESC' },
      relations: ['user', 'items', 'items.product', 'items.filling'],
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<{ success: boolean }> {
    await this.ordersRepository.update(id, { status });
    return { success: true };
  }
}
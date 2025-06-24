import { OrderStatus } from './dto/order-status.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/user.entity';
import { Addon } from '../addons/addon.entity';
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

    const order = this.ordersRepository.create({ ...orderData, user });

    for (const item of items) {
      const orderItem: any = {
        productId: item.productId ?? null,
        fillingId: item.fillingId,
        quantity: item.quantity,
        weight: item.weight ?? 0,
        price: item.price ?? 0,
        amount: item.amount ?? null,
        isCustom: item.is_custom || false,
        customData: item.custom_data || null,
      };

      if (Array.isArray(item.addonIds) && item.addonIds.length > 0) {
        const addons = await this.ordersRepository.manager.find(Addon, {
          where: { id: In(item.addonIds) },
        });
        orderItem.addons = addons;
      }

      if (!order.items) order.items = [];
      order.items.push(orderItem);
    }

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
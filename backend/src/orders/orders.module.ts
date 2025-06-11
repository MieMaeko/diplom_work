import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order, User, OrderItem])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
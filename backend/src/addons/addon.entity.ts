import { OrderItem } from 'src/orders/order-item.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany
} from 'typeorm';


@Entity('addons')
export class Addon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => OrderItem, orderItem => orderItem.addons)
  orderItems: OrderItem[];
}

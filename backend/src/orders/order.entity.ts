import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity'; 

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_name: string;

  @Column()
  user_phone: string;

  @Column()
  user_email: string;

  @Column()
  address: string;

  @Column({ type: 'date' })
  delivery_date: string;

  @Column()
  delivery_method: string;

  @Column({ type: 'float' })
  total_price: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  comment: string;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];
}

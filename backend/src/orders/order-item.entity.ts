import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';
import { Filling } from '../fillings/filling.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'filling_id' })
  fillingId: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Filling, { eager: true })
  @JoinColumn({ name: 'filling_id' })
  filling: Filling;

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'decimal' })
  price: number;
}

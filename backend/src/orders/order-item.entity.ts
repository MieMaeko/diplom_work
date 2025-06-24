import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';
import { Filling } from '../fillings/filling.entity';
import { Addon } from '../addons/addon.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id', nullable: true })
  productId: number | null;

  @Column({ name: 'filling_id' })
  fillingId: number;

  @ManyToOne(() => Product, { eager: true, nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @ManyToOne(() => Filling, { eager: true })
  @JoinColumn({ name: 'filling_id' })
  filling: Filling;

  @Column({ name: 'amount', nullable: true })
  amount?: number;
  
  @Column()
  quantity: number;

  @Column({ type: 'float', nullable: true })
  weight: number | null;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ name: 'is_custom', default: false })
  isCustom: boolean;

  @Column({ type: 'json', nullable: true })
  customData: {
    shape?: string;
    decor?: string;
    wishes?: string;
    imageUrl?: string;
  } | null;

  @ManyToMany(() => Addon, { eager: true })
  @JoinTable({
    name: 'order_item_addons',
    joinColumn: { name: 'order_item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'addon_id', referencedColumnName: 'id' },
  })
  addons?: Addon[];
}

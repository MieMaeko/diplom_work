import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  orders_id: number;

  @Column()
  user_id: number;

  @Column()
  user_name: string;

  @Column()
  user_phone: string;

  @Column({ unique: true })
  user_email: string;

  @Column()
  address: string;

  @Column()
  delivery_date: string;

  @Column()
  delivery_method: string;

  @Column()
  total_price: number;

  @Column()
  status: string;

  @Column('json')
  items: any[];
  
}
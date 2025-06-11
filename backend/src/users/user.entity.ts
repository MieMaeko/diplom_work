import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './dto/user-role.enum';
import { Order } from '../orders/order.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

   @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

   @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

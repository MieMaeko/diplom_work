import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  img: string;

  @Column()
  type: string;

  @Column()
  category: string;
  
  @Column({ default: true })
  in_stock: boolean;

  @Column()
  amount: number;

}
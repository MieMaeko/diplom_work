// src/products/product.entity.ts
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
  rus_category: string;
  
  @Column()
  category: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fillings')
export class Filling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  img: string;
}
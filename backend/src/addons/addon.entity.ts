import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('addons')
export class Addon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  img: string;
}
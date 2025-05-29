import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('filling')
export class Filling {
  @PrimaryGeneratedColumn()
  id_filling: number;

  @Column()
  name: string;

  @Column()
  img: string;
}
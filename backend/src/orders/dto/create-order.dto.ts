import { IsNumber, IsString, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  user_id: number;

  @IsString()
  address: string;

  @IsString()
  delivery_date: string;

  @IsString()
  delivery_method: string;

  @IsNumber()
  total_price: number;

  @IsString()
  status: string;

  @IsString()
  payment_status: string;

  @IsArray()
  items: any[];
}

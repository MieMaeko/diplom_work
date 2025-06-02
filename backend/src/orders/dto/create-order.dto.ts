import { IsNumber, IsString, IsArray, IsEnum } from 'class-validator';
import { OrderStatus } from './order-status.enum';
export class CreateOrderDto {
  @IsNumber()
  user_id: number;

  @IsString()
  user_name: string;

  @IsString()
  user_phone: string;

  @IsString()
  user_email: string;

  @IsString()
  address: string;

  @IsString()
  delivery_date: string;

  @IsString()
  delivery_method: string;

  @IsNumber()
  total_price: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsArray()
  items: any[];
}

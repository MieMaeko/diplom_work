import { IsNumber, IsString, IsArray, IsEnum, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from './order-status.enum';

class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  fillingId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  price: number;
}

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

  @IsOptional()
  @IsString()
  comment?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

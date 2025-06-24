import {
  IsNumber,
  IsString,
  IsArray,
  IsEnum,
  ValidateNested,
  IsOptional,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from './order-status.enum';


class CustomDataDto {
  @IsString()
  shape: string;

  @IsString()
  decor: string;

  @IsOptional()
  @IsString()
  wishes?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

class OrderItemDto {
  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  fillingId?: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
  
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsBoolean()
  is_custom?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataDto)
  custom_data?: CustomDataDto;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  addonIds?: number[];
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

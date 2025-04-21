import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/:type')
  async getProductsByType(@Param('type') type: string): Promise<Product[]> {
    return this.productService.findByType(type);
  }
}
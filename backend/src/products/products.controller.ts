import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('product/:id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.findProductById(id);
  }
  
  @Get('type/:type')
  async getProductsByType(@Param('type') type: string): Promise<Product[]> {
    return this.productService.findByType(type);
  }

  @Get('type/:type/category/:category')
  async getProductsByTypeAndCategory(
    @Param('type') type: string,
    @Param('category') category: string
  ) {
    return this.productService.findByTypeAndCategory(type, category);
  }

 
}
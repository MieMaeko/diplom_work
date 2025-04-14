import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './product.service';
import { Product } from './product.entity';

@Controller('categories') 
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':type')
  async getProducts(@Param('type') type: string): Promise<Product[]> {
    return this.productsService.getProductsByType(type);
  }

}
@Controller('catalog')  
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}
  @Get(':type/:category')
  async getProductsByCategory(
    @Param('type') type: string,
    @Param('category') category: string
  ): Promise<Product[]> {
    return this.productsService.getProductsByTypeAndCategory(type, category);
  }
}

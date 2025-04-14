import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';  // Сущность продукта

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,  // Репозиторий для работы с продуктами
  ) {}

  // Получаем продукты по типу
  async getProductsByType(type: string): Promise<Product[]> {
    return this.productRepository.find({ where: { type } });  // Фильтрация по типу
  }
  
  async getProductsByTypeAndCategory(type: string, category: string): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        type,
        category,
      },
    });
  }
}
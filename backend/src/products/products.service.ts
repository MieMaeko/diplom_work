import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findByType(type: string): Promise<Product[]> {
    return this.productRepository.find({ where: { type } });
  }

  async findByTypeAndCategory(type: string, category: string): Promise<Product[]> {
    return this.productRepository.find({where:{type,category}})
  }
}
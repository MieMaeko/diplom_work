import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async findByType(type: string): Promise<Product[]> {
    return this.productRepository.find({ where: { type } });
  }

  async findByTypeAndCategory(type: string, category: string): Promise<Product[]> {
    return this.productRepository.find({ where: { type, category } })
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }


    return product;
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async create(dto: CreateProductDto, imageName: string): Promise<Product> {
    const productData: Partial<Product> = {
      name: dto.name,
      price: dto.price,
      category: dto.category,
      type: dto.type,
      in_stock: dto.in_stock,
      img: imageName,
    };

    if (dto.amount !== undefined && dto.amount !== null) {
      productData.amount = dto.amount;
    }

    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async updateProductStatus(id: number, updateData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, updateData);
    const updated = await this.productRepository.findOneBy({ id });
    if (!updated) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    return updated;
  }
}
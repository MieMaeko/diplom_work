import { Controller, Get, Post, UseInterceptors, UploadedFile, Body, Param, Patch } from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
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


  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const folder = `./public/images/catalog/${req.body.type}`;
        cb(null, folder);
      },
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + extname(file.originalname);
        cb(null, uniqueName);
      },
    }),
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateProductDto,
  ) {
    return this.productService.create(body, file.filename);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateData: { in_stock?: boolean },
  ) {
    return this.productService.updateProductStatus(id, updateData);
  }
}
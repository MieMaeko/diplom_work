import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/product.module';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'sweetlana',
      entities: [Product, User],
      synchronize: true,
    }),
    ProductsModule,
    
  ],
})
export class AppModule {}
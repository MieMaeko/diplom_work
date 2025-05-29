import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import { UserModule } from './users/users.module';
import { Filling } from './filling/filling.entity';
import { FillingModule } from './filling/filling.module';
import { Order } from './orders/order.entity';
import { OrdersModule } from './orders/orders.module';
import { SessionModule } from 'nestjs-session';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'sweetlana',
      entities: [Product, User, Filling, Order],
      synchronize: false,
    }),
    ProductsModule, 
    UserModule,
    FillingModule, 
    OrdersModule,
    SessionModule.forRoot({
      session: { secret: 'your-secret-key', resave: false, saveUninitialized: false },
    }),
  ],
})
export class AppModule {}
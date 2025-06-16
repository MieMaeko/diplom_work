import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Filling } from '../fillings/filling.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Addon } from 'src/addons/addon.entity';

export default (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product, User, Filling, Order, OrderItem, Addon],
  synchronize: false,
  logging: false,
  migrationsRun: true,
});

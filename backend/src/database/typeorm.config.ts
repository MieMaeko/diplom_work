import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Filling } from '../fillings/filling.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Addon } from 'src/addons/addon.entity';

export default (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'sweetlana',
  entities: [Product, User, Filling, Order, OrderItem, Addon],
  synchronize: false,
  logging: false,
  migrationsRun: false,
});

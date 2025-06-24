import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { UserModule } from './users/users.module';
import { FillingModule } from './fillings/filling.module';
import { OrdersModule } from './orders/orders.module';
import { SessionModule } from 'nestjs-session';
import { DatabaseModule } from './database/database.module';
import { AddonsModule } from './addons/addon.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProductsModule,
    UserModule,
    FillingModule,
    OrdersModule,
    AddonsModule,
    SessionModule.forRoot({
      session: {
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'images'),
      serveRoot: '/images',
    }),
  ],
})
export class AppModule { }

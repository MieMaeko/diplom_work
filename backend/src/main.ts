import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Connection} from 'typeorm'
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',  
    credentials: true, 
  }); 
  app.use(
    session({
      secret: 'your-secret-key', 
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },  
    }),
  );

  const connection = app.get(Connection);
  try {
    await connection.query('SELECT 1');
    console.log('Подключение к базе данных успешно!');

    await app.listen(3001); 
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }

}

bootstrap();

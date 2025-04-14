import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',  
  });
  app.use(
    session({
      secret: 'secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, 
    }),
  );
  await app.listen(3000);
}

bootstrap();

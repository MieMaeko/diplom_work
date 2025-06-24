import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import './polyfill';
import { AppModule } from './app.module';
import { Connection } from 'typeorm';
import * as session from 'express-session';
import { corsOptions } from './config/cors.config';
import { validationPipe } from './config/validation.config';
import { sessionOptions } from './config/session.config';
import { checkDatabaseConnection } from './utils/database.util';

import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors(corsOptions);
  app.use(session(sessionOptions));
  app.useGlobalPipes(validationPipe);

  const connection = app.get(Connection);
  await checkDatabaseConnection(connection);

  await app.listen(process.env.PORT || 3001);
}

bootstrap();

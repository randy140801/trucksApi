import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // <-- frontend port
    credentials: true,
  });
  await app.listen(3001); // o el puerto que uses
}
bootstrap();

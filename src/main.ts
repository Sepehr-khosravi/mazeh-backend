import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//config
import { ConfigService } from '@nestjs/config';
const config = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist : true
  }))
  await app.listen(config.get("PORT") ?? 3000);
}
bootstrap();

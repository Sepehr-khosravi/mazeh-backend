import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//config
import { ConfigService } from '@nestjs/config';
const config = new ConfigService();

//for controlling version app:
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //add a basic url
    app.setGlobalPrefix('api');
  
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
  
  
  
    await app.listen(config.get("PORT") ?? 3000);
}
bootstrap();

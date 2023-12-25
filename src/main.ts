import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    const port = configService.getOrThrow<number>('PORT');
    const cookieSecret = configService.getOrThrow<string>('COOKIE_SECRET');

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser(cookieSecret));
    app.setGlobalPrefix('api/v1');

    await app.listen(port);
}

bootstrap();

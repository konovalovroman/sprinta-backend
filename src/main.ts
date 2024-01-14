import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    const port = configService.getOrThrow<number>('PORT');
    const cookieSecret = configService.getOrThrow<string>('COOKIE_SECRET');

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser(cookieSecret));
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        credentials: true,
    });

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Sprinta API')
        .setDescription('Sprinta API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, swaggerDocument);

    await app.listen(port);
}

bootstrap();

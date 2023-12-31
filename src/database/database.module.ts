import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.getOrThrow<string>('DB_HOST'),
                    port: configService.getOrThrow<number>('DB_PORT'),
                    username: configService.getOrThrow<string>('DB_USER'),
                    password: configService.getOrThrow<string>('DB_PASSWORD'),
                    database: configService.getOrThrow<string>('DB_NAME'),
                    entities: [
                        __dirname + '/../core/**/entities/*.entity{.js,.ts}',
                    ],
                    migrations: [
                        __dirname + '/migrations/**/*{.ts,.js}',
                    ],
                };
            },
        }),
    ],
})
export class DatabaseModule {}

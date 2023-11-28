import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './common/guards/jwt-access.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CoreModule,
        DatabaseModule,
        AuthModule,
        RedisModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAccessGuard,
        },
    ],
})
export class AppModule {}

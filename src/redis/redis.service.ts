import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';

@Injectable()
export class RedisService {
    public readonly client: Redis;

    constructor(private readonly configService: ConfigService) {
        const options: RedisOptions = {
            host: configService.getOrThrow('REDIS_HOST'),
            port: configService.getOrThrow('REDIS_PORT'),
        };

        this.client = new Redis(options);

        this.client.on('error', (err) => {
            throw err;
        });
    }
}

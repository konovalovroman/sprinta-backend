import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        __dirname + '/../core/**/entities/*.entity{.js,.ts}',
    ],
    migrations: [
        __dirname + '/migrations/**/*{.ts,.js}',
    ],
});

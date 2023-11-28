import { JwtPayload } from 'src/auth/types/jwt-payload.type';

declare module 'express' {
    export interface Request {
        user: JwtPayload;
    }
}

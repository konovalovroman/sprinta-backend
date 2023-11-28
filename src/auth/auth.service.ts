import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/core/users/users.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtTokens } from './types/jwt-tokens.type';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareHashAndString, hashString } from 'src/common/helpers/hash.helper';
import { authRefreshTokenKey } from 'src/redis/redis.keys';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;

    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) {
        this.accessTokenSecret = this.configService.getOrThrow('JWT_ACCESS_SECRET');
        this.refreshTokenSecret = this.configService.getOrThrow('JWT_REFRESH_SECRET');
    }

    async signupLocal(dto: SignupDto): Promise<JwtTokens | null> {
        const user = await this.usersService.create(dto);
        if (!user) {
            return null;
        }
        const tokens = await this.getTokens(user.id);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    async signinLocal(dto: SigninDto): Promise<JwtTokens | null> {
        const { email, password } = dto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordMatches = await compareHashAndString(user.password, password);
        if (!isPasswordMatches) {
            return null;
        }
        const tokens = await this.getTokens(user.id);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: number): Promise<void> {
        await this.deleteRefreshTokenHash(userId);
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<JwtTokens | null> {
        const user = await this.usersService.findById(userId);
        const isRefreshTokenHashMatches = await this.compareRefreshTokenHash(user.id, refreshToken);
        if (!isRefreshTokenHashMatches) {
            await this.deleteRefreshTokenHash(user.id);
            return null;
        }
        const tokens = await this.getTokens(user.id);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    private async getTokens(userId: number): Promise<JwtTokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                },
                {
                    secret: this.accessTokenSecret,
                    expiresIn: '10m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                }, {
                    secret: this.refreshTokenSecret,
                    expiresIn: '30d',
                },
            ),
        ]);
        return { accessToken, refreshToken };
    }

    private async updateRefreshTokenHash(userId: number, refreshToken: string): Promise<void> {
        const refreshTokenHash = await hashString(refreshToken);
        await this.redisService.client.set(
            authRefreshTokenKey(userId),
            refreshTokenHash,
            'EX',
            60 * 60 * 24 * 30
        );
    }

    private async compareRefreshTokenHash(userId: number, refreshToken: string): Promise<boolean> {
        const refreshTokenHash = await this.redisService.client.get(authRefreshTokenKey(userId));
        if (!refreshTokenHash) {
            return false;
        }
        return await compareHashAndString(refreshTokenHash, refreshToken);
    }

    private async deleteRefreshTokenHash(userId: number): Promise<void> {
        await this.redisService.client.del(authRefreshTokenKey(userId));
    }
}

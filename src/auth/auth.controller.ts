import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('local/signup')
    async signupLocal(@Body() dto: SignupDto, @Res({ passthrough: true }) response: Response) {
        const tokens = await this.authService.signupLocal(dto);
        if (!tokens) {
            throw new BadRequestException('Sign up error');
        }
        const { accessToken, refreshToken } = tokens;
        response.cookie('refreshToken', refreshToken, { httpOnly: true });
        return { accessToken };
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('local/signin')
    async signinLocal(@Body() dto: SigninDto, @Res({ passthrough: true }) response: Response) {
        const tokens = await this.authService.signinLocal(dto);
        if (!tokens) {
            throw new BadRequestException('Sign in error');
        }
        const { accessToken, refreshToken } = tokens;
        response.cookie('refreshToken', refreshToken, { httpOnly: true });
        return { accessToken };
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    async logout(
        @CurrentUser('sub') userId: number,
        @Res({ passthrough: true }) response: Response
    ) {
        await this.authService.logout(userId);
        response.cookie('refreshToken', '', { httpOnly: true });
        return;
    }

    @PublicRoute()
    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refreshTokens(
        @CurrentUser('sub') userId: number,
        @Cookies('refreshToken') refreshToken: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        const tokens = await this.authService.refreshTokens(userId, refreshToken);
        if (!tokens) {
            throw new UnauthorizedException();
        }
        const { accessToken, refreshToken: newRefreshToken } = tokens;
        response.cookie('refreshToken', newRefreshToken, { httpOnly: true });
        return { accessToken };
    }
}

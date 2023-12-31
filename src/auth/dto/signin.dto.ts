import { IsString, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
    @IsEmail()
    @ApiProperty({ example: 'example@mail.com' })
    email: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    @ApiProperty({ example: 'Asdf1234' })
    password: string;
}

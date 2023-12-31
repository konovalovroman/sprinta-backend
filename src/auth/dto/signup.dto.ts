import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @IsEmail()
    @ApiProperty({ example: 'example@mail.com' })
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @ApiProperty({ example: 'example_user' })
    username: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    @ApiProperty({ example: 'Asdf1234' })
    password: string;
}

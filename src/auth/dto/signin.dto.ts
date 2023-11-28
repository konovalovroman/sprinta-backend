import { IsString, IsEmail, Matches } from 'class-validator';

export class SigninDto {
    @IsEmail()
    email: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    password: string;
}

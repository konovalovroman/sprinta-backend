import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class SignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    password: string;
}

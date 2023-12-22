import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchUsersDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    username?: string;
}

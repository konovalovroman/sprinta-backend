import { IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @IsOptional()
    username?: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    @IsOptional()
    password?: string;
}

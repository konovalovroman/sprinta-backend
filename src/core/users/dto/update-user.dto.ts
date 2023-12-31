import { IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @IsOptional()
    @ApiProperty({ example: 'example' })
    username?: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    @IsOptional()
    @ApiProperty({ example: 'Asdf1234' })
    password?: string;
}

import { IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSprintDto {
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @IsOptional()
    @ApiProperty({ example: 'New sprint name' })
    name?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true })
    started?: boolean;
}

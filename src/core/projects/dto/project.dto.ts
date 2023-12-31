import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @ApiProperty({ example: 'Example' })
    name: string;
}

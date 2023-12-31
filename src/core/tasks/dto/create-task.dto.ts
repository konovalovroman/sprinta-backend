import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 1 })
    sprintId: number;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    @ApiProperty({ example: 'Example task' })
    name: string;

    @IsString()
    @ApiProperty({ example: 'Example description' })
    description: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    @ApiProperty({ example: 5 })
    estimation: number;
}

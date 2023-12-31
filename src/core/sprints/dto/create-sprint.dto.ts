import { IsDateString, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSprintDto {
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 1 })
    projectId: number;

    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @ApiProperty({ example: 'Example sprint' })
    name: string;

    @IsDateString()
    @ApiProperty({ example: '2023-12-31T00:00:00.000Z' })
    endsAt: Date;
}

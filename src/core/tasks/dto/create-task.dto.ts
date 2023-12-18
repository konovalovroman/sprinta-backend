import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    estimation: number;
}
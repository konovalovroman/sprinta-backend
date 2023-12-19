import { IsDateString, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateSprintDto {
    @IsNumber()
    @Min(0)
    projectId: number;

    @IsString()
    @MinLength(1)
    @MaxLength(40)
    name: string;

    @IsDateString()
    endsAt: Date;
}

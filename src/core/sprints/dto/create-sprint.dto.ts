import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSprintDto {
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    name: string;

    @IsDateString()
    endsAt: Date;
}

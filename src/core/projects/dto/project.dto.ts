import { IsString, MaxLength, MinLength } from 'class-validator';

export class ProjectDto {
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    name: string;
}

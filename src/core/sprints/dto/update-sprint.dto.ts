import { IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSprintDto {
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @IsOptional()
    name?: string;

    @IsBoolean()
    @IsOptional()
    started?: boolean;
}

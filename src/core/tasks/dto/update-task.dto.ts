import {
    IsString,
    MinLength,
    MaxLength,
    IsNumber,
    Min,
    Max,
    IsOptional,
    IsEnum,
} from 'class-validator';
import { TaskStatus } from 'src/common/enums/taskStatus.enum';


export class UpdateTaskDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    estimation?: number;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;
}

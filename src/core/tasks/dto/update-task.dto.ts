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
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    @IsOptional()
    @ApiProperty({ example: 'New task name' })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'New task description' })
    description?: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    @ApiProperty({ example: 8 })
    estimation?: number;

    @IsEnum(TaskStatus)
    @IsOptional()
    @ApiProperty({
        enum: TaskStatus,
        example: TaskStatus.IN_PROGRESS,
    })
    status?: TaskStatus;
}

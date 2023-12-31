import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 1 })
    taskId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Text of your comment' })
    text: string;
}

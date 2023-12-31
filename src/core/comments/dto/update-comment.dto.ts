import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'New text of your comment' })
    text: string;
}

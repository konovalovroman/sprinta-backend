import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCommentDto {
    @IsNumber()
    @Min(0)
    taskId: number;

    @IsString()
    @IsNotEmpty()
    text: string;
}

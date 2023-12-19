import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    async create(
        @CurrentUser('sub') currentUserId: number,
        @Body() dto: CreateCommentDto,
    ) {
        const comment = await this.commentsService.create({
            currentUserId,
            dto,
        });

        if (!comment) {
            throw new BadRequestException('Comment creation error');
        }

        return comment;
    }

    @Get('tasks/:taskId')
    async find(
        @Param('taskId', ParseIntPipe) taskId: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const comments = await this.commentsService.findTaskComments({
            taskId,
            currentUserId,
        });

        if (!comments.length) {
            throw new BadRequestException('Comments not found for given task');
        }

        return comments;
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const comment = await this.commentsService.findOneCommentForUser({
            id,
            currentUserId,
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        return comment;
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
        @Body() dto: UpdateCommentDto,
    ) {
        const comment = await this.commentsService.update({
            id,
            currentUserId,
            dto,
        });

        if (!comment) {
            throw new BadRequestException('Comment updating error');
        }

        return comment;
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        await this.commentsService.remove({
            id,
            currentUserId,
        });
        return;
    }
}   

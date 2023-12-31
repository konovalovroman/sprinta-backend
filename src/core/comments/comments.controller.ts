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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Return created comment for task',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Comment creation error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return comments for task',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Comments not found',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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
            throw new NotFoundException('Comments not found for given task');
        }

        return comments;
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return one comment',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Comment not found',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return updated comment',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Comment updating error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Removes one comment',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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

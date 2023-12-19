import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

export type CreateCommentData = {
    currentUserId: number,
    dto: CreateCommentDto,
};

export type TaskCommentsQuery = {
    taskId: number,
    currentUserId: number,
};

export type CommentManipulationData = {
    id: number,
    currentUserId: number,
    dto?: UpdateCommentDto,
};

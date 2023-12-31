import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentManipulationData, CreateCommentData, TaskCommentsQuery } from './comments.types';
import { TasksService } from '../tasks/tasks.service';
import { isUserProjectMember } from 'src/common/helpers/project-users.helper';
import { User } from '../users/entities/user.entity';
import { hasRecordAffected } from 'src/common/helpers/affected-record.helper';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger(CommentsService.name);

    constructor(
        @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
        private readonly tasksService: TasksService,
    ) {}

    async create(data: CreateCommentData): Promise<Comment | null> {
        const { currentUserId, dto } = data;
        const { taskId, text } = dto;

        const task = await this.tasksService.findById(taskId);
        const isProjectMember = isUserProjectMember(task?.project, currentUserId);

        if (!task || !isProjectMember) return null;

        const comment = this.commentsRepository.create({
            text,
            task,
            project: task.project,
            author: { id: currentUserId } as User,
        });

        try {
            const result = await this.commentsRepository.save(comment);
            delete result.author;
            return result;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async find(): Promise<Comment[]> {
        try {
            const comments = await this.commentsRepository.find();
            return comments;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    async findById(id: number): Promise<Comment | null> {
        try {
            const comment = await this.commentsRepository.findOne({
                where: { id },
            });

            return comment;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async update(data: CommentManipulationData): Promise<Comment | null> {
        const { id, currentUserId, dto } = data;
        try {
            const comment = await this.findOneCommentAuthoredByUser({
                id,
                currentUserId,
            });

            if (!comment) return null;

            comment.text = dto.text;

            return await this.commentsRepository.save(comment);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async remove(data: CommentManipulationData): Promise<boolean> {
        const { id, currentUserId } = data;
        try {
            const comment = await this.findOneCommentAuthoredByUser({
                id,
                currentUserId,
            });

            if (!comment) return false;

            const result = await this.commentsRepository.delete(id);
            return hasRecordAffected(result);
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }

    async findTaskComments(data: TaskCommentsQuery): Promise<Comment[] | null> {
        const { taskId, currentUserId } = data;
        try {
            const comments = await this.commentsRepository.find({
                where: {
                    task: { id: taskId },
                    project: { members: { id: currentUserId } },
                },
                relations: ['author'],
            });
            
            return comments;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async findOneCommentForUser(data: CommentManipulationData): Promise<Comment | null> {
        const { id, currentUserId } = data;
        try {
            const comment = await this.commentsRepository.findOne({
                where: {
                    id,
                    project: { members: { id: currentUserId } },
                },
                relations: ['task', 'author'],
            });

            return comment;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async findOneCommentAuthoredByUser(data: CommentManipulationData): Promise<Comment | null> {
        const { id, currentUserId } = data;
        try {
            const comment = await this.commentsRepository.findOne({
                where: {
                    id,
                    project: { members: { id: currentUserId } },
                    author: { id: currentUserId },
                },
                relations: ['task'],
            });

            return comment;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}

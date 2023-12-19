import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { SprintsService } from '../sprints/sprints.service';
import { CreateTaskData, SprintTasksQuery, TaskManipulationData } from './tasks.types';
import { TaskStatus } from 'src/common/enums/taskStatus.enum';
import { User } from '../users/entities/user.entity';
import { hasRecordAffected } from 'src/common/helpers/affected-record.helper';
import { isUserProjectMember } from 'src/common/helpers/project-users.helper';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
        private readonly sprintsService: SprintsService,
    ) {}

    async create(data: CreateTaskData): Promise<Task | null> {
        const { currentUserId, dto } = data;
        const { sprintId, name, description, estimation } = dto;

        const sprint = await this.sprintsService.findById(sprintId);
        const isProjectMember = isUserProjectMember(sprint?.project, currentUserId);

        if (!sprint || !isProjectMember) {
            return null;
        }
        
        const taskData: Partial<Task> = {
            name,
            description,
            estimation,
            status: sprint.started ? TaskStatus.BACKLOG : TaskStatus.TO_DO,
            sprint,
            author: { id: currentUserId } as User,
            project: sprint?.project,
        };

        const task = this.tasksRepository.create(taskData);

        try {
            const result = await this.tasksRepository.save(task);

            delete result.author;
            delete result.sprint;

            return result;
        } catch(err) {
            this.logger.error(err);
            return null;
        }
    }

    async find(): Promise<Task[]> {
        try {
            const tasks = await this.tasksRepository.find({
                relations: ['author'],
            });
            return tasks;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    async findById(id: number): Promise<Task | null> {
        try {
            const task = await this.tasksRepository.findOne({
                where: { id },
                relations: ['author', 'project.members'],
            });
            return task;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async update(data: TaskManipulationData): Promise<Task | null> {
        const { id, currentUserId, dto } = data;
        try {
            const task = await this.tasksRepository.findOne({
                where: {
                    id,
                },
                relations: ['author', 'sprint', 'project.members'],
            });
            const isProjectMember = isUserProjectMember(task?.project, currentUserId);
            
            if (!task || !isProjectMember) {
                return null;
            }

            const isSprintStarted = task.sprint.started;
            const { name, description, estimation, status } = dto;

            if (name) {
                task.name = name;
            }
            if (description) {
                task.description = description;
            }
            if (estimation) {
                task.estimation = estimation;
            }

            const isStatusUpdates = status &&
                isSprintStarted &&
                task.status !== TaskStatus.BACKLOG &&
                status !== TaskStatus.BACKLOG;

            if (isStatusUpdates) {
                task.status = status;
            }

            delete task.sprint;

            return await this.tasksRepository.save(task);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async remove(data: TaskManipulationData): Promise<boolean> {
        const { id, currentUserId } = data;
        try {
            const task = await this.tasksRepository.findOne({
                where: {
                    id,
                },
                relations: ['author', 'project.members'],
            });
            const isProjectMember = isUserProjectMember(task?.project, currentUserId);            

            if (!task || !isProjectMember) {
                return false;
            }

            const result = await this.tasksRepository.delete(id);
            return hasRecordAffected(result);
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }

    async findSprintTasks(data: SprintTasksQuery): Promise<Task[] | null> {
        const { sprintId, currentUserId } = data;
        try {
            const tasks = await this.tasksRepository.find({
                where: {
                    sprint: {
                        id: sprintId,
                    },
                },
                relations: ['author', 'project.members'],
            });

            const isProjectMember = isUserProjectMember(tasks[0]?.project, currentUserId);
            if (!isProjectMember) {
                return null;
            }

            tasks.forEach((task) => {
                delete task.sprint;
            });

            return tasks;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async findSprintTaskById(data: TaskManipulationData): Promise<Task | null> {
        const { id, currentUserId } = data;
        try {
            const task = await this.tasksRepository.findOne({
                where: {
                    id,
                },
                relations: ['sprint', 'project.members'],
            });

            const isProjectMember = isUserProjectMember(task?.project, currentUserId);
            if (!isProjectMember) {
                return null;
            }

            return task;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}

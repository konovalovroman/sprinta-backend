import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { SprintsService } from '../sprints/sprints.service';
import { CreateTaskData, SprintTasksQuery, TaskManipulationData } from './tasks.types';
import { TaskStatus } from 'src/common/enums/taskStatus.enum';
import { User } from '../users/entities/user.entity';
import { hasRecordAffected } from 'src/common/helpers/affected-record.helper';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
        private readonly sprintsService: SprintsService,
    ) {}

    async create(data: CreateTaskData): Promise<Task | null> {
        const { sprintId, currentUserId, dto } = data;
        const sprint = await this.sprintsService.findById(sprintId);

        const isUserProjectMember = sprint?.project.members.some((user) => {
            return user.id === currentUserId;
        });

        if (!sprint || !isUserProjectMember) {
            return null;
        }
        
        const { name, description, estimation } = dto;

        const taskData: Partial<Task> = {
            name,
            description,
            estimation,
            status: sprint.started ? TaskStatus.BACKLOG : TaskStatus.TO_DO,
            sprint,
            author: { id: currentUserId } as User,
        };

        const task = this.tasksRepository.create(taskData);

        try {
            const result =  await this.tasksRepository.save(task);

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
                relations: ['author'],
            });
            return task;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async update(data: TaskManipulationData): Promise<Task | null> {
        const { id, sprintId, currentUserId, dto } = data;
        try {
            const task = await this.tasksRepository.findOne({
                where: {
                    id,
                    sprint: { id: sprintId },
                },
                relations: ['author', 'sprint', 'sprint.project.members'],
            });
            console.log(task);
            const isUserProjectMember = task?.sprint.project.members.some((user) => {
                return user.id === currentUserId;
            });

            if (!task || !isUserProjectMember) {
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
        const { id, sprintId, currentUserId } = data;
        try {
            const task = await this.tasksRepository.findOne({
                where: {
                    id,
                    sprint: { id: sprintId },
                },
                relations: ['author', 'sprint', 'sprint.project.members'],
            });
            const isUserProjectMember = task?.sprint.project.members.some((user) => {
                return user.id === currentUserId;
            });

            if (!task || !isUserProjectMember) {
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
                relations: ['author', 'sprint.project.members'],
            });

            const project = tasks[0]?.sprint.project;
            const isUserProjectMember = project.members.some((user) => {
                return user.id === currentUserId;
            });

            if (!isUserProjectMember) {
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
        const { id, sprintId, currentUserId } = data;
        try {
            const task = await this.tasksRepository.findOne({
                where: {
                    id,
                    sprint: { id: sprintId },
                },
                relations: ['sprint', 'sprint.project', 'sprint.project.members'],
            });

            const isUserProjectMember = task?.sprint.project.members.some((user) => {
                return user.id === currentUserId;
            });

            if (!isUserProjectMember) {
                return null;
            }

            return task;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}

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
import { TasksService } from './tasks.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    async create(
        @CurrentUser('sub') currentUserId: number,
        @Body() dto: CreateTaskDto,
    ) {
        const task = await this.tasksService.create({
            currentUserId,
            dto,
        });

        if (!task) {
            throw new BadRequestException('Task creation error');
        }

        return task;
    }

    @Get('sprints/:sprintId')
    async find(
        @Param('sprintId', ParseIntPipe) sprintId: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const tasks = await this.tasksService.findSprintTasks({
            sprintId,
            currentUserId,
        });

        if (!tasks.length) {
            throw new NotFoundException('Tasks not found for a given sprint');
        }

        return tasks;
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const task = await this.tasksService.findTaskForProjectMemberById({
            id,
            currentUserId,
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
        @Body() dto: UpdateTaskDto,
    ) {
        const task = await this.tasksService.update({
            id,
            currentUserId,
            dto,
        });

        if (!task) {
            throw new BadRequestException('Task updating error');
        }

        return task;
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        await this.tasksService.remove({
            id,
            currentUserId,
        });
        return;
    }
}

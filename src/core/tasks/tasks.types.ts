import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export type CreateTaskData = {
    sprintId: number,
    currentUserId: number,
    dto: CreateTaskDto,
};

export type SprintTasksQuery = {
    sprintId: number,
    currentUserId: number,
};

export type TaskManipulationData = {
    id: number;
    sprintId: number;
    currentUserId: number;
    dto?: UpdateTaskDto;
};

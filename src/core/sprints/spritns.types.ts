import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

export type CreateSprintData = {
    projectId: number,
    currentUserId: number,
    dto: CreateSprintDto,
};

export type SprintManipulationData = {
    id: number,
    projectId: number,
    currentUserId: number,
    dto?: UpdateSprintDto,
};

export type ProjectSprintsQuery = {
    projectId: number,
    currentUserId: number,
};

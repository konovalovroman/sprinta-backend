import { ProjectDto } from './dto/project.dto';

export type CreateProjectData = ProjectDto & { ownerId: number };

export type ProjectManipulationData = {
    id: number,
    currentUserId: number,
    dto?: ProjectDto,
};

export type ProjectMemberManipulationData = {
    id: number,
    userId: number,
    currentUserId: number,
};

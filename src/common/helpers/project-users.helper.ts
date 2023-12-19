import { Project } from 'src/core/projects/entities/project.entity';

export const isUserProjectMember = (project: Project | undefined, userId: number): boolean => {
    return project?.members.some((user) => {
        return user.id === userId;
    }) || false;
};

export const isUserProjectOwner = (project: Project | undefined, userId: number): boolean => {
    return project?.owner?.id === userId;
};

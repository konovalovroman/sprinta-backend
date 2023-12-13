import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sprint } from './entities/sprints.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { CreateSprintData, ProjectSprintsQuery, SprintManipulationData } from './spritns.types';
import { hasRecordAffected } from 'src/common/helpers/affected-record.helper';

@Injectable()
export class SprintsService {
    private readonly logger = new Logger(SprintsService.name);

    constructor(
        @InjectRepository(Sprint) private readonly sprintsRepository: Repository<Sprint>,
        private readonly projectsService: ProjectsService,
    ) {}

    async create(data: CreateSprintData): Promise<Sprint | null> {
        const { projectId, currentUserId, dto } = data;
        const project = await this.projectsService.findById(projectId);
        const isProjectOwner = project?.owner?.id === currentUserId;

        if (!project || !isProjectOwner) {
            return null;
        }

        delete project.members;

        const sprint = this.sprintsRepository.create(dto);
        sprint.project = project;

        try {
            return await this.sprintsRepository.save(sprint);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async find(): Promise<Sprint[]> {
        try {
            const sprints = await this.sprintsRepository.find({
                relations: ['project'],
            });
            return sprints;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    async findById(id: number): Promise<Sprint | null> {
        try {
            const sprint = await this.sprintsRepository.findOne({
                where: { id },
                relations: ['project.owner', 'project.members'],
            });
            return sprint;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async update(data: SprintManipulationData): Promise<Sprint | null> {
        const { id, projectId, currentUserId, dto } = data;
        const sprint = await this.findById(id);
        const isSprintForProject = sprint?.project.id === projectId;
        const isProjectOwner = sprint?.project.owner?.id === currentUserId;

        if (!sprint || !isSprintForProject || !isProjectOwner) {
            return null;
        }

        const { name, started } = dto;

        if (name) {
            sprint.name = name;
        }
        if (started !== undefined) {
            sprint.started = started;
        }

        try {
            return await this.sprintsRepository.save(sprint);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async remove(data: SprintManipulationData): Promise<boolean> {
        const { id, projectId, currentUserId } = data;
        const sprint = await this.findById(id);
        const isSprintForProject = sprint?.project.id === projectId;
        const isProjectOwner = sprint?.project.owner?.id === currentUserId;

        if (!sprint || !isSprintForProject || !isProjectOwner) {
            return false;
        }

        try {
            const result = await this.sprintsRepository.delete(id);
            return hasRecordAffected(result);
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }

    async findProjectSprints(data: ProjectSprintsQuery): Promise<Sprint[] | null> {
        const { projectId, currentUserId } = data;
        try {
            const sprints = await this.sprintsRepository.find({
                where: {
                    project: {
                        id: projectId,
                    },
                },
                relations: ['project', 'project.members'],
            });

            const isUserProjectMember = sprints[0]?.project.members.some((user) => {
                return user.id === currentUserId;
            });

            if (!isUserProjectMember) {
                return null;
            }
            
            sprints.forEach((sprint) => {
                delete sprint.project;
            });

            return sprints;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async findProjectSprintById(data: SprintManipulationData): Promise<Sprint | null> {
        const { id, projectId, currentUserId } = data;
        try {
            const sprint = await this.sprintsRepository.findOne({
                where: {
                    id,
                    project: { id: projectId },
                },
                relations: ['project.members'],
            });

            if (!sprint) {
                return null;
            }

            const isUserProjectMember = sprint.project.members.some((user) => {
                return user.id === currentUserId;
            });

            if (!isUserProjectMember) {
                return null;
            }

            delete sprint.project;
            return sprint;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}

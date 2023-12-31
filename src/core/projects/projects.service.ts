import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectData, ProjectManipulationData } from './projects.types';
import { hasRecordAffected } from 'src/common/helpers/affected-record.helper';
import { UsersService } from '../users/users.service';
import { ProjectMemberManipulationData } from './projects.types';
import { isUserProjectMember } from 'src/common/helpers/project-users.helper';

@Injectable()
export class ProjectsService {
    private readonly logger = new Logger(ProjectsService.name);

    constructor(
        @InjectRepository(Project) private readonly projectsRepository: Repository<Project>,
        private readonly usersService: UsersService,
    ) {}

    async create(data: CreateProjectData): Promise<Project | null> {
        const { name, ownerId } = data;
        const owner = await this.usersService.findById(ownerId);

        if (!owner) return null;

        const project = this.projectsRepository.create({ name });
        project.owner = owner;
        project.members = [owner];

        try {  
            return await this.projectsRepository.save(project);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async find(): Promise<Project[]> {
        try {
            const projects = await this.projectsRepository.find();
            return projects;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    async findById(id: number): Promise<Project | null> {
        try {
            const project = await this.projectsRepository.findOne({
                where: { id },
                relations: ['owner', 'members'],
            });
            return project;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async update(data: ProjectManipulationData): Promise<Project | null> {
        const { id, currentUserId, dto } = data;
        const project = await this.findUserOwnedProjectById(id, currentUserId);

        if (!project) return null;

        project.name = dto.name;

        try {
            return await this.projectsRepository.save(project);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async remove(data: ProjectManipulationData): Promise<boolean> {
        const { id, currentUserId } = data;
        try {
            const project = await this.findUserOwnedProjectById(id, currentUserId);
            
            if (!project) return false;

            const result = await this.projectsRepository.delete(id);
            return hasRecordAffected(result);
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }

    async findUserProjects(userId: number): Promise<Project[]> {
        try {
            const projects = await this.projectsRepository
                .createQueryBuilder('project')
                .innerJoin('project.members', 'member', 'member.id = :userId', { userId })
                .leftJoinAndSelect('project.owner', 'owner')
                .getMany();
            
            return projects;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    async findUserProjectById(data: ProjectManipulationData): Promise<Project | null> {
        const { id, currentUserId: userId } = data;
        try {
            const project = await this.projectsRepository
                .createQueryBuilder('project')
                .innerJoin('project.members', 'member', 'member.id = :userId', { userId })
                .leftJoinAndSelect('project.owner', 'owner')
                .leftJoinAndSelect('project.members', 'allMembers')
                .where('project.id = :id', { id })
                .getOne();
            
            return project;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async findUserOwnedProjectById(id: number, userId: number): Promise<Project | null> {
        try {
            const project = await this.projectsRepository.findOne({
                where: {
                    id,
                    owner: { id: userId },
                },
                relations: ['owner', 'members'],
            });
            
            return project;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async addUserToProject(data: ProjectMemberManipulationData): Promise<Project | null> {
        const { id, userId, currentUserId } = data;
        const [project, user] = await Promise.all([
            this.findUserOwnedProjectById(id, currentUserId),
            this.usersService.findById(userId),
        ]);

        if (!project || !user) return null;

        const isUserAlreadyMember = isUserProjectMember(project, user.id);
        if (isUserAlreadyMember) return project;

        try {
            project.members = [...project.members, user];
            return await this.projectsRepository.save(project);
        } catch (err) {
            this.logger.error(err);
            return null;
        }

    }

    async removeUserFromProject(data: ProjectMemberManipulationData): Promise<Project | null> {
        const { id, userId, currentUserId } = data;
        const project = await this.findUserOwnedProjectById(id, currentUserId);

        if (!project) return null;

        if (project.owner.id === userId) {
            return null;
        }

        try {
            project.members = project.members.filter((user) => {
                return user.id !== userId;
            });
            return await this.projectsRepository.save(project);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}

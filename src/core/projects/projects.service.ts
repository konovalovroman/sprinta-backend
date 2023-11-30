import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/projects.entity';
import { Repository } from 'typeorm';
import { CreateProjectData, ProjectManipulationData } from './projects.types';
import { hasRecordAffected } from 'src/common/helpers/affected-record.helper';
import { UsersService } from '../users/users.service';
import { ProjectMemberManipulationData } from './projects.types';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project) private readonly projectsRepository: Repository<Project>,
        private readonly usersService: UsersService,
    ) {}

    async create(data: CreateProjectData): Promise<Project | null> {
        try {
            const project = await this.projectsRepository.create(data);
            const owner = await this.usersService.findById(data.ownerId);

            if (!owner) {
                return null;
            }

            project.owner = owner;
            project.members = [owner];
            
            return await this.projectsRepository.save(project);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async find(): Promise<Project[]> {
        try {
            const projects = await this.projectsRepository.find();
            return projects;
        } catch (err) {
            console.log(err);
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
            console.log(err);
            return null;
        }
    }

    async update(data: ProjectManipulationData): Promise<Project | null> {
        const { id, currentUserId, dto } = data;
        const project = await this.findById(id);

        if (!project || project?.owner.id !== currentUserId) {
            return null;
        }

        Object.assign(project, dto);

        try {
            return await this.projectsRepository.save(project);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async remove(data: ProjectManipulationData): Promise<boolean> {
        const { id, currentUserId } = data;
        try {
            const project = await this.findById(id);

            if (!project || project.owner?.id !== currentUserId) {
                return false;
            }

            const result = await this.projectsRepository.delete(id);
            return hasRecordAffected(result);
        } catch (err) {
            console.log(err);
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
            console.log(err);
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
            console.log(err);
            return null;
        }
    }

    async addUserToProject(data: ProjectMemberManipulationData): Promise<Project | null> {
        const { id, userId, currentUserId } = data;
        const [project, user] = await Promise.all([
            this.findById(id),
            this.usersService.findById(userId),
        ]);

        const isProjectOwner = project?.owner?.id === currentUserId;
        if (!project || !user || !isProjectOwner) {
            return null;
        }

        const isUserAlreadyMember = project.members.some((member) => {
            return member.id === user.id;
        });
        if (isUserAlreadyMember) {
            return project;
        }

        try {
            project.members = [...project.members, user];
            return await this.projectsRepository.save(project);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async removeUserFromProject(data: ProjectMemberManipulationData): Promise<Project | null> {
        const { id, userId, currentUserId } = data;
        const [project, user] = await Promise.all([
            this.findById(id),
            this.usersService.findById(userId),
        ]);

        const isProjectOwner = project?.owner?.id === currentUserId;
        if (!project || !user || !isProjectOwner) {
            return null;
        }

        if (project.owner.id === userId) {
            return null;
        }

        try {
            project.members = project.members.filter((user) => {
                return user.id !== userId;
            });
            return await this.projectsRepository.save(project);
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

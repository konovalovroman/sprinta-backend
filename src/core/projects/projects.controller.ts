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
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    async create(@Body() dto: ProjectDto, @CurrentUser('sub') currentUserId: number) {
        const project = await this.projectsService.create({ ...dto, ownerId: currentUserId });

        if (!project) {
            throw new BadRequestException('Project creation error');
        }

        return project;
    }

    @Get()
    async find(@CurrentUser('sub') currentUserId: number) {
        const projects = await this.projectsService.findUserProjects(currentUserId);
        return projects;
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number
    ) {
        const project = await this.projectsService.findUserProjectById({
            id,
            currentUserId,
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ProjectDto,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const project = await this.projectsService.update({
            id,
            currentUserId,
            dto,
        });

        if (!project) {
            throw new BadRequestException('Project updating error');
        }

        return project;
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        await this.projectsService.remove({
            id,
            currentUserId,
        });
        
        return;
    }

    @Post(':id/members/:userId')
    async addUserToProject(
        @Param('id', ParseIntPipe) id: number,
        @Param('userId', ParseIntPipe) userId: number,
        @CurrentUser('sub') currentUserId: number
    ) {
        const project = await this.projectsService.addUserToProject({
            id,
            userId,
            currentUserId, 
        });

        if (!project) {
            throw new BadRequestException('Could not add a user to the project');
        }

        return project;
    }

    @Delete(':id/members/:userId')
    async removeUserFromProject(
        @Param('id', ParseIntPipe) id: number,
        @Param('userId', ParseIntPipe) userId: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const project = await this.projectsService.removeUserFromProject({
            id,
            userId,
            currentUserId,
        });

        if (!project) {
            throw new BadRequestException('Could not remove a user from the project');
        }

        return project;
    }
}

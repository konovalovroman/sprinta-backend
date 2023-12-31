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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Return created project',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Project creation error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @Post()
    async create(@Body() dto: ProjectDto, @CurrentUser('sub') currentUserId: number) {
        const project = await this.projectsService.create({ ...dto, ownerId: currentUserId });

        if (!project) {
            throw new BadRequestException('Project creation error');
        }

        return project;
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get all user projects',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @Get()
    async find(@CurrentUser('sub') currentUserId: number) {
        const projects = await this.projectsService.findUserProjects(currentUserId);
        return projects;
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return one project',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Project not found',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return updated project',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Project updating error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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

    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Removes one project',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return project with new user',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Adding user error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @HttpCode(HttpStatus.OK)
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return project without removed user',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Removing user error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
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

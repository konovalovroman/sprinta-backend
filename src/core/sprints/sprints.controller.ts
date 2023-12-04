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
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Controller('projects/:projectId/sprints')
export class SprintsController {
    constructor(private readonly sprintsService: SprintsService) {}

    @Post()
    async create(
        @Param('projectId', ParseIntPipe) projectId: number,
        @CurrentUser('sub') currentUserId: number,
        @Body() dto: CreateSprintDto,
    ) {
        const sprint = await this.sprintsService.create({
            projectId,
            currentUserId,
            dto,
        });
        
        if (!sprint) {
            throw new BadRequestException('Sprint creation error');
        }

        return sprint;
    }

    @Get()
    async find(
        @Param('projectId', ParseIntPipe) projectId: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const sprints = await this.sprintsService.findProjectSprints({
            projectId,
            currentUserId,
        });

        if (!sprints) {
            throw new NotFoundException('Sprints not found for a given project');
        }

        return sprints;
    }

    @Get(':id')
    async findById(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const sprint = await this.sprintsService.findProjectSprintById({
            id,
            projectId,
            currentUserId,
        });

        if (!sprint) {
            throw new NotFoundException('Sprint not found');
        }

        return sprint;
    }
    

    @Patch(':id')
    async update(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
        @Body() dto: UpdateSprintDto, 
    ) {
        const sprint = await this.sprintsService.update({
            id,
            projectId,
            currentUserId,
            dto,
        });

        if (!sprint) {
            throw new BadRequestException('Sprint updating error');
        }

        return sprint;
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        await this.sprintsService.remove({
            id,
            projectId,
            currentUserId,
        });
        
        return;
    }
}

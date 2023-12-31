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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sprints')
@ApiBearerAuth()
@Controller('sprints')
export class SprintsController {
    constructor(private readonly sprintsService: SprintsService) {}

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Return created sprint',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Sprint creation error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @Post()
    async create(
        @CurrentUser('sub') currentUserId: number,
        @Body() dto: CreateSprintDto,
    ) {
        const sprint = await this.sprintsService.create({
            currentUserId,
            dto,
        });
        
        if (!sprint) {
            throw new BadRequestException('Sprint creation error');
        }

        return sprint;
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get all sprints for project',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Sprints not found for a given project',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @Get('projects/:projectId')
    async find(
        @Param('projectId', ParseIntPipe) projectId: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const sprints = await this.sprintsService.findProjectSprints({
            projectId,
            currentUserId,
        });

        if (!sprints.length) {
            throw new NotFoundException('Sprints not found for a given project');
        }

        return sprints;
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get one sprint',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Sprints not found',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
    ) {
        const sprint = await this.sprintsService.findSprintForProjectMemberById({
            id,
            currentUserId,
        });

        if (!sprint) {
            throw new NotFoundException('Sprint not found');
        }

        return sprint;
    }
    
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return updated sprint',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Sprint updating error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') currentUserId: number,
        @Body() dto: UpdateSprintDto, 
    ) {
        const sprint = await this.sprintsService.update({
            id,
            currentUserId,
            dto,
        });

        if (!sprint) {
            throw new BadRequestException('Sprint updating error');
        }

        return sprint;
    }

    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Removes one sprint',
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
        await this.sprintsService.remove({
            id,
            currentUserId,
        });
        
        return;
    }
}

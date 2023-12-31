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
    Query,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserManipulationGuard } from 'src/common/guards/user-manipulation.guard';
import { SearchUsersDto } from './dto/search-users.dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get all users',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Sprints not found for a given project',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @ApiQuery({
        name: 'username',
        example: 'example',
        required: false,
    })
    @ApiQuery({
        name: 'email',
        example: 'example@mail.com',
        required: false,
    })
    @Get()
    async find(
        @Query() query: SearchUsersDto,
    ) {
        const users = await this.usersService.find(query);
        return users;
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get one user',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return updated user',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'User updating error',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @UseGuards(UserManipulationGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        const user = await this.usersService.update(id, dto);
        if (!user) {
            throw new BadRequestException('User updating error');
        }
        return user;
    }

    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Removes one user',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User not logged in',
    })
    @UseGuards(UserManipulationGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.usersService.remove(id);
        return;
    }
}

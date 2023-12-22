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

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async find(
        @Query() query: SearchUsersDto,
    ) {
        const users = await this.usersService.find(query);
        return users;
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @UseGuards(UserManipulationGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        const user = await this.usersService.update(id, dto);
        if (!user) {
            throw new BadRequestException('User updating error');
        }
        return user;
    }

    @UseGuards(UserManipulationGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.usersService.remove(id);
        return;
    }
}

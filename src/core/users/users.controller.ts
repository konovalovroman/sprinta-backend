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
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserManipulationGuard } from 'src/common/guards/user-manipulation.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async find() {
        const users = await this.usersService.find();
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

import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserManipulationGuard } from 'src/common/guards/user-manipulation.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async find() {
        const users = await this.usersService.find();
        return users;
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const user = await this.usersService.findById(Number(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @UseGuards(UserManipulationGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        const user = await this.usersService.update(Number(id), dto);
        if (!user) {
            throw new BadRequestException('User updating error');
        }
        return user;
    }

    @UseGuards(UserManipulationGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.usersService.remove(Number(id));
        return;

    }
}

import { Injectable, Logger } from '@nestjs/common';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashString } from 'src/common/helpers/hash.helper';
import { UpdateUserDto } from './dto/update-user.dto';
import { hasRecordAffected } from 'src/common/helpers/affected-record.helper';
import { SearchUsersDto } from './dto/search-users.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
    ) {}

    async create(dto: SignupDto): Promise<User | null> {
        const { password, ...userData } = dto;
        const passwordHash = await hashString(password);
        const user = this.usersRepository.create({ ...userData, password: passwordHash });
        
        try {
            return await this.usersRepository.save(user);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async find(searchQuery?: SearchUsersDto): Promise<User[]> {
        try {
            const queryBuilder = this.usersRepository.createQueryBuilder('user');

            if (searchQuery?.email) {
                queryBuilder.andWhere('user.email = :email', { email: searchQuery.email });
            }

            if (searchQuery?.username) {
                queryBuilder.andWhere('user.username = :username', {
                    username: searchQuery.username,
                });
            }
            
            const users = await queryBuilder.getMany();
            return users;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            const user = await this.usersRepository.findOne({ where: { id } });
            return user;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.usersRepository.findOne({ where: { email } });
            return user;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async update(id: number, dto: UpdateUserDto): Promise<User | null> {
        const { username, password } = dto;
        const updateUserData: UpdateUserDto = {};

        if (username) {
            updateUserData.username = username;
        }
        if (password) {
            updateUserData.password = await hashString(password);
        }

        try {
            const user = await this.usersRepository.findOne({ where: { id } });
            if (!user) {
                return null;
            }
            Object.assign(user, updateUserData);
            return await this.usersRepository.save(user);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async remove(id: number): Promise<boolean> {
        try {
            const result = await this.usersRepository.delete(id);
            return hasRecordAffected(result);
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }
}

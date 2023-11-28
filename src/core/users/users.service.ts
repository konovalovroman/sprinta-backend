import { Injectable } from '@nestjs/common';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashString } from 'src/common/helpers/hash.helper';

@Injectable()
export class UsersService {
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
            console.log(err);
            return null;
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            const user = await this.usersRepository.findOne({ where: { id } });
            return user;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.usersRepository.findOne({ where: { email } });
            return user;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

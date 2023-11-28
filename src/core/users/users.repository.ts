import { Repository } from 'typeorm';
import { User } from './entities/users.entity';

export class usersRepository extends Repository<User> {}

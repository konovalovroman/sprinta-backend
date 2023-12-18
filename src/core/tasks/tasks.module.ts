import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { SprintsModule } from '../sprints/sprints.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        SprintsModule,
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}

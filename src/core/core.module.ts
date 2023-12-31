import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { SprintsModule } from './sprints/sprints.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';

@Module({
    imports: [
        UsersModule,
        ProjectsModule,
        SprintsModule,
        TasksModule,
        CommentsModule,
    ],
})
export class CoreModule {}

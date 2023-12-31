import { Exclude } from 'class-transformer';
import { Project } from 'src/core/projects/entities/project.entity';
import { Task } from 'src/core/tasks/entities/task.entity';
import { User } from 'src/core/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    text: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.id, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @ManyToOne(() => Task, (task) => task.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_id' })
    task: Task;

    @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    @Exclude()
    project: Project;
}

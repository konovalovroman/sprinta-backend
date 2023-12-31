import { Exclude } from 'class-transformer';
import { TaskStatus } from 'src/common/enums/taskStatus.enum';
import { Project } from 'src/core/projects/entities/project.entity';
import { Sprint } from 'src/core/sprints/entities/sprint.entity';
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


@Entity({ name: 'tasks' })
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
    })
    status: TaskStatus;

    @Column({ type: 'smallint' })
    estimation: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.id, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @ManyToOne(() => Sprint, (sprint) => sprint.id, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'sprint_id' })
    sprint: Sprint;

    @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    @Exclude()
    project: Project;
}

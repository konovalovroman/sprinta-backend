import { Project } from 'src/core/projects/entities/projects.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sprints' })
export class Sprint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 40 })
    name: string;

    @Column({ type: 'boolean' })
    started: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @Column({ name: 'ends_at', type: 'timestamp with time zone' })
    endsAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;
}

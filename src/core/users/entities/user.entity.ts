import { Exclude } from 'class-transformer';
import { Project } from 'src/core/projects/entities/project.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, unique: true })
    username: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 100 })
    @Exclude()
    password: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToMany(() => Project, (project) => project.members)
    @JoinColumn({ name: 'users_and_projects' })
    projects: Project[];
}

import { User } from 'src/core/users/entities/user.entity';
import { 
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 40 })
    name: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.id, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'owner_id' })
    owner: User | null;

    @ManyToMany(() => User, (user) => user.projects)
    @JoinTable({ name: 'users_and_projects' })
    members: User[];
}

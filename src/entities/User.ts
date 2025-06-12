import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
} from 'typeorm';
import { Role } from './Role';
import * as bcrypt from 'bcryptjs'; // Ensure bcrypt is installed

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @ManyToOne(() => Role, (role) => role.users, { nullable: true, eager: true })
    role?: Role;

    // Optionally, if you track createdBy, updatedBy:
    @Column({ nullable: true })
    createdBy?: number;
    @Column({ nullable: true })
    updatedBy?: number;

    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;
    @DeleteDateColumn()
    deletedAt?: Date;

    @BeforeInsert()
    async hashPassword() {
        // caution: need bcrypt import; better handle in service for clearer error handling.
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
}

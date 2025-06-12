// src/entities/IncomeType.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    DeleteDateColumn,
} from 'typeorm';
import { Income } from './Income';

@Entity()
export class IncomeType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => Income, (income) => income.incomeType)
    incomes!: Income[];

    @Column({ nullable: true }) createdBy?: number;
    @Column({ nullable: true }) updatedBy?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}

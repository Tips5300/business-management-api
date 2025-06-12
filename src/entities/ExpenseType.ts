// src/entities/ExpenseType.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    DeleteDateColumn,
} from 'typeorm';
import { Expense } from './Expense';
import { PaymentMethod } from './PaymentMethod';

@Entity()
export class ExpenseType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => Expense, (expense) => expense.expenseType)
    expenses!: Expense[];

    @Column({ nullable: true }) createdBy?: number;
    @Column({ nullable: true }) updatedBy?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}

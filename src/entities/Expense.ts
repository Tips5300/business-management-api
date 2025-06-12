// src/entities/Expense.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { ExpenseType } from './ExpenseType';
import { PaymentMethod } from './PaymentMethod';
// If you track user ownership, import User:
// import { User } from './User';

@Entity()
export class Expense {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('decimal', { precision: 12, scale: 2 })
    amount!: number;

    @Column({ type: 'date' })
    date!: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => ExpenseType, (type) => type.expenses, { eager: true })
    expenseType!: ExpenseType;

    @ManyToOne(() => PaymentMethod, (pm) => pm.expenses, { eager: true })
    paymentMethod!: PaymentMethod;

    @Column({ nullable: true }) createdBy?: number;
    @Column({ nullable: true }) updatedBy?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}

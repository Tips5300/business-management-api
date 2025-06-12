// src/entities/Income.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { IncomeType } from './IncomeType';
import { PaymentMethod } from './PaymentMethod';
// import { User } from './User';

@Entity()
export class Income {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('decimal', { precision: 12, scale: 2 })
    amount!: number;

    @Column({ type: 'date' })
    date!: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => IncomeType, (type) => type.incomes, { eager: true })
    incomeType!: IncomeType;

    @ManyToOne(() => PaymentMethod, (pm) => pm.incomes, { eager: true })
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

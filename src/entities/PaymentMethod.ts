// src/entities/PaymentMethod.ts
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
import { Income } from './Income';
import { SaleReturn } from './SaleReturn';
import { PurchaseReturn } from './PurchaseReturn';
import { Purchase } from './Purchase';
import { Sale } from './Sale';

@Entity()
export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => Expense, (expense) => expense.paymentMethod)
    expenses!: Expense[];

    @OneToMany(() => Income, (income) => income.paymentMethod)
    incomes!: Income[];

    @OneToMany(() => Sale, (sale) => sale.paymentMethod)
    sales!: Sale[];

    @OneToMany(() => Purchase, (purchase) => purchase.paymentMethod)
    purchases!: Purchase[];

    @OneToMany(() => SaleReturn, (sr) => sr.paymentMethod)
    saleReturns!: SaleReturn[];

    @OneToMany(() => PurchaseReturn, (pr) => pr.paymentMethod)
    purchaseReturns!: PurchaseReturn[];

    @Column({ nullable: true }) createdBy?: number;
    @Column({ nullable: true }) updatedBy?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}

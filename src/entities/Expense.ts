// src/entities/Expense.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Account } from './Account';

export enum ExpenseType { OFFICE='Office', TRAVEL='Travel', OTHER='Other' }
export enum ExpenseStatus { PENDING='Pending', PAID='Paid', CANCELLED='Cancelled' }

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column('decimal',{precision:15,scale:2}) amount!: number;
  @Column({ type:'text' }) description!: string;

  @ManyToOne(() => Account,(a)=>a.debitJournalEntries,{nullable:false})
  account!: Account;

  @Column({ type:'enum', enum:ExpenseType, default:ExpenseType.OTHER })
  expenseType!: ExpenseType;    // NEW

  @Column({ type:'date', nullable:true }) expenseDate?: string;
  @Column({ type:'enum', enum:ExpenseStatus, default:ExpenseStatus.PENDING })
  status!: ExpenseStatus;       // NEW

  @Column({ type:'text', nullable:true }) notes?: string; // NEW

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

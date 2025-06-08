// src/entities/Transaction.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Account } from './Account';

export enum TransactionType { DEBIT='Debit', CREDIT='Credit' }
export enum TransactionStatus { PENDING='Pending', COMPLETED='Completed', FAILED='Failed' }

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(()=>Account,(a)=>a.debitJournalEntries,{nullable:true})
  debitAccount?: Account;
  @ManyToOne(()=>Account,(a)=>a.creditJournalEntries,{nullable:true})
  creditAccount?: Account;

  @Column('decimal',{precision:15,scale:2}) amount!: number;
  @Column({ type:'enum', enum:TransactionType }) type!: TransactionType;
  @Column({ type:'enum', enum:TransactionStatus, default:TransactionStatus.COMPLETED })
  status!: TransactionStatus;  // NEW

  @Column({ type:'text', nullable:true }) description?: string;
  @Column({ nullable:true }) transactionReference?: string;
  @Column({ type:'varchar', length:3, nullable:true }) currency?: string;
  @Column({ type:'text', nullable:true }) notes?: string; // NEW

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

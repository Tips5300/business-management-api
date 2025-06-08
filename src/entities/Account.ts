// src/entities/Account.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { JournalEntry } from './JournalEntry';

export enum AccountType {
  ASSET = 'Asset',
  LIABILITY = 'Liability',
  EQUITY = 'Equity',
  REVENUE = 'Revenue',
  EXPENSE = 'Expense',
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType!: AccountType;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  openingBalance!: number;         // NEW

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance!: number;

  @Column({ default: true })
  removable!: boolean;             // NEW: can this account be deleted?

  @Column({ type: 'varchar', length: 3, nullable: true })
  currency?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => JournalEntry, (je) => je.debitAccount)
  debitJournalEntries!: JournalEntry[];

  @OneToMany(() => JournalEntry, (je) => je.creditAccount)
  creditJournalEntries!: JournalEntry[];

  @Column({ nullable: true })
  createdBy?: number;

  @Column({ nullable: true })
  updatedBy?: number;

  @CreateDateColumn()   createdAt!: Date;
  @UpdateDateColumn()   updatedAt!: Date;
  @DeleteDateColumn()   deletedAt?: Date;
}

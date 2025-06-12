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

  @Column({ type: 'simple-enum', enum: AccountType })
  accountType!: AccountType;

  @Column({ type: 'varchar', length: 3 })
  currency!: string;

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

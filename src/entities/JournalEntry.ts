import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity()
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar' })
  refType!: string; // e.g. 'EXPENSE', 'STOCK', etc.

  @Column({ type: 'uuid' })
  refId!: string;

  @ManyToOne(() => Account, (acct) => acct.debitJournalEntries)
  @JoinColumn({ name: 'debitAccountId' })
  debitAccount!: Account;

  @Column()
  debitAccountId!: string;

  @ManyToOne(() => Account, (acct) => acct.creditJournalEntries)
  @JoinColumn({ name: 'creditAccountId' })
  creditAccount!: Account;

  @Column()
  creditAccountId!: string;

  @Column({ type: 'decimal' })
  amount!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  transactionReference?: string;

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
}


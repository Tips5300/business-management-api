// src/entities/Customer.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Sale } from './Sale';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column()                      name!: string;
  @Column({ unique: true })     email?: string;     // made optional
  @Column({ unique: true })     phone?: string;     // optional
  @Column({ unique: true })     whatsapp?: string;  // NEW
  @Column({ type: 'text', nullable: true }) address?: string;
  @Column({ nullable: true })   companyName?: string;
  @Column({ nullable: true })   taxId?: string;

  @OneToMany(() => Sale, (s) => s.customer) sales!: Sale[];

  @Column({ type: 'enum', enum: ['Active','Inactive'], default: 'Active' })
  status!: 'Active'|'Inactive';   // NEW

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;
  @CreateDateColumn()  createdAt!: Date;
  @UpdateDateColumn()  updatedAt!: Date;
  @DeleteDateColumn()  deletedAt?: Date;
}

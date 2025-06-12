// src/entities/Purchase.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Supplier } from './Supplier';
import { PurchaseProduct } from './PurchaseProduct';
import { Store } from './Store';
import { Employee } from './Employee';
import { PaymentMethod } from './PaymentMethod';

export enum PurchaseStatus { PENDING = 'Pending', PARTIAL = 'Partial', PAID = 'Paid', CANCELLED = 'Cancelled' }

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'date' }) purchaseDate!: string;

  @ManyToOne(() => Supplier, (s) => s.purchases, { nullable: true }) supplier?: Supplier;  // optional
  @ManyToOne(() => Store, { nullable: true }) store?: Store;                     // optional
  @ManyToOne(() => Employee, { nullable: true }) employee?: Employee;               // optional

  @OneToMany(() => PurchaseProduct, (pp) => pp.purchase, { cascade: true })
  items!: PurchaseProduct[];

  @Column('decimal', { precision: 15, scale: 2, default: 0 }) subTotal!: number;
  @Column('decimal', { precision: 15, scale: 2, default: 0 }) discount!: number;   // optional
  @Column('decimal', { precision: 15, scale: 2, default: 0 }) taxAmount!: number;  // optional
  @Column('decimal', { precision: 15, scale: 2, default: 0 }) shippingCharge!: number; // NEW

  @Column('decimal', { precision: 15, scale: 2, default: 0 }) totalAmount!: number;
  @Column('decimal', { precision: 15, scale: 2, default: 0 }) dueAmount!: number;   // NEW

  @ManyToOne(() => PaymentMethod, (pm) => pm.purchases, { eager: true, nullable: true })
  paymentMethod?: PaymentMethod;

  @Column({ type: 'varchar', length: 50, nullable: true }) invoiceNumber?: string; // NEW

  @Column('text', { array: true, nullable: true })
  receiptOrAny?: string[];

  @Column({ type: 'simple-enum', enum: PurchaseStatus, default: PurchaseStatus.PENDING })
  status!: PurchaseStatus;

  @Column({ type: 'text', nullable: true }) notes?: string;  // NEW

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

// src/entities/Sale.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { SaleProduct } from "./SaleProduct";
import { Store } from "./Store";
import { Employee } from "./Employee";
import { PaymentMethod } from "./PaymentMethod";

export enum SaleStatus {
  PENDING = "Pending",
  PARTIAL = "Partial",
  PAID = "Paid",
  CANCELLED = "Cancelled",
}

@Entity()
export class Sale {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ type: "date" }) saleDate!: string;

  @ManyToOne(() => Customer, (c) => c.sales, { nullable: true })
  customer?: Customer; // optional
  @ManyToOne(() => Store, { nullable: true }) store?: Store;
  @ManyToOne(() => Employee, { nullable: true }) employee?: Employee;

  @OneToMany(() => SaleProduct, (sp) => sp.sale, { cascade: true })
  items!: SaleProduct[];

  @Column("decimal", { precision: 15, scale: 2, default: 0 }) subTotal!: number;
  @Column("decimal", { precision: 15, scale: 2, default: 0 }) discount!: number; // optional
  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  taxAmount!: number; // optional
  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  deliveryCharge!: number; // NEW

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  totalAmount!: number;
  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  dueAmount!: number; // NEW

  @ManyToOne(() => PaymentMethod, (pm) => pm.sales, { eager: true, nullable: true })
  paymentMethod?: PaymentMethod

  @Column({ nullable: true }) invoiceNumber?: string; // NEW

  @Column('text', { array: true, nullable: true })
  receiptOrAny?: string[];

  @Column({ type: "enum", enum: SaleStatus, default: SaleStatus.PENDING })
  status!: SaleStatus;

  @Column({ type: "text", nullable: true }) notes?: string; // NEW

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

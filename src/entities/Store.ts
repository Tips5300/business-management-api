// src/entities/Store.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Employee } from './Employee';
import { StockTransfer } from './StockTransfer';
import { Purchase } from './Purchase';
import { Sale } from './Sale';
import { Stock } from './Stock';
import { StockAdjustment } from './StockAdjustment';

export enum StoreType {
  WAREHOUSE = 'warehouse',
  RETAIL = 'store',
  DISTRIBUTION = 'distribution',
  // add more as needed
}

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column({ type: 'text', nullable: true }) address?: string;
  @Column({ nullable: true }) phone?: string;
  @Column({ nullable: true }) email?: string;

  @Column({ type: 'enum', enum: StoreType })
  type!: StoreType;

  @OneToMany(() => Stock, (stock) => stock.store, { cascade: true })
  stocks!: Stock[];

  @OneToMany(() => StockAdjustment, (adj) => adj.store, { cascade: true })
  stockAdjustments!: StockAdjustment[];

  @OneToMany(() => StockTransfer, (transfer) => transfer.fromStore, { cascade: true })
  outgoingTransfers!: StockTransfer[];

  @OneToMany(() => StockTransfer, (transfer) => transfer.toStore, { cascade: true })
  incomingTransfers!: StockTransfer[];

  @OneToMany(() => Purchase, (purchase) => purchase.store, { cascade: true })
  purchases!: Purchase[];

  @OneToMany(() => Sale, (sale) => sale.store, { cascade: true })
  sales!: Sale[];

  @OneToMany(() => Employee, (emp) => emp.store, { cascade: true })
  employees!: Employee[];

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

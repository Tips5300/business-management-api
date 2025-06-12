// src/entities/Stock.ts

import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './Product';
import { Batch } from './Batch';
import { Store } from './Store';
import { SaleProduct } from './SaleProduct';
import { PurchaseProduct } from './PurchaseProduct';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(() => Batch, (b) => b.stockEntries, { nullable: false })
  batch!: Batch;

  @ManyToOne(() => Product, (p) => p.stockEntries, { nullable: false })
  product!: Product;

  @Column('int')
  quantity!: number;

  @Column('decimal', { precision: 15, scale: 2 })
  unitCost!: number;

  @ManyToOne(() => Store, (s) => s.stocks, { nullable: false })
  store!: string;

  @Column({ unique: true, nullable: true })
  barcode?: string;// NEW

  @OneToMany(() => SaleProduct, (sp) => sp.stock)
  saleProducts!: SaleProduct[];

  @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status!: 'Active' | 'Inactive';

  @Column({ type: 'text', nullable: true }) notes?: string; // NEW

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

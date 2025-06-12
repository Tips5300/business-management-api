// src/entities/PurchaseProduct.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  Batch,
} from 'typeorm';
import { Purchase } from './Purchase';
import { Product } from './Product';
import { Stock } from './Stock';

@Entity()
export class PurchaseProduct {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => Purchase, (p) => p.items) purchase!: Purchase;
  @ManyToOne(() => Product, (p) => p.purchaseItems) product!: Product;

  @Column('int') quantity!: number;
  @Column('decimal', { precision: 15, scale: 2 }) unitCost!: number;
  @Column('decimal', { precision: 15, scale: 2, default: 0 }) totalCost!: number;

  @ManyToOne(() => Batch, (b) => b /* no inverse collection needed here */, { eager: true, nullable: false })
  batch!: Batch;

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

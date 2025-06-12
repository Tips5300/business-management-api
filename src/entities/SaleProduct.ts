// src/entities/SaleProduct.ts

import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Sale } from './Sale';
import { Product } from './Product';
import { Stock } from './Stock';

@Entity()
export class SaleProduct {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => Sale, (s) => s.items) sale!: Sale;
  @ManyToOne(() => Product, (p) => p.saleItems) product!: Product;

  @Column('int') quantity!: number;
  @Column('decimal', { precision: 15, scale: 2 }) unitPrice!: number;
  @Column('decimal', { precision: 15, scale: 2, default: 0 }) totalPrice!: number;

  @ManyToOne(() => Stock, (s) => s.saleProducts, { eager: true, nullable: false })
  stock!: Stock;

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

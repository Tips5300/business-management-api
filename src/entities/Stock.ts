// src/entities/Stock.ts

import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Product } from './Product';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => Product, (p) => p.stockEntries, { nullable: false })
  product!: Product;
  @Column('int')         quantity!: number;
  @Column('decimal',{precision:15,scale:2}) unitCost!: number;
  @Column({ type: 'varchar', length: 50, nullable: true }) warehouse?: string;
  @Column({ unique: true, nullable: true }) barcode?: string;// NEW

  @Column({ type: 'enum', enum: ['Active','Inactive'], default: 'Active' })
  status!: 'Active'|'Inactive';
  @Column({ type: 'text', nullable: true }) notes?: string; // NEW

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

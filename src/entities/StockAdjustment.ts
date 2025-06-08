// src/entities/StockAdjustment.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Product } from './Product';
import { Store } from './Store';

export enum AdjustmentType { INCREASE='Increase', DECREASE='Decrease' }
export enum AdjustmentStatus { PENDING='Pending', DONE='Done', CANCELLED='Cancelled' }

@Entity()
export class StockAdjustment {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(() => Product,(p)=>p.stockEntries, { nullable:false })
  product!: Product;

  @Column('int') quantityChange!: number;
  @Column({ type:'enum', enum:AdjustmentType }) adjustmentType!: AdjustmentType;

  @ManyToOne(() => Store, { nullable:true }) store?: Store;  // optional

  @Column({ type:'decimal', precision:15, scale:2, nullable:true }) adjustedValue?: number;
  @Column({ type:'text', nullable:true }) reason?: string;

  @Column({ type:'enum', enum:AdjustmentStatus, default:AdjustmentStatus.DONE })
  status!: AdjustmentStatus;                  // NEW

  @Column({ type:'text', nullable:true }) notes?: string;  // NEW

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

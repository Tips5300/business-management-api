// src/entities/StockTransfer.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Product } from './Product';
import { Store } from './Store';

export enum TransferStatus { PENDING='Pending', COMPLETED='Completed', CANCELLED='Cancelled' }

@Entity()
export class StockTransfer {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(() => Product,(p)=>p.stockEntries,{nullable:false})
  product!: Product;

  @Column('int') quantity!: number;

  @ManyToOne(() => Store,{ nullable:false }) fromStore!: Store;
  @ManyToOne(() => Store,{ nullable:false }) toStore!: Store;

  @Column('decimal',{precision:15,scale:2,nullable:true}) transferValue?: number;
  @Column({ type:'simple-enum', enum:TransferStatus, default:TransferStatus.COMPLETED })
  status!: TransferStatus;            // NEW
  @Column({ type:'text', nullable:true }) notes?: string;   // NEW
  
  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

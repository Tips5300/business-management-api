// src/entities/Supplier.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Purchase } from './Purchase';

export enum SupplierType {
  Manufacturer = 'Manufacturer',
  Distributor = 'Distributor',
  Wholesaler = 'Wholesaler',
  Retailer = 'Retailer',
  Dealer = 'Dealer',
  // adjust options per your domain
}

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column({ type: 'text', nullable: true }) picture?: string;
  @Column({ unique: true }) email?: string;
  @Column({ unique: true }) phone?: string;
  @Column({ unique: true }) whatsapp?: string; // NEW
  @Column({ type: 'text', nullable: true }) address?: string;
  @Column({ nullable: true }) website?: string;
  @Column({ nullable: true }) contactPerson?: string;
  @Column({ nullable: true }) taxId?: string;
  @Column({ type: 'simple-enum', enum: SupplierType, default: SupplierType.Distributor })
  supplierType!: SupplierType;
  @OneToMany(() => Purchase, (p) => p.supplier) purchases!: Purchase[];

  @Column({ type: 'simple-enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status!: 'Active' | 'Inactive';

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

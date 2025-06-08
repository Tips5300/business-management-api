// src/entities/Product.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Category } from './Category';
import { SubCategory } from './SubCategory';
import { Stock } from './Stock';
import { PurchaseProduct } from './PurchaseProduct';
import { SaleProduct } from './SaleProduct';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column({ unique: true, nullable: true }) sku?: string;      // optional
  @Column()                      name!: string;
  @Column({ type: 'text', nullable: true }) description?: string;
  @Column('simple-array', { nullable: true }) images?: string[];// NEW
  @Column({ unique: true, nullable: true }) barcode?: string;   // optional

  @Column({ type: 'decimal', default: 0, precision: 15, scale: 2 })
  costPrice!: number;
  @Column({ type: 'decimal', default: 0, precision: 15, scale: 2 })
  retailPrice!: number;               // optional

  @ManyToOne(() => Category,   { nullable: true }) category?: Category;
  @ManyToOne(() => SubCategory,{ nullable: true }) subCategory?: SubCategory;

  @OneToMany(() => Stock,         (s) => s.product) stockEntries!: Stock[];
  @OneToMany(() => PurchaseProduct,(pp)=> pp.product) purchaseItems!: PurchaseProduct[];
  @OneToMany(() => SaleProduct,   (sp)=> sp.product) saleItems!: SaleProduct[];

  @Column({ default: true }) isActive!: boolean;
  @Column({ type: 'enum', enum: ['Active','Inactive'], default: 'Active' }) status!: 'Active'|'Inactive';

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

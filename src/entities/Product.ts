// src/entities/Product.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Category } from './Category';
import { SubCategory } from './SubCategory';
import { Stock } from './Stock';
import { PurchaseProduct } from './PurchaseProduct';
import { SaleProduct } from './SaleProduct';
import { Batch } from './Batch';
import { Brand } from './Brand';
import { TaxRate } from './TaxRate';

export enum UnitType {
  PIECE = 'Piece',
  KG = 'Kg',
  LITER = 'Liter',
  METRE = 'Metre',
  // add other units as needed
}

export enum WarrantyDurationType {
  DAYS = 'Days',
  MONTHS = 'Months',
  YEARS = 'Years',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true })
  sku?: string;

  @Column({ unique: true, nullable: true })
  barcode?: string;

  @Column()
  name!: string;

  @ManyToOne(() => Brand, { nullable: true })
  brand?: Brand;

  @Column('text', { array: true, nullable: true })
  images?: string[];

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  manufacturer?: string;

  @Column('decimal', { precision: 15, scale: 2 })
  purchasePrice!: number;

  @Column('decimal', { precision: 15, scale: 2 })
  mrpPrice!: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  wholesalePrice?: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  dealerPrice?: number;

  @ManyToOne(() => TaxRate, { nullable: true })
  tax?: TaxRate;

  @Column({ type: 'simple-enum', enum: UnitType })
  unitType!: UnitType;

  @Column('int', { nullable: true })
  warrantyDuration?: number;

  @Column({ type: 'simple-enum', enum: WarrantyDurationType, nullable: true })
  warrantyDurationType?: WarrantyDurationType;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;

  @ManyToOne(() => SubCategory, { nullable: true })
  subCategory?: SubCategory;

  @ManyToMany(() => Batch, (batch) => batch.products)
  @JoinTable({
    name: 'product_batches',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'batchId', referencedColumnName: 'id' },
  })
  batches!: Batch[];

  @OneToMany(() => Stock, (s) => s.product)
  stockEntries!: Stock[];

  @OneToMany(() => PurchaseProduct, (pp) => pp.product)
  purchaseItems!: PurchaseProduct[];

  @OneToMany(() => SaleProduct, (sp) => sp.product)
  saleItems!: SaleProduct[];

  @Column({ type: 'simple-enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status!: 'Active' | 'Inactive';

  @Column({ nullable: true })
  createdBy?: number;

  @Column({ nullable: true })
  updatedBy?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

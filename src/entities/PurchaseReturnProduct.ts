import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PurchaseReturn } from './PurchaseReturn';
import { Product } from './Product';

@Entity()
export class PurchaseReturnProduct {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => PurchaseReturn, (pr) => pr.items)
  purchaseReturn!: PurchaseReturn;

  @ManyToOne(() => Product, (prod) => prod.stockEntries)
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal' })
  unitPrice!: number;

  @Column({ type: 'decimal', default: 0 })
  totalPrice!: number; // quantity * unitPrice

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


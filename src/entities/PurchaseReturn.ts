import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PurchaseReturnProduct } from './PurchaseReturnProduct';
import { Purchase } from './Purchase';
import { PaymentMethod } from './PaymentMethod';

@Entity()
export class PurchaseReturn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  returnDate!: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.id)
  purchase!: Purchase;

  @OneToMany(() => PurchaseReturnProduct, (item) => item.purchaseReturn, { cascade: true })
  items!: PurchaseReturnProduct[];

  @Column({ type: 'decimal', default: 0 })
  totalReturnAmount!: number;

  @ManyToOne(() => PaymentMethod, (pm) => pm.purchaseReturns, { eager: true, nullable: true })
  paymentMethod?: PaymentMethod;

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


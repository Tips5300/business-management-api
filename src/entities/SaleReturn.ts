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
import { Sale } from './Sale';
import { SaleReturnProduct } from './SaleReturnProduct';
import { PaymentMethod } from './PaymentMethod';

@Entity()
export class SaleReturn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  returnDate!: string;

  @ManyToOne(() => Sale, (sale) => sale.id)
  sale!: Sale;

  @OneToMany(() => SaleReturnProduct, (item) => item.saleReturn, { cascade: true })
  items!: SaleReturnProduct[];

  @Column({ type: 'decimal', default: 0 })
  totalReturnAmount!: number;

  @ManyToOne(() => PaymentMethod, (pm) => pm.saleReturns, { eager: true, nullable: true })
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


// src/entities/Batch.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Product } from './Product';
import { Stock } from './Stock';

@Entity()
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  batchNumber!: string;

  @Column({ type: 'date', nullable: true })
  manufactureDate?: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @ManyToMany(() => Product, (product) => product.batches)
  products!: Product[];

  @OneToMany(() => Stock, (stock) => stock.batch)
  stockEntries!: Stock[];

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
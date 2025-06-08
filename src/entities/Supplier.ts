// src/entities/Supplier.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Purchase } from './Purchase';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column()                      name!: string;
  @Column({ unique: true })     email?: string;
  @Column({ unique: true })     phone?: string;
  @Column({ unique: true })     whatsapp?: string; // NEW
  @Column({ type: 'text', nullable: true }) address?: string;
  @Column({ nullable: true })   website?: string;
  @Column({ nullable: true })   contactPerson?: string;

  @OneToMany(() => Purchase, (p) => p.supplier) purchases!: Purchase[];

  @Column({ type: 'enum', enum: ['Active','Inactive'], default: 'Active' })
  status!: 'Active'|'Inactive';

  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;
  @CreateDateColumn()  createdAt!: Date;
  @UpdateDateColumn()  updatedAt!: Date;
  @DeleteDateColumn()  deletedAt?: Date;
}

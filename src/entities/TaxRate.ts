// src/entities/TaxRate.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

@Entity()
export class TaxRate {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column()                      name!: string;    // NEW
  @Column('decimal',{precision:5,scale:2}) rate!: number;
  @Column({ type:'text', nullable:true }) description?: string;
  @Column({ default:true }) isActive!: boolean;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

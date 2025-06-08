// src/entities/Category.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { SubCategory } from './SubCategory';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true })    name!: string;
  @Column({ type: 'text', nullable: true }) description?: string;

  @OneToMany(() => SubCategory, (s) => s.category) subcategories!: SubCategory[];

  @Column({ type: 'enum', enum: ['Active','Inactive'], default: 'Active' })
  status!: 'Active'|'Inactive';

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

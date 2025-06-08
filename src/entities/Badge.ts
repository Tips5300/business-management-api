// src/entities/Badge.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Badge {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) code!: string;
  @Column()                level!: number;
  @Column({ type:'text',nullable:true }) description?: string;
  @Column({ default:false }) isActive!: boolean;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

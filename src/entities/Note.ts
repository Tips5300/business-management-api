// src/entities/Note.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() title!: string;  // NEW
  @Column({ type: 'text' }) content!: string;
  
  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

// src/entities/Note.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column()                    title!: string;  // NEW
  @Column({ type:'text' })     content!: string;
  @Column({ type:'enum', enum:['Active','Archived'], default:'Active' }) status!: 'Active'|'Archived'; // NEW
  @Column({ type:'varchar', length:50, nullable:true }) relatedEntity?: string; // e.g. 'Sale'
  @Column({ nullable:true }) relatedEntityId?: string;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

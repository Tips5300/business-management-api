// src/entities/Incharge.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Store } from './Store';

@Entity()
export class Incharge {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column()           name!: string;
  @Column({nullable:true}) email?: string;    // optional
  @Column({nullable:true}) phone?: string;    // optional
  @Column({nullable:true}) whatsapp?: string; // optional
  @Column({type:'text',nullable:true}) notes?: string;

  @OneToMany(()=>Store,(s)=>s.incharge) stores!: Store[];

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

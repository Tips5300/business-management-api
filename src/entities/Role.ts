// src/entities/Role.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Employee } from './Employee';
import { Permission } from './Permission';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true }) name!: string;
  @Column({ type:'text', nullable:true }) description?: string;
  @Column({ default:false }) isSystemRole!: boolean;

  @OneToMany(()=>Employee,(e)=>e.role) employees!: Employee[];
  @OneToMany(()=>Permission,(p)=>p.role) permissions!: Permission[];

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

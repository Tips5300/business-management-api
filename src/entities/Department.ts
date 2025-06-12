// src/entities/Department.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column()           name!: string;
  @Column({nullable:true}) description?: string;
  @Column({nullable:true}) managerId?: string;
  @OneToMany(() => Employee,(e)=>e.department) employees!: Employee[];
  
  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

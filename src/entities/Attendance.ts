// src/entities/Attendance.ts

import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(()=>Employee,(e)=>e.attendances,{nullable:false}) employee!: Employee;
  @Column({ type:'date' }) date!: string;
  @Column({ type:'time' }) checkIn!: string;
  @Column({ type:'time' }) checkOut!: string;
  @Column({ default:false }) isLate!: boolean;
  @Column({ nullable:true }) lateByMinutes?: number;

  
  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

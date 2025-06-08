// src/entities/LeaveRequest.ts

import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Employee } from './Employee';

export enum LeaveStatus { PENDING='Pending', APPROVED='Approved', REJECTED='Rejected', CANCELLED='Cancelled' }

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(()=>Employee,(e)=>e.leaveRequests,{nullable:false}) employee!: Employee;
  @Column({ type:'date' }) startDate!: string;
  @Column({ type:'date' }) endDate!: string;
  @Column({ type:'enum', enum:LeaveStatus, default:LeaveStatus.PENDING }) status!: LeaveStatus;
  @Column({ type:'text', nullable:true }) reason?: string;
  @Column({ type:'text', nullable:true }) managerComments?: string;
  @Column({ default:false }) isHalfDay!: boolean;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

// src/entities/Permission.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Role } from './Role';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() module!: string;
  @Column() action!: string;

  @ManyToOne(()=>Role,(r)=>r.permissions,{nullable:false})
  @JoinColumn({ name:'roleId' })
  role!: Role;

  @Column({ type:'boolean', default:true }) isAllowed!: boolean;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

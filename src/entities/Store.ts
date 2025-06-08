// src/entities/Store.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Incharge } from './Incharge';
import { Employee } from './Employee';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column()           name!: string;
  @Column({type:'text',nullable:true}) address?: string;
  @Column({nullable:true}) phone?: string;
  @Column({nullable:true}) email?: string;
  
  @ManyToOne(()=>Incharge,(ic)=>ic.stores,{nullable:true}) incharge?: Incharge;

  @OneToMany(()=>Employee,(e)=>e.store) employees!: Employee[];

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

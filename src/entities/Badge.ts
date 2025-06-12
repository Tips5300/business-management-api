// src/entities/Badge.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class Badge {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) name!: string;
  @Column({ type: "text", nullable: true }) description?: string;
  
  @Column({ nullable: true }) createdBy?: number;
  @Column({ nullable: true }) updatedBy?: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn() deletedAt?: Date;
}

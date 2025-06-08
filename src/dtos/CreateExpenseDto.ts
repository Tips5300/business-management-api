// src/dtos/CreateExpenseDto.ts
import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ExpenseType, ExpenseStatus } from '../entities/Expense';

export class CreateExpenseDto {
  @IsNumber() amount!: number;
  @IsString() description!: string;
  @IsUUID() account!: string;
  @IsEnum(ExpenseType) expenseType!: ExpenseType;
  @IsOptional() @IsDateString() expenseDate?: string;
  @IsEnum(ExpenseStatus) status!: ExpenseStatus;
  @IsOptional() @IsString() notes?: string;
}

// src/dtos/CreateExpenseDto.ts
import {
  IsNumber,
  IsPositive,
  IsDateString,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  expenseType!: number;

  @IsInt()
  paymentMethod!: number;
}
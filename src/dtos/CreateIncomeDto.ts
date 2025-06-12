// src/dtos/CreateIncomeDto.ts
import {
  IsNumber,
  IsPositive,
  IsDateString,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateIncomeDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  incomeType!: number;

  @IsInt()
  paymentMethod!: number;
}
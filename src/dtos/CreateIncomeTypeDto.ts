// src/dtos/CreateIncomeTypeDto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateIncomeTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
// src/dtos/CreateExpenseTypeDto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExpenseTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
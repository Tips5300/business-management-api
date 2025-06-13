// src/dtos/CreateTaxRateDto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTaxRateDto {
  @IsString()
  name!: string;

  @IsNumber()
  rate!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
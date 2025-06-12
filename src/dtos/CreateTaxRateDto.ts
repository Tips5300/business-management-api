// src/dtos/CreateTaxRateDto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateTaxRateDto {
  @IsString()
  name!: string;

  @IsNumber()
  rate!: number;
}

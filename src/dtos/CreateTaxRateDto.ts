// src/dtos/CreateTaxRateDto.ts
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaxRateDto {
  @IsString() name!: string;
  @IsNumber() rate!: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

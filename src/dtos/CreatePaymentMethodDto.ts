// src/dtos/CreatePaymentMethodDto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

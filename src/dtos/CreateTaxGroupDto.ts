// src/dtos/CreateTaxGroupDto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateTaxGroupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  taxRateIds!: string[];
}

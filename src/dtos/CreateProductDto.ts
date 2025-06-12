import {
  IsUUID,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ArrayUnique,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UnitType, WarrantyDurationType } from '../entities/Product';

//
// CreateProductDto
//
export class CreateProductDto {
  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsUUID()
  brand?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsNumber()
  @Type(() => Number)
  purchasePrice!: number;

  @IsNumber()
  @Type(() => Number)
  mrpPrice!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  wholesalePrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dealerPrice?: number;

  @IsOptional()
  @IsUUID()
  tax?: string;

  @IsEnum(UnitType)
  unitType!: UnitType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  warrantyDuration?: number;

  @IsOptional()
  @IsEnum(WarrantyDurationType)
  warrantyDurationType?: WarrantyDurationType;

  @IsOptional()
  @IsUUID()
  category?: string;

  @IsOptional()
  @IsUUID()
  subCategory?: string;
}
// src/dtos/CreateStockAdjustmentDto.ts
import {
  IsUUID,
  IsInt,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import { AdjustmentType, AdjustmentStatus } from '../entities/StockAdjustment';

export class CreateStockAdjustmentDto {
  @IsUUID() product!: string;
  @IsInt() quantityChange!: number;
  @IsEnum(AdjustmentType) adjustmentType!: AdjustmentType;
  @IsOptional() @IsUUID() store?: string;
  @IsOptional() @IsNumber() adjustedValue?: number;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsEnum(AdjustmentStatus) status?: AdjustmentStatus;
  @IsOptional() @IsString() notes?: string;
}

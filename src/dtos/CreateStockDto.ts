// src/dtos/CreateStockDto.ts
import {
  IsUUID,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

export class CreateStockDto {
  @IsUUID() product!: string;
  @IsInt() quantity!: number;
  @IsNumber() unitCost!: number;
  @IsOptional() @IsString() warehouse?: string;
  @IsOptional() @IsString() barcode?: string;
  @IsOptional() @IsEnum(['Active','Inactive']) status?: 'Active'|'Inactive';
  @IsOptional() @IsString() notes?: string;
}

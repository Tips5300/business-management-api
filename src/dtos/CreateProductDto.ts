// src/dtos/CreateProductDto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsArray,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional() @IsString() sku?: string;
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @IsString() barcode?: string;
  @IsOptional() @IsNumber() costPrice?: number;
  @IsOptional() @IsNumber() retailPrice?: number;
  @IsOptional() @IsUUID() category?: string;
  @IsOptional() @IsUUID() subCategory?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsEnum(['Active','Inactive']) status?: 'Active'|'Inactive';
}

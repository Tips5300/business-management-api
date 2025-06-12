// src/dtos/CreateSupplierDto.ts
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { SupplierType } from '../entities/Supplier';

export class CreateSupplierDto {
  @IsString() name!: string;
  @IsOptional() @IsString() picture?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() contactPerson?: string;
  @IsOptional() @IsEnum(SupplierType) supplierType?: SupplierType;
  @IsOptional() @IsString() taxId?: string;
  @IsOptional() @IsEnum(['Active','Inactive']) status?: 'Active'|'Inactive';
}

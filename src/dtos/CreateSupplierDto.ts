// src/dtos/CreateSupplierDto.ts
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class CreateSupplierDto {
  @IsString() name!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() contactPerson?: string;
  @IsOptional() @IsEnum(['Active','Inactive']) status?: 'Active'|'Inactive';
}

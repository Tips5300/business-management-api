// src/dtos/CreateCustomerDto.ts
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { CustomerType } from '../entities//Customer';

export class CreateCustomerDto {
  @IsString() name!: string;
  @IsOptional() @IsString() picture?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsEnum(CustomerType) customerType?: CustomerType;
  @IsOptional() @IsString() taxId?: string;
  @IsOptional() @IsEnum(['Active','Inactive']) status?: 'Active'|'Inactive';
}

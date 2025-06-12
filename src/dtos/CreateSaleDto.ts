// src/dtos/CreateSaleDto.ts
import {
  IsDateString,
  IsOptional,
  IsUUID,
  IsString,
  IsNumberString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { SaleStatus } from '../entities/Sale';

export class CreateSaleDto {
  @IsDateString() saleDate!: string;
  @IsOptional() @IsUUID() customer?: string;
  @IsOptional() @IsUUID() store?: string;
  @IsOptional() @IsUUID() employee?: string;
  @IsNumberString() subTotal!: string;
  @IsOptional() @IsNumberString() discount?: string;
  @IsOptional() @IsNumberString() taxAmount?: string;
  @IsOptional() @IsNumberString() deliveryCharge?: string;
  @IsNumberString() totalAmount!: string;
  @IsNumberString() dueAmount!: string;
  @IsUUID()
  @IsOptional()
  paymentMethod?: string;
  @IsOptional() @IsString() invoiceNumber?: string;
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  receiptOrAny?: string[];
  @IsEnum(SaleStatus) status!: SaleStatus;
  @IsOptional() @IsString() notes?: string;
}

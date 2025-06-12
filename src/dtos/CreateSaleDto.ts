// src/dtos/CreateSaleDto.ts
import {
  IsDateString,
  IsOptional,
  IsUUID,
  IsString,
  IsNumberString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { SaleStatus } from '../entities/Sale';
import { Type } from 'class-transformer';
import { CreateSaleProductDto } from './CreateSaleProductDto';

export class CreateSaleDto {
  @IsDateString() saleDate!: string;
  @IsOptional() @IsUUID() customer?: string;
  @IsOptional() @IsUUID() store?: string;
  @IsOptional() @IsUUID() employee?: string;
    @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleProductDto)
  items?: CreateSaleProductDto[];
  @IsNumberString() subTotal!: string;
  @IsOptional() @IsNumberString() discount?: string;
  @IsOptional() @IsNumberString() taxAmount?: string;
  @IsOptional() @IsNumberString() deliveryCharge?: string;
  @IsNumberString() totalAmount!: string;
  @IsNumberString() dueAmount!: string;
  @IsUUID()
  @IsOptional()
  paymentMethod?: number;
  @IsOptional() @IsString() invoiceNumber?: string;
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  receiptOrAny?: string[];
  @IsEnum(SaleStatus) status!: SaleStatus;
  @IsOptional() @IsString() notes?: string;
}

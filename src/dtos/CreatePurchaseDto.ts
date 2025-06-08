// src/dtos/CreatePurchaseDto.ts
import {
  IsDateString,
  IsOptional,
  IsUUID,
  IsNumberString,
  IsEnum,
  IsString,
} from 'class-validator';
import { PurchaseStatus } from '../entities/Purchase';

export class CreatePurchaseDto {
  @IsDateString() purchaseDate!: string;
  @IsOptional() @IsUUID() supplier?: string;
  @IsOptional() @IsUUID() store?: string;
  @IsOptional() @IsUUID() employee?: string;
  @IsNumberString() subTotal!: string;
  @IsOptional() @IsNumberString() discount?: string;
  @IsOptional() @IsNumberString() taxAmount?: string;
  @IsOptional() @IsNumberString() shippingCharge?: string;
  @IsNumberString() totalAmount!: string;
  @IsNumberString() dueAmount!: string;
  @IsOptional() @IsString() invoiceNumber?: string;
  @IsEnum(PurchaseStatus) status!: PurchaseStatus;
  @IsOptional() @IsString() notes?: string;
}

// src/dtos/CreatePurchaseReturnDto.ts
import {
  IsUUID,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseReturnProductDto } from './CreatePurchaseReturnProductDto';

export class CreatePurchaseReturnDto {
  @IsDateString()
  returnDate!: string;

  @IsUUID()
  purchase!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseReturnProductDto)
  items!: CreatePurchaseReturnProductDto[];

  @IsNumber()
  @IsOptional()
  totalReturnAmount!: number;

  @IsUUID()
  @IsOptional()
  paymentMethod?: number;
}

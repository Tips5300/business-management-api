// src/dtos/CreatePurchaseReturnProductDto.ts
import {
  IsUUID,
  IsInt,
  Min,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class CreatePurchaseReturnProductDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @IsPositive()
  unitPrice!: number;

  @IsNumber()
  totalPrice!: number;
}

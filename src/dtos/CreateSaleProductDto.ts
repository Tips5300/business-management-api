// src/dtos/CreateSaleProductDto.ts
import { IsUUID, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateSaleProductDto {
  @IsUUID() sale!: string;
  @IsUUID() product!: string;
  @IsInt() quantity!: number;
  @IsNumber() unitPrice!: number;
  @IsOptional() @IsNumber() totalPrice?: number;
}

// src/dtos/CreatePurchaseProductDto.ts
import { IsUUID, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreatePurchaseProductDto {
  @IsUUID() purchase!: string;
  @IsUUID() product!: string;
  @IsInt() quantity!: number;
  @IsNumber() unitCost!: number;
  @IsOptional() @IsNumber() totalCost?: number;
  @IsOptional() @IsUUID() batch?: string;
}

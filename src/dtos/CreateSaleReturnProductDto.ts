import { IsUUID, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateSaleReturnProductDto {
  @IsUUID()
  product!: string;

  @IsInt()
  quantity!: number;

  @IsNumber()
  unitPrice!: number;

  @IsNumber()
  totalPrice!: number;

  @IsOptional()
  @IsUUID()
  stock?: string;
}
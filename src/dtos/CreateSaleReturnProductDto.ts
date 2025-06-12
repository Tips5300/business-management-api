import { IsUUID, IsInt, IsNumber } from 'class-validator';

export class CreateSaleReturnProductDto {
  @IsUUID()
  saleReturn!: string;

  @IsUUID()
  product!: string;

  @IsInt()
  quantity!: number;

  @IsNumber()
  unitPrice!: number;

  @IsNumber()
  totalPrice!: number;
}


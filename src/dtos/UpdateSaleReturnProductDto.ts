import { IsOptional, IsUUID, IsInt, IsNumber } from 'class-validator';

export class UpdateSaleReturnProductDto {
  @IsOptional()
  @IsUUID()
  saleReturn?: string;

  @IsOptional()
  @IsUUID()
  product?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}


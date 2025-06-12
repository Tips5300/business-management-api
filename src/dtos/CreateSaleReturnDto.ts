import { IsDateString, IsUUID, IsNumber, IsOptional, ValidateNested, ArrayNotEmpty, IsArray } from 'class-validator';
import { CreateSaleReturnProductDto } from './CreateSaleReturnProductDto';
import { Type } from 'class-transformer';

export class CreateSaleReturnDto {
  @IsDateString()
  returnDate!: string;

  @IsUUID()
  sale!: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleReturnProductDto)
    items!: CreateSaleReturnProductDto[];

  @IsNumber()
  totalReturnAmount!: number;

  @IsUUID()
  @IsOptional()
  paymentMethod?: string;
}


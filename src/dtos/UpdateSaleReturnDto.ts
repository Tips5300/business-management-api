import { IsOptional, IsDateString, IsUUID, IsNumber } from 'class-validator';

export class UpdateSaleReturnDto {
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsUUID()
  sale?: string;

  @IsOptional()
  @IsNumber()
  totalReturnAmount?: number;
}


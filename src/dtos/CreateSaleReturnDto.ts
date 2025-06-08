import { IsDateString, IsUUID, IsNumber } from 'class-validator';

export class CreateSaleReturnDto {
  @IsDateString()
  returnDate!: string;

  @IsUUID()
  sale!: string;

  @IsNumber()
  totalReturnAmount!: number;
}


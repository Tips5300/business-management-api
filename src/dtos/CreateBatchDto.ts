import { IsUUID, IsDateString, IsInt } from 'class-validator';

export class CreateBatchDto {
  @IsUUID()
  product!: string;         // Product ID

  @IsDateString()
  manufactureDate!: string;

  @IsDateString()
  expiryDate!: string;

  @IsInt()
  quantity!: number;
}


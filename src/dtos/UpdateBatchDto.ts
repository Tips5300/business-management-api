import { IsOptional, IsUUID, IsDateString, IsInt } from 'class-validator';

export class UpdateBatchDto {
  @IsOptional()
  @IsUUID()
  product?: string;

  @IsOptional()
  @IsDateString()
  manufactureDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;
}


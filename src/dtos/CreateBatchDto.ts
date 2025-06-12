import { IsUUID, IsDateString, IsInt, IsString, IsOptional } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  batchNumber!: string;

  @IsDateString()
  @IsOptional()
  manufactureDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}


// src/dtos/CreateStockTransferDto.ts
import {
  IsUUID,
  IsInt,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransferStatus } from '../entities/StockTransfer';

export class CreateStockTransferDto {
  @IsUUID() product!: string;
  @IsInt() quantity!: number;
  @IsUUID() fromStore!: string;
  @IsUUID() toStore!: string;
  @IsOptional() @IsNumber() transferValue?: number;
  @IsOptional() @IsEnum(TransferStatus) status?: TransferStatus;
  @IsOptional() @IsString() notes?: string;
}

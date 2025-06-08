// src/dtos/CreateTransactionDto.ts
import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  IsString,
} from 'class-validator';
import {
  TransactionType,
  TransactionStatus,
} from '../entities/Transaction';

export class CreateTransactionDto {
  @IsOptional() @IsUUID() debitAccount?: string;
  @IsOptional() @IsUUID() creditAccount?: string;
  @IsNumber() amount!: number;
  @IsEnum(TransactionType) type!: TransactionType;
  @IsEnum(TransactionStatus) status!: TransactionStatus;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() transactionReference?: string;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() notes?: string;
}

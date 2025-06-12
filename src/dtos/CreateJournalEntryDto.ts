// src/dtos/CreateJournalEntryDto.ts
import {
  IsDateString,
  IsString,
  IsUUID,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateJournalEntryDto {
  @IsDateString() date!: string;
  @IsString()     refType!: string;
  @IsUUID()       refId!: string;
  @IsUUID()       debitAccountId!: string;
  @IsUUID()       creditAccountId!: string;
  @IsNumber()     amount!: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() transactionReference?: string;
}

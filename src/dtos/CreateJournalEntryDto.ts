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
  @IsOptional() @IsString()     refType?: string;
  @IsOptional() @IsUUID()       refId?: string;
  @IsOptional() @IsUUID()       debitAccountId?: string;
  @IsOptional() @IsUUID()       creditAccountId?: string;
  @IsNumber()     amount!: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() transactionReference?: string;
}

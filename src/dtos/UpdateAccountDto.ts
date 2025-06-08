// src/dtos/UpdateAccountDto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
} from 'class-validator';
import { AccountType } from '../entities/Account';

export class UpdateAccountDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(AccountType) accountType?: AccountType;
  @IsOptional() @IsNumber() openingBalance?: number;
  @IsOptional() @IsBoolean() removable?: boolean;
  @IsOptional() @Length(3, 3) @IsString() currency?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() notes?: string;
}

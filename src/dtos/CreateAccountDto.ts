// src/dtos/CreateAccountDto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
} from 'class-validator';
import { AccountType } from '../entities/Account';

export class CreateAccountDto {
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(AccountType) accountType!: AccountType;
  @Length(3, 3) @IsString() currency!: string;
  @IsBoolean() isActive!: boolean;
  @IsOptional() @IsString() notes?: string;
}

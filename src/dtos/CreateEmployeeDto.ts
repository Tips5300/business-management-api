// src/dtos/CreateEmployeeDto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString() name!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsUUID() department?: string;
  @IsOptional() @IsUUID() store?: string;
  @IsOptional() @IsUUID() role?: string;
  @IsOptional() @IsDateString() hireDate?: string;
  @IsOptional() @IsNumber() salary?: number;
}

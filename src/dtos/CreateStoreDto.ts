// src/dtos/CreateStoreDto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { StoreType } from '../entities/Store';

export class CreateStoreDto {
  @IsString() name!: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsEnum(StoreType) type?: StoreType;
}
// src/dtos/CreateStoreDto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateStoreDto {
  @IsString() name!: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsUUID() shop?: string;
  @IsOptional() @IsUUID() incharge?: string;
}

// src/dtos/CreateSubCategoryDto.ts
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
  @IsUUID() category!: string;
}

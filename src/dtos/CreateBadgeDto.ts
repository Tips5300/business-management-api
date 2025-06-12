// src/dtos/CreateBadgeDto.ts
import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateBadgeDto {
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
}

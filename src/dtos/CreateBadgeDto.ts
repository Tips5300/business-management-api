// src/dtos/CreateBadgeDto.ts
import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateBadgeDto {
  @IsString() code!: string;
  @IsInt() level!: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

// src/dtos/CreateInchargeDto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateInchargeDto {
  @IsString() name!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() notes?: string;
}

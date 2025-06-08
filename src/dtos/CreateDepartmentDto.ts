// src/dtos/CreateDepartmentDto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsUUID() managerId?: string;
}

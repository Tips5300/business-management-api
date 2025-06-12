// src/dtos/CreateRoleDto.ts
import { IsString, IsOptional, IsBoolean, IsArray, ArrayUnique, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isSystemRole?: boolean;
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  permissionIds?: string[];
}

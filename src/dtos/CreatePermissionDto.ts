// src/dtos/CreatePermissionDto.ts
import { IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsString() module!: string;
  @IsString() action!: string;
  @IsUUID() role!: string;
  @IsOptional() @IsBoolean() isAllowed?: boolean;
}

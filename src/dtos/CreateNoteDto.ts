// src/dtos/CreateNoteDto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateNoteDto {
  @IsString() title!: string;
  @IsString() content!: string;
  @IsOptional() @IsEnum(['Active','Archived']) status?: 'Active'|'Archived';
  @IsOptional() @IsString() relatedEntity?: string;
  @IsOptional() @IsString() relatedEntityId?: string;
}

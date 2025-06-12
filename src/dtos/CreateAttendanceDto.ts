// src/dtos/CreateAttendanceDto.ts
import {
  IsUUID,
  IsDateString,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsUUID() employee!: string;
  @IsDateString() date!: string;
  @IsString() checkIn!: string;
  @IsString() checkOut!: string;
  @IsOptional() @IsBoolean() isLate?: boolean;
  @IsOptional() @IsInt() lateByMinutes?: number;
}

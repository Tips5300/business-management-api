// src/dtos/CreateLeaveRequestDto.ts
import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { LeaveStatus } from '../entities/LeaveRequest';

export class CreateLeaveRequestDto {
  @IsUUID() employee!: string;
  @IsDateString() startDate!: string;
  @IsDateString() endDate!: string;
  @IsOptional() @IsEnum(LeaveStatus) status?: LeaveStatus;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() managerComments?: string;
  @IsOptional() @IsBoolean() isHalfDay?: boolean;
}

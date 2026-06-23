import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export const INSURANCE_MEMBERSHIP_STATUSES = [
  'active',
  'inactive',
  'expired',
] as const;

export class CreatePatientInsuranceDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  insuranceOrganisationId: string;

  @ApiProperty({ required: false, minimum: 0, maximum: 100, example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiProperty({ required: false, format: 'date-time', example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, format: 'date-time', example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    required: false,
    enum: INSURANCE_MEMBERSHIP_STATUSES,
    example: 'active',
  })
  @IsOptional()
  @IsIn(INSURANCE_MEMBERSHIP_STATUSES)
  status?: string;
}

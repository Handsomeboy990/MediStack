import { ApiProperty } from '@nestjs/swagger';
import { PatientInsuranceDto } from './patient-insurance.dto';

export class PatientDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Ama' })
  firstName: string;

  @ApiProperty({ example: 'Koffi' })
  lastName: string;

  @ApiProperty({ required: false, nullable: true })
  email?: string | null;

  @ApiProperty({ type: [String], example: ['+22997000000'] })
  phoneNumbers: string[];

  @ApiProperty({ required: false, nullable: true })
  address?: string | null;

  @ApiProperty({ required: false, nullable: true, format: 'date-time' })
  dateOfBirth?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  gender?: string | null;

  @ApiProperty({ required: false, nullable: true })
  nationality?: string | null;

  @ApiProperty({ required: false, nullable: true })
  occupation?: string | null;

  @ApiProperty({ required: false, nullable: true })
  maritalStatus?: string | null;

  @ApiProperty({ type: [PatientInsuranceDto], required: false })
  insurances?: PatientInsuranceDto[];

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;
}

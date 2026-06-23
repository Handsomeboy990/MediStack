import { ApiProperty } from '@nestjs/swagger';
import { InsuranceOrganisationDto } from '../../insurance-organisations/dto/insurance-organisation.dto';

export class PatientInsuranceDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  personneId: string;

  @ApiProperty({ format: 'uuid' })
  insuranceOrganisationId: string;

  @ApiProperty({ example: 80 })
  discountPercentage: number;

  @ApiProperty({ required: false, nullable: true, format: 'date-time' })
  startDate?: Date | null;

  @ApiProperty({ required: false, nullable: true, format: 'date-time' })
  endDate?: Date | null;

  @ApiProperty({ required: false, nullable: true, example: 'active' })
  status?: string | null;

  @ApiProperty({ required: false, type: InsuranceOrganisationDto })
  insuranceOrganisation?: InsuranceOrganisationDto;
}

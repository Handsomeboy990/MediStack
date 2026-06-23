import { PartialType } from '@nestjs/swagger';
import { CreatePatientInsuranceDto } from './create-patient-insurance.dto';

export class UpdatePatientInsuranceDto extends PartialType(
  CreatePatientInsuranceDto,
) {}

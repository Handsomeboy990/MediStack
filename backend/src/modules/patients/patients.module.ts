import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientInsurancesController } from './patient-insurances.controller';
import { PatientInsurancesService } from './patient-insurances.service';

@Module({
  controllers: [PatientsController, PatientInsurancesController],
  providers: [PatientsService, PatientInsurancesService],
  exports: [PatientsService],
})
export class PatientsModule {}

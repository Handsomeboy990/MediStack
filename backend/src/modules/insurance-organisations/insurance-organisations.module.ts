import { Module } from '@nestjs/common';
import { InsuranceOrganisationsController } from './insurance-organisations.controller';
import { InsuranceOrganisationsService } from './insurance-organisations.service';

@Module({
  controllers: [InsuranceOrganisationsController],
  providers: [InsuranceOrganisationsService],
  exports: [InsuranceOrganisationsService],
})
export class InsuranceOrganisationsModule {}

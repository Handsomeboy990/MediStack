import { Injectable } from '@nestjs/common';
import { InsuranceOrganisation } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/services/base-crud.service';

// Read-only catalog of insurers. Data comes from the seeder; only findAll and
// findOne are exposed through the controller.
@Injectable()
export class InsuranceOrganisationsService extends BaseCrudService<
  InsuranceOrganisation,
  never,
  never
> {
  constructor(prisma: PrismaService) {
    super(prisma.insuranceOrganisation, { softDelete: false });
  }
}

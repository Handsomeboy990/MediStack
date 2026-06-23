import { Injectable } from '@nestjs/common';
import { Personne } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/services/base-crud.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService extends BaseCrudService<
  Personne,
  CreatePatientDto,
  UpdatePatientDto
> {
  constructor(prisma: PrismaService) {
    super(prisma.personne, {
      softDelete: false,
      defaultInclude: {
        insurances: { include: { insuranceOrganisation: true } },
      },
    });
  }

  create(dto: CreatePatientDto): Promise<Personne> {
    return super.create(this.normalizeDates(dto) as CreatePatientDto);
  }

  update(id: string, dto: UpdatePatientDto): Promise<Personne> {
    return super.update(id, this.normalizeDates(dto) as UpdatePatientDto);
  }

  // Prisma DateTime needs a full timestamp, so convert the ISO date string.
  private normalizeDates<T extends { dateOfBirth?: string }>(dto: T) {
    if (!dto.dateOfBirth) {
      return dto;
    }
    return { ...dto, dateOfBirth: new Date(dto.dateOfBirth) };
  }
}

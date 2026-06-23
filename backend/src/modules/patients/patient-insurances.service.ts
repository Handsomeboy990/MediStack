import { Injectable, NotFoundException } from '@nestjs/common';
import { PersonneInsurance, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientInsuranceDto } from './dto/create-patient-insurance.dto';
import { UpdatePatientInsuranceDto } from './dto/update-patient-insurance.dto';

type MembershipWithOrg = PersonneInsurance & {
  insuranceOrganisation?: unknown;
};

// Parent-scoped service: every operation is bound to a patient (personne).
@Injectable()
export class PatientInsurancesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(patientId: string) {
    await this.ensurePatient(patientId);
    const memberships = await this.prisma.personneInsurance.findMany({
      where: { personneId: patientId },
      include: { insuranceOrganisation: true },
      orderBy: { createdAt: 'desc' },
    });
    return memberships.map((membership) => this.toResponse(membership));
  }

  async create(patientId: string, dto: CreatePatientInsuranceDto) {
    await this.ensurePatient(patientId);
    await this.ensureInsurer(dto.insuranceOrganisationId);
    const membership = await this.prisma.personneInsurance.create({
      data: {
        personneId: patientId,
        insuranceOrganisationId: dto.insuranceOrganisationId,
        discountPercentage: dto.discountPercentage ?? 0,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status ?? 'active',
      },
      include: { insuranceOrganisation: true },
    });
    return this.toResponse(membership);
  }

  async update(
    patientId: string,
    membershipId: string,
    dto: UpdatePatientInsuranceDto,
  ) {
    await this.ensureMembership(patientId, membershipId);
    if (dto.insuranceOrganisationId) {
      await this.ensureInsurer(dto.insuranceOrganisationId);
    }
    const membership = await this.prisma.personneInsurance.update({
      where: { id: membershipId },
      data: {
        insuranceOrganisationId: dto.insuranceOrganisationId,
        discountPercentage: dto.discountPercentage,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status,
      },
      include: { insuranceOrganisation: true },
    });
    return this.toResponse(membership);
  }

  async remove(patientId: string, membershipId: string): Promise<void> {
    await this.ensureMembership(patientId, membershipId);
    await this.prisma.personneInsurance.delete({ where: { id: membershipId } });
  }

  private async ensurePatient(patientId: string): Promise<void> {
    const patient = await this.prisma.personne.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
  }

  private async ensureInsurer(insurerId: string): Promise<void> {
    const insurer = await this.prisma.insuranceOrganisation.findUnique({
      where: { id: insurerId },
    });
    if (!insurer) {
      throw new NotFoundException('Insurance organisation not found');
    }
  }

  private async ensureMembership(
    patientId: string,
    membershipId: string,
  ): Promise<void> {
    const membership = await this.prisma.personneInsurance.findFirst({
      where: { id: membershipId, personneId: patientId },
    });
    if (!membership) {
      throw new NotFoundException('Insurance membership not found');
    }
  }

  // Converts the Decimal discountPercentage into a plain number for responses.
  private toResponse(membership: MembershipWithOrg) {
    return {
      ...membership,
      discountPercentage: new Prisma.Decimal(
        membership.discountPercentage,
      ).toNumber(),
    };
  }
}

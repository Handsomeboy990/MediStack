import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatistiquesService {
  constructor(private readonly prisma: PrismaService) {}

  // Summary indicators for the dashboards. Finer aggregations (revenue per
  // period, per payment mode, and so on) will be added later.
  async resume() {
    const [patients, factures, paiements, articles] = await Promise.all([
      this.prisma.patient.count(),
      this.prisma.facture.count(),
      this.prisma.paiement.count(),
      this.prisma.stockMagasinCentral.count(),
    ]);

    return {
      data: {
        nbPatients: patients,
        nbFactures: factures,
        nbPaiements: paiements,
        nbArticlesStock: articles,
      },
      meta: null,
    };
  }
}

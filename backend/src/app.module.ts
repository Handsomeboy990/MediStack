import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { PrestationsModule } from './modules/prestations/prestations.module';
import { FacturesModule } from './modules/factures/factures.module';
import { PaiementsModule } from './modules/paiements/paiements.module';
import { StockModule } from './modules/stock/stock.module';
import { StatistiquesModule } from './modules/statistiques/statistiques.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    PrestationsModule,
    FacturesModule,
    PaiementsModule,
    StockModule,
    StatistiquesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

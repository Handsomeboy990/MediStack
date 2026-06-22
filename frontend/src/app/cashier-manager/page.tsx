import { DashboardPlaceholder } from '@/components/dashboard-placeholder';

export default function CashierManagerPage() {
  return (
    <DashboardPlaceholder
      titre="Espace Responsable de caisse"
      description="Pilotage des opérations de caisse et validation des annulations."
      sections={[
        'Suivi des encaissements du jour',
        "Demandes d'annulation à traiter",
        'Clôture de caisse',
        'Rapports de caisse',
      ]}
    />
  );
}

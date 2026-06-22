import { DashboardPlaceholder } from '@/components/dashboard-placeholder';

export default function StorekeeperPage() {
  return (
    <DashboardPlaceholder
      titre="Espace Agent magasinier"
      description="Gestion du stock du magasin central et des mouvements."
      sections={[
        'État du stock du magasin central',
        'Entrée de stock',
        'Sortie de stock',
        'Alertes de seuil de réapprovisionnement',
      ]}
    />
  );
}

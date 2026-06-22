import { DashboardPlaceholder } from '@/components/dashboard-placeholder';

export default function DirectorPage() {
  return (
    <DashboardPlaceholder
      titre="Espace Promoteur"
      description="Vision globale, statistiques et supervision du centre de santé."
      sections={[
        "Tableau de bord d'activité",
        "Chiffre d'affaires par période",
        'Suivi des caisses et des agents',
        'État global du stock',
      ]}
    />
  );
}

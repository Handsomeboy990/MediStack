import { DashboardPlaceholder } from '@/components/dashboard-placeholder';

export default function HrPage() {
  return (
    <DashboardPlaceholder
      titre="Espace Ressources humaines"
      description="Gestion du personnel et des accès."
      sections={[
        'Liste du personnel',
        "Création d'un compte agent",
        'Attribution des rôles',
        'Activation et désactivation des accès',
      ]}
    />
  );
}

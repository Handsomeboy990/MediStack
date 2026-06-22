import { DashboardPlaceholder } from '@/components/dashboard-placeholder';

export default function CashierPage() {
  return (
    <DashboardPlaceholder
      titre="Espace Agent de caisse"
      description="Enregistrement des patients, facturation et encaissement."
      sections={[
        "Enregistrement d'un patient",
        'Personnes à contacter du patient (une à deux)',
        "Création d'une facture",
        "Encaissement d'un paiement",
        "Demande d'annulation de facture",
      ]}
    />
  );
}

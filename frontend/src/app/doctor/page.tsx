'use client';

import Link from 'next/link';
import { ClipboardList, FileText, Receipt, Stethoscope } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { Button } from '@/components/ui/button';
import { usePrescriptions } from '@/lib/prescriptions-store';
import { useFactures } from '@/lib/factures-store';

function DoctorDashboardContent() {
  const prescriptions = usePrescriptions();
  const factures = useFactures();

  const facturesPrescription = factures.filter((f) => f.origine === 'PRESCRIPTION');
  const brouillons = facturesPrescription.filter((f) => f.estBrouillon && f.statut === 'EN_ATTENTE').length;

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Espace médecin</h1>
        <p className="text-sm text-muted-foreground">
          Prescription médicale et transmission automatique des brouillons de facture à la caisse.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Prescriptions du jour" value={String(prescriptions.length)} tone="primary" hint="Actes et bilans" />
        <KpiCard label="Brouillons en caisse" value={String(brouillons)} tone="warning" hint="En attente de paiement" />
        <KpiCard label="Factures issues prescription" value={String(facturesPrescription.length)} tone="success" hint="Historique global" />
        <KpiCard label="Statut" value="Actif" tone="primary" hint="Flux médecin-caisse opérationnel" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Démarrage rapide</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Link href="/doctor/prescriptions" className="flex-1">
            <Button variant="brand" className="w-full gap-2">
              <FileText className="h-4 w-4" /> Nouvelle prescription
            </Button>
          </Link>
          <Link href="/cashier/factures" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Receipt className="h-4 w-4" /> Voir la caisse
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workflow</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Stethoscope className="h-4 w-4 text-primary" />1. Prescrire</p>
            <p className="text-xs text-muted-foreground">Le médecin recherche les actes/bilans, coche et ajoute à l&apos;ordonnance.</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><ClipboardList className="h-4 w-4 text-primary" />2. Brouillon auto</p>
            <p className="text-xs text-muted-foreground">Une facture brouillon est créée automatiquement en caisse pour le patient.</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Receipt className="h-4 w-4 text-primary" />3. Encaisser</p>
            <p className="text-xs text-muted-foreground">L&apos;agent de caisse ajuste les lignes si nécessaire, encaisse et remet la facture.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function DoctorPage() {
  return <DoctorDashboardContent />;
}

'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Phone, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddCarteDialog } from '@/components/add-carte-dialog';
import { FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';
import { usePatient } from '@/lib/patients-store';

export default function FichePatientPage({ params }: { params: { id: string } }) {
  const patient = usePatient(params.id);
  const factures = FACTURES.filter((f) => f.patientId === params.id);

  if (!patient) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Patient introuvable.</p>;
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/cashier/patients">
          <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Retour</Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">{patient.prenom} {patient.nom}</h1>
          <p className="text-xs text-muted-foreground">{patient.id}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Né(e) le</span><strong>{patient.dateNaissance || 'Non renseignée'}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Téléphone</span><strong>{patient.telephone}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Adresse</span><strong>{patient.adresse}</strong></div>
            <Separator />
            <div className="flex justify-between"><span className="text-muted-foreground">Contact urgence</span><strong>{patient.urgenceNom}</strong></div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tél. urgence</span>
              <a href={`tel:${patient.urgenceTel}`} className="flex items-center gap-1 text-primary hover:underline">
                <Phone className="h-3 w-3" />{patient.urgenceTel}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Cartes d&apos;assurance</CardTitle>
            <AddCarteDialog patientId={patient.id} />
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {patient.cartesAssurance.length === 0 ? (
              <p className="text-muted-foreground">Aucune carte enregistrée pour ce patient.</p>
            ) : (
              patient.cartesAssurance.map((c) => (
                <div key={c.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4 text-primary" />{c.nom}</span>
                    <Badge variant="success">{c.taux}%</Badge>
                  </div>
                  <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                    {c.societe && <span>{c.societe}</span>}
                    <span>Police : {c.numeroPolice || '-'} · Matricule : {c.numeroMatricule || '-'}</span>
                    {c.dateExpiration && <span>Expire le {c.dateExpiration}</span>}
                  </div>
                </div>
              ))
            )}
            <Separator />
            <Link href={`/cashier/factures/nouveau?patient=${patient.id}`}>
              <Button variant="brand" className="w-full gap-2">
                <FileText className="h-4 w-4" /> Nouvelle facture pour ce patient
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Historique des factures</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {factures.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Aucune facture enregistrée.</p>
          ) : (
            factures.map((f) => (
              <Link key={f.id} href={`/cashier/factures/${f.id}`}>
                <div className="flex items-center justify-between rounded-xl border border-border p-3 transition hover:border-primary hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{f.id}</p>
                    <p className="text-xs text-muted-foreground">{f.date} · {f.agent}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold">{fmt(f.net)}</p>
                    <Badge variant={STATUT_VARIANTS[f.statut]}>{STATUT_LABELS[f.statut]}</Badge>
                  </div>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}

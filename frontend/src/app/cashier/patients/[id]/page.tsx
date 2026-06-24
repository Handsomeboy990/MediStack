'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, MapPin, Phone, ShieldCheck, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddCarteDialog } from '@/components/add-carte-dialog';
import { EditPatientDialog } from '@/components/edit-patient-dialog';
import { FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';
import { usePatient } from '@/lib/patients-store';

const ANNEE_COURANTE = new Date().getFullYear();

export default function FichePatientPage({ params }: { params: { id: string } }) {
  const patient = usePatient(params.id);
  const factures = FACTURES.filter((f) => f.patientId === params.id);

  if (!patient) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Patient introuvable.</p>;
  }

  const carte = patient.cartesAssurance[0];
  const age = patient.dateNaissance ? ANNEE_COURANTE - Number(patient.dateNaissance.slice(0, 4)) : null;
  const infos = [
    { label: 'Âge', value: age !== null ? `${age} ans` : 'Inconnu' },
    { label: 'Né(e) le', value: patient.dateNaissance || 'Non renseigné' },
  ];

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/cashier/patients">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Retour</Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">{patient.prenom} {patient.nom}</h1>
            <p className="text-xs text-muted-foreground">{patient.id}</p>
          </div>
        </div>
        <EditPatientDialog patient={patient} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Colonne gauche : profil */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border bg-primary/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><User className="h-7 w-7 text-primary" /></div>
                <div>
                  <p className="font-semibold leading-tight">{patient.prenom} {patient.nom}</p>
                  <p className="text-xs text-muted-foreground">{patient.id}</p>
                </div>
              </div>
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Actif</span>
            </div>
            <CardContent className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3">
                {infos.map((f) => (
                  <div key={f.label} className="rounded-lg border border-border bg-muted/30 p-2.5">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{f.label}</p>
                    <p className="text-sm font-semibold">{f.value}</p>
                  </div>
                ))}
              </div>
              {carte && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-primary" /><span className="text-muted-foreground">Couverture {carte.nom}</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${carte.taux}%` }} /></div>
                  <p className="mt-1 text-xs font-bold text-primary">{carte.taux}% pris en charge</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Contacts</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-primary" /><span className="text-muted-foreground">{patient.telephone}</span></div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-primary" /><span className="text-muted-foreground">{patient.adresse}</span></div>
              <div className="flex items-center gap-3"><User className="h-4 w-4 shrink-0 text-primary" /><span className="text-muted-foreground">Urgence : {patient.urgenceNom} · {patient.urgenceTel}</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite : assurances + historique */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">Cartes d&apos;assurance</CardTitle>
              <AddCarteDialog patientId={patient.id} />
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {patient.cartesAssurance.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune carte enregistrée pour ce patient.</p>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-primary" />Historique des factures</CardTitle>
              <Link href={`/cashier/factures/nouveau?patient=${patient.id}`}>
                <Button variant="brand" size="sm" className="gap-2"><FileText className="h-4 w-4" /> Nouvelle facture</Button>
              </Link>
            </CardHeader>
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
        </div>
      </div>
    </main>
  );
}

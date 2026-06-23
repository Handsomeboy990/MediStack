'use client';

import { useState } from 'react';
import { Printer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FACTURES, fmt } from '@/lib/mock-data';

const myAgent = 'Ahouansou B.';
const MODE_LABELS: Record<string, string> = { ESPECES: 'Espèces', MOBILE: 'Mobile money', MIXTE: 'Mixte' };
const CATEGORIES = ['Espèces', 'Paiement virtuel', 'Chèque', 'Mixte'];

// Regroupe les modes de paiement détaillés en grandes catégories de recette.
function categorie(mode: string | null) {
  if (!mode) return 'Autre';
  if (mode === 'ESPECES' || mode === 'Espèces') return 'Espèces';
  if (mode === 'MIXTE' || mode === 'Mixte') return 'Mixte';
  if (mode.startsWith('Chèque')) return 'Chèque';
  return 'Paiement virtuel';
}

export default function RecettePage() {
  const [dateDebut, setDateDebut] = useState('2026-06-23');
  const [dateFin, setDateFin] = useState('2026-06-23');
  const myFacs = FACTURES.filter((f) => f.agent === myAgent && (!dateDebut || f.date >= dateDebut) && (!dateFin || f.date <= dateFin));
  const soldees = myFacs.filter((f) => f.statut === 'PAYE');
  const encaisse = soldees.reduce((s, f) => s + f.verse, 0);
  const partAssurance = myFacs.reduce((s, f) => s + f.assurancePrise, 0);
  const restant = myFacs.filter((f) => f.statut === 'PARTIEL').reduce((s, f) => s + (f.net - f.verse), 0);

  const parCategorie = CATEGORIES.map((cat) => ({
    label: cat,
    val: soldees.filter((f) => categorie(f.modePaiement) === cat).reduce((s, f) => s + f.verse, 0),
  })).filter((r) => r.val > 0 || r.label !== 'Mixte');

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">Recette</h1>
          <p className="text-sm text-muted-foreground">{myAgent}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Du</span>
          <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <span className="text-xs text-muted-foreground">au</span>
          <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <Button variant="brand" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" />Imprimer</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Encaissé (caisse)" value={fmt(encaisse)} tone="success" hint={`${soldees.length} facture(s) soldée(s)`} />
        <KpiCard label="Part assurance" value={fmt(partAssurance)} tone="primary" hint="À recouvrer auprès des assureurs" />
        <KpiCard label="Restant à encaisser" value={fmt(restant)} tone="warning" hint="Sur factures partielles" />
        <KpiCard label="Factures émises" value={String(myFacs.length)} tone="neutral" hint="Toutes statuts" />
      </div>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-sm">Répartition des encaissements</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mode de paiement</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Part</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parCategorie.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="font-medium">{r.label}</TableCell>
                <TableCell className="text-right font-semibold">{fmt(r.val)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{encaisse > 0 ? Math.round((r.val / encaisse) * 100) : 0}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-xs uppercase text-muted-foreground">Total</TableCell>
              <TableCell className="text-right text-primary">{fmt(encaisse)}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-sm">Détail des encaissements</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Versé</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myFacs.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-bold text-primary">{f.id}</TableCell>
                <TableCell className="font-medium">{f.patient}</TableCell>
                <TableCell className="text-muted-foreground">{f.modePaiement ? MODE_LABELS[f.modePaiement] ?? f.modePaiement : '-'}</TableCell>
                <TableCell className="text-right font-semibold">{fmt(f.verse)}</TableCell>
                <TableCell><Badge variant={f.statut === 'PAYE' ? 'success' : 'warning'}>{f.statut === 'PAYE' ? 'Soldée' : 'Partielle'}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="text-xs uppercase text-muted-foreground">Total encaissé</TableCell>
              <TableCell className="text-right text-primary">{fmt(encaisse)}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
        {myFacs.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Aucune recette pour cette date.</p>}
      </Card>
    </main>
  );
}

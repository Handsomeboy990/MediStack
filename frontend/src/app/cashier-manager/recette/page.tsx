'use client';

import { useState } from 'react';
import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FACTURES, fmt } from '@/lib/mock-data';

const MODE_LABELS: Record<string, string> = { ESPECES: 'Espèces', MOBILE: 'Mobile money', MIXTE: 'Mixte' };

export default function RecetteManagerPage() {
  const [date, setDate] = useState('2026-06-23');
  const dayFacs = FACTURES.filter((f) => f.date === date);
  const soldees = dayFacs.filter((f) => f.statut === 'PAYE');
  const total = soldees.reduce((s, f) => s + f.verse, 0);
  const partAssurance = dayFacs.reduce((s, f) => s + f.assurancePrise, 0);
  const restant = dayFacs.filter((f) => f.statut === 'PARTIEL').reduce((s, f) => s + (f.net - f.verse), 0);

  const parMode = ['ESPECES', 'MOBILE', 'MIXTE'].map((m) => ({
    label: MODE_LABELS[m],
    val: soldees.filter((f) => f.modePaiement === m).reduce((s, f) => s + f.verse, 0),
  }));
  const agents = [...new Set(soldees.map((f) => f.agent))];

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">Recette globale</h1>
          <p className="text-sm text-muted-foreground">Tous caissiers</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <Button variant="brand" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" />Imprimer</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Encaissé (caisse)" value={fmt(total)} tone="success" hint={`${soldees.length} facture(s) soldée(s)`} />
        <KpiCard label="Part assurance" value={fmt(partAssurance)} tone="primary" hint="À recouvrer auprès des assureurs" />
        <KpiCard label="Restant à encaisser" value={fmt(restant)} tone="warning" hint="Sur factures partielles" />
        <KpiCard label="Factures émises" value={String(dayFacs.length)} tone="neutral" hint="Toutes statuts" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Répartition par mode de paiement</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {parMode.map((r) => (
            <div key={r.label} className="space-y-1">
              <div className="flex justify-between text-sm"><span>{r.label}</span><strong className="text-primary">{fmt(r.val)}</strong></div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: total > 0 ? `${Math.round((r.val / total) * 100)}%` : '0%' }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-sm">Recette par caissier</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caissier</TableHead>
              <TableHead className="text-right">Factures soldées</TableHead>
              <TableHead className="text-right">Encaissé</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => {
              const agentFacs = soldees.filter((f) => f.agent === agent);
              return (
                <TableRow key={agent}>
                  <TableCell className="font-medium">{agent}</TableCell>
                  <TableCell className="text-right">{agentFacs.length}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{fmt(agentFacs.reduce((s, f) => s + f.verse, 0))}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-xs uppercase text-muted-foreground">Total</TableCell>
              <TableCell className="text-right">{soldees.length}</TableCell>
              <TableCell className="text-right text-primary">{fmt(total)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {agents.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Aucune recette pour cette date.</p>}
      </Card>
    </main>
  );
}

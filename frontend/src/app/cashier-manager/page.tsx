import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ANNULATIONS, FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';

const today = '2026-06-23';
const facs = FACTURES.filter((f) => f.date === today);
const totalJour = facs.filter((f) => f.statut === 'PAYE').reduce((s, f) => s + f.verse, 0);
const enAttenteAnnul = ANNULATIONS.filter((a) => a.statut === 'EN_ATTENTE');
const agentsActifs = [...new Set(facs.map((f) => f.agent))].length;

const kpis = [
  { label: 'Recette du jour', value: fmt(totalJour), tone: 'primary' as const, hint: 'Net encaissé' },
  { label: 'Caissiers actifs', value: String(agentsActifs), tone: 'success' as const, hint: 'Ayant facturé' },
  { label: 'Annulations en attente', value: String(enAttenteAnnul.length), tone: 'danger' as const, hint: 'À traiter' },
  { label: 'Factures émises', value: String(facs.length), tone: 'neutral' as const, hint: 'Aujourd’hui' },
];

export default function CashierManagerPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">23 juin 2026 · Responsable de caisse</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => <KpiCard key={k.label} label={k.label} value={k.value} tone={k.tone} hint={k.hint} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Journal des opérations */}
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Journal des opérations</CardTitle>
            <Link href="/cashier-manager/factures" className="text-xs font-semibold text-primary hover:underline">Voir tout</Link>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FACTURES.slice(0, 7).map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-bold text-primary">{f.id}</TableCell>
                  <TableCell className="text-muted-foreground">{f.agent}</TableCell>
                  <TableCell className="font-medium">{f.patient}</TableCell>
                  <TableCell className="text-right font-semibold">{fmt(f.net)}</TableCell>
                  <TableCell><Badge variant={STATUT_VARIANTS[f.statut]}>{STATUT_LABELS[f.statut]}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Actions requises */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Actions requises</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {enAttenteAnnul.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
              ) : (
                enAttenteAnnul.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">Annulation demandée</p>
                        <p className="text-xs text-muted-foreground">{a.factureId} · {a.patient}</p>
                      </div>
                      <p className="text-sm font-bold text-rose-600">{fmt(a.montant)}</p>
                    </div>
                    <p className="mt-2 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">Motif : {a.motif}</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="brand" size="sm" className="flex-1">Approuver</Button>
                      <Button variant="outline" size="sm" className="flex-1">Rejeter</Button>
                    </div>
                  </div>
                ))
              )}
              <Link href="/cashier-manager/annulations">
                <Button variant="outline" size="sm" className="w-full">Toutes les annulations</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

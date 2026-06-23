'use client';

import { useState } from 'react';
import { Printer, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { KpiCard } from '@/components/kpi-card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';
import { printFacture } from '@/lib/print';

const STATUTS = ['Tous', 'PAYE', 'PARTIEL', 'EN_ATTENTE', 'ANNULE'];

export default function FacturesManagerPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('Tous');
  const [date, setDate] = useState('');

  const filtered = FACTURES.filter((f) => {
    const matchSearch = f.patient.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statut === 'Tous' || f.statut === statut;
    const matchDate = !date || f.date === date;
    return matchSearch && matchStatut && matchDate;
  });

  const totalFacture = filtered.reduce((s, f) => s + f.net, 0);
  const totalVerse = filtered.reduce((s, f) => s + f.verse, 0);
  const totalAssurance = filtered.reduce((s, f) => s + f.assurancePrise, 0);

  return (
    <main className="space-y-4">
      <h1 className="text-lg font-bold">Liste des factures</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Net facturé" value={fmt(totalFacture)} tone="primary" hint={`${filtered.length} facture(s)`} />
        <KpiCard label="Encaissé" value={fmt(totalVerse)} tone="success" hint="Versé patient" />
        <KpiCard label="Part assurance" value={fmt(totalAssurance)} tone="neutral" hint="À recouvrer" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un patient ou une référence..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Input type="date" className="w-full sm:w-44" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="flex flex-wrap gap-1.5">
            {STATUTS.map((s) => (
              <button key={s} onClick={() => setStatut(s)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${statut === s ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted'}`}>
                {s === 'Tous' ? 'Tous' : STATUT_LABELS[s as keyof typeof STATUT_LABELS]}
              </button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Net</TableHead>
              <TableHead className="text-right">Versé</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-bold text-primary">{f.id}</TableCell>
                <TableCell className="font-medium">{f.patient}</TableCell>
                <TableCell className="text-muted-foreground">{f.date}</TableCell>
                <TableCell className="text-muted-foreground">{f.agent}</TableCell>
                <TableCell className="text-right font-semibold">{fmt(f.net)}</TableCell>
                <TableCell className="text-right">{fmt(f.verse)}</TableCell>
                <TableCell><Badge variant={STATUT_VARIANTS[f.statut]}>{STATUT_LABELS[f.statut]}</Badge></TableCell>
                <TableCell className="text-right">
                  <button onClick={() => printFacture(f)} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Printer className="h-3.5 w-3.5" />Imprimer
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="text-xs uppercase text-muted-foreground">Totaux</TableCell>
              <TableCell className="text-right text-primary">{fmt(totalFacture)}</TableCell>
              <TableCell className="text-right">{fmt(totalVerse)}</TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableFooter>
        </Table>

        {filtered.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Aucune facture pour ces critères.</p>}
      </Card>
    </main>
  );
}

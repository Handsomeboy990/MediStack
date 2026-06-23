'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';

const STATUTS = ['Tous', 'PAYE', 'PARTIEL', 'EN_ATTENTE', 'ANNULE'];

export default function FacturesManagerPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('Tous');

  const filtered = FACTURES.filter((f) => {
    const matchSearch =
      f.patient.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statut === 'Tous' || f.statut === statut;
    return matchSearch && matchStatut;
  });

  return (
    <main className="space-y-6">
      <h1 className="text-lg font-bold">Liste des factures</h1>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher un patient ou une référence…"
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statut} onValueChange={setStatut}>
          <SelectTrigger className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{filtered.length} facture(s)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((f) => (
            <Link key={f.id} href={`/cashier-manager/factures/${f.id}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-4 transition hover:border-primary hover:bg-muted/30">
                <div>
                  <p className="font-semibold">{f.patient}</p>
                  <p className="text-xs text-muted-foreground">{f.id} · {f.date} · {f.agent}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{fmt(f.net)}</p>
                    <p className="text-xs text-muted-foreground">Versé : {fmt(f.verse)}</p>
                  </div>
                  <Badge variant={STATUT_VARIANTS[f.statut]}>{STATUT_LABELS[f.statut]}</Badge>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

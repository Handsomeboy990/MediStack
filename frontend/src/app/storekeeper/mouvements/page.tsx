'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOUVEMENTS_STOCK } from '@/lib/mock-data';

const TYPES = ['Tous', 'ENTREE', 'SORTIE', 'AJUSTEMENT', 'TRANSFERT'];
const TYPE_LABELS: Record<string, string> = { ENTREE: 'Entrée', SORTIE: 'Sortie', AJUSTEMENT: 'Inventaire', TRANSFERT: 'Transfert' };

function typeBadge(type: string) {
  const variant = type === 'ENTREE' ? 'success' : type === 'SORTIE' ? 'warning' : type === 'TRANSFERT' ? 'default' : 'secondary';
  return <Badge variant={variant as 'success' | 'warning' | 'default' | 'secondary'}>{TYPE_LABELS[type] ?? type}</Badge>;
}

export default function MouvementsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Tous');

  const filtered = MOUVEMENTS_STOCK.filter((m) => {
    const matchType = type === 'Tous' || m.type === type;
    const matchSearch = m.article.toLowerCase().includes(search.toLowerCase()) || m.agent.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <main className="space-y-4">
      <h1 className="text-lg font-bold">Mouvements de stock</h1>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un article ou un agent..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${type === t ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted'}`}>
                {t === 'Tous' ? 'Tous' : TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Article</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Motif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-muted-foreground">{m.date}</TableCell>
                <TableCell className="font-medium">{m.article}</TableCell>
                <TableCell>{typeBadge(m.type)}</TableCell>
                <TableCell className={`text-right font-bold ${m.quantite < 0 ? 'text-rose-600' : ''}`}>{m.quantite > 0 ? `+${m.quantite}` : m.quantite}</TableCell>
                <TableCell className="text-muted-foreground">{m.agent}</TableCell>
                <TableCell className="text-muted-foreground">{m.motif}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Aucun mouvement pour ces critères.</p>}
      </Card>
    </main>
  );
}

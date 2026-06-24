'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLogs, type LogAction } from '@/lib/logs-store';

const ACTIONS: (LogAction | 'Tous')[] = ['Tous', 'CREATE', 'UPDATE', 'DELETE'];
const ACTION_LABELS: Record<LogAction, string> = { CREATE: 'Création', UPDATE: 'Modification', DELETE: 'Suppression' };
const ACTION_VARIANTS: Record<LogAction, 'success' | 'warning' | 'destructive'> = { CREATE: 'success', UPDATE: 'warning', DELETE: 'destructive' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR');
}

export default function LogsPage() {
  const logs = useLogs();
  const [search, setSearch] = useState('');
  const [action, setAction] = useState<LogAction | 'Tous'>('Tous');

  const filtered = logs.filter((l) => {
    const matchAction = action === 'Tous' || l.action === action;
    const q = search.toLowerCase();
    const matchSearch = l.description.toLowerCase().includes(q) || l.entity.toLowerCase().includes(q) || l.user.toLowerCase().includes(q);
    return matchAction && matchSearch;
  });

  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-lg font-bold">Journal d&apos;activité</h1>
        <p className="text-sm text-muted-foreground">Toutes les actions sont enregistrées et horodatées.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher dans le journal..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ACTIONS.map((a) => (
              <button key={a} onClick={() => setAction(a)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${action === a ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted'}`}>
                {a === 'Tous' ? 'Tous' : ACTION_LABELS[a]}
              </button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entité</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(l.date)}</TableCell>
                <TableCell className="font-medium">{l.user}</TableCell>
                <TableCell><Badge variant={ACTION_VARIANTS[l.action]}>{ACTION_LABELS[l.action]}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{l.entity}</TableCell>
                <TableCell>{l.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Aucune entrée pour ces critères.</p>}
      </Card>
    </main>
  );
}

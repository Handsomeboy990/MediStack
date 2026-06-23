'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ANNULATIONS, fmt } from '@/lib/mock-data';

export default function AnnulationsPage() {
  const [comments, setComments] = useState<Record<string, string>>({});

  const pending = ANNULATIONS.filter((a) => a.statut === 'EN_ATTENTE');

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-lg font-bold">Annulations en attente</h1>
        <p className="text-sm text-muted-foreground">{pending.length} demande(s) à traiter</p>
      </div>

      {pending.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Aucune demande d&apos;annulation en attente.
          </CardContent>
        </Card>
      )}

      {pending.map((ann) => (
        <Card key={ann.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">{ann.factureId}</CardTitle>
                <p className="text-xs text-muted-foreground">Patient : {ann.patient} · Agent : {ann.agent} · {ann.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">{fmt(ann.montant)}</span>
                <Badge variant="warning">En attente</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
              <p className="text-muted-foreground">Motif :</p>
              <p className="mt-1 font-medium">{ann.motif}</p>
            </div>
            <Textarea
              placeholder="Commentaire de décision (facultatif)…"
              value={comments[ann.id] ?? ''}
              onChange={(e) => setComments({ ...comments, [ann.id]: e.target.value })}
            />
            <div className="flex gap-3">
              <Button variant="brand" className="flex-1 gap-2 ">
                <CheckCircle2 className="h-4 w-4" /> Approuver
              </Button>
              <Button variant="destructive" className="flex-1 gap-2">
                <XCircle className="h-4 w-4" /> Rejeter
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}

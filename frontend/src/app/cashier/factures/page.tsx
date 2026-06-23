import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';

const today = '2026-06-23';

export default function FacturesListPage() {
  const factures = FACTURES.filter((f) => f.date === today);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Factures du jour</h1>
          <p className="text-sm text-muted-foreground">23 juin 2026 · {factures.length} facture(s)</p>
        </div>
        <Link href="/cashier/factures/nouveau">
          <Button className="gap-2 bg-[#004D40] text-white hover:bg-[#003830]">
            <Plus className="h-4 w-4" /> Nouvelle facture
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {factures.map((f) => (
          <Link key={f.id} href={`/cashier/factures/${f.id}`}>
            <div className="flex items-center justify-between rounded-xl border border-border bg-white p-4 transition hover:border-primary hover:shadow-sm">
              <div>
                <p className="font-semibold">{f.patient}</p>
                <p className="text-xs text-muted-foreground">{f.id} · {f.agent} · {f.lignes.length} ligne(s)</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{fmt(f.net)}</p>
                  {f.assurancePrise > 0 && (
                    <p className="text-xs text-muted-foreground">Assurance: {fmt(f.assurancePrise)}</p>
                  )}
                </div>
                <Badge variant={STATUT_VARIANTS[f.statut]}>{STATUT_LABELS[f.statut]}</Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

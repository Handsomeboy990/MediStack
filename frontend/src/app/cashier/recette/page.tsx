import { FACTURES, fmt } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const today = '2026-06-23';
const myAgent = 'Ahouansou B.';

export default function RecettePage() {
  const myFacs = FACTURES.filter((f) => f.date === today && f.agent === myAgent);
  const encaisse = myFacs.filter((f) => f.statut === 'PAYE').reduce((s, f) => s + f.net, 0);
  const especes = myFacs.filter((f) => f.modePaiement === 'ESPECES').reduce((s, f) => s + f.net, 0);
  const mobile = myFacs.filter((f) => f.modePaiement === 'MOBILE').reduce((s, f) => s + f.net, 0);
  const mixte = myFacs.filter((f) => f.modePaiement === 'MIXTE').reduce((s, f) => s + f.net, 0);

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-primary">{fmt(encaisse)}</h1>
        <p className="text-sm text-muted-foreground">Recette de {myAgent} · 23 juin 2026</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Factures émises</p><p className="mt-1 text-2xl font-bold">{myFacs.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Factures soldées</p><p className="mt-1 text-2xl font-bold text-primary">{myFacs.filter((f) => f.statut === 'PAYE').length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Partielles</p><p className="mt-1 text-2xl font-bold text-amber-600">{myFacs.filter((f) => f.statut === 'PARTIEL').length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Répartition par mode de paiement</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[{ label: 'Espèces', val: especes }, { label: 'Mobile money', val: mobile }, { label: 'Mixte', val: mixte }].map((r) => (
            <div key={r.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{r.label}</span>
                <strong className="text-primary">{fmt(r.val)}</strong>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: encaisse > 0 ? `${Math.round((r.val / encaisse) * 100)}%` : '0%' }} />
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-sm font-semibold">
            <span>Total encaissé</span>
            <strong className="text-primary">{fmt(encaisse)}</strong>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Détail des encaissements</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {myFacs.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <div>
                <p className="font-medium">{f.patient}</p>
                <p className="text-xs text-muted-foreground">{f.id} · {f.modePaiement ?? '-'}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">{fmt(f.verse)}</p>
                <Badge variant={f.statut === 'PAYE' ? 'success' : 'warning'}>{f.statut === 'PAYE' ? 'Soldée' : 'Partielle'}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

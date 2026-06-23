import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FACTURES, MEDECINS, PRESTATIONS, fmt } from '@/lib/mock-data';

const totalRevenu = FACTURES.filter((f) => f.statut === 'PAYE').reduce((s, f) => s + f.net, 0);

// Revenue par spécialité (approximé depuis les prestations des factures)
const specMap: Record<string, number> = {};
FACTURES.filter((f) => f.statut === 'PAYE').forEach((f) => {
  const ratio = f.montantBrut > 0 ? f.net / f.montantBrut : 1;
  f.lignes.forEach((l) => {
    const presta = PRESTATIONS.find((p) => p.libelle === l.libelle);
    const spec = presta?.specialite ?? 'Autre';
    specMap[spec] = (specMap[spec] ?? 0) + l.qte * l.pu * ratio;
  });
});

const bySpec = Object.entries(specMap).sort((a, b) => b[1] - a[1]);

export default function StatsPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-lg font-bold">Statistiques</h1>

      <Tabs defaultValue="revenus" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[480px]">
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="specialites">Spécialités</TabsTrigger>
          <TabsTrigger value="medecins">Médecins</TabsTrigger>
        </TabsList>

        <TabsContent value="revenus">
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Indicateurs clés</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Factures émises</span><strong>{FACTURES.length}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Factures soldées</span><strong>{FACTURES.filter((f) => f.statut === 'PAYE').length}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Partielles</span><strong>{FACTURES.filter((f) => f.statut === 'PARTIEL').length}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Annulées</span><strong>{FACTURES.filter((f) => f.statut === 'ANNULE').length}</strong></div>
                <Separator />
                <div className="flex justify-between text-base font-semibold"><span>Total encaissé</span><strong className="text-primary">{fmt(totalRevenu)}</strong></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Évolution (6 derniers mois)</CardTitle></CardHeader>
              <CardContent>
                {[
                  { mois: 'Jan', val: 3200000 }, { mois: 'Fév', val: 3800000 },
                  { mois: 'Mar', val: 4100000 }, { mois: 'Avr', val: 3600000 },
                  { mois: 'Mai', val: 4500000 }, { mois: 'Juin', val: totalRevenu },
                ].map((m) => {
                  const pct = Math.round((m.val / 5000000) * 100);
                  return (
                    <div key={m.mois} className="mb-2 flex items-center gap-3 text-sm">
                      <span className="w-10 text-muted-foreground">{m.mois}</span>
                      <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-28 text-right font-medium">{fmt(m.val)}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specialites">
          <Card>
            <CardHeader><CardTitle>Revenus par spécialité</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {bySpec.map(([spec, val]) => {
                const pct = totalRevenu > 0 ? Math.round((val / totalRevenu) * 100) : 0;
                return (
                  <div key={spec} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{spec}</span><strong className="text-primary">{fmt(val)} ({pct}%)</strong>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medecins">
          <Card>
            <CardHeader><CardTitle>Médecins actifs</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {MEDECINS.filter((m) => m.actif).map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">Dr {m.prenom} {m.nom}</p>
                    <p className="text-xs text-muted-foreground">{m.specialite}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

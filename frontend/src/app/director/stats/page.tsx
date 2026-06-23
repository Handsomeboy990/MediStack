import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KpiCard } from '@/components/kpi-card';
import { Donut, HBars, LineChart } from '@/components/charts';
import { FACTURES, MEDECINS, PRESTATIONS, fmt } from '@/lib/mock-data';

const payees = FACTURES.filter((f) => f.statut === 'PAYE');
const revenue = payees.reduce((s, f) => s + f.net, 0);

const evolution = [
  { label: 'Jan', value: 3200000 }, { label: 'Fév', value: 3800000 }, { label: 'Mar', value: 4100000 },
  { label: 'Avr', value: 3600000 }, { label: 'Mai', value: 4500000 }, { label: 'Juin', value: revenue },
];

const MODE_LABELS: Record<string, string> = { ESPECES: 'Espèces', MOBILE: 'Mobile money', MIXTE: 'Mixte' };
const parMode = ['ESPECES', 'MOBILE', 'MIXTE'].map((m) => ({
  label: MODE_LABELS[m],
  value: payees.filter((f) => f.modePaiement === m).reduce((s, f) => s + f.net, 0),
}));

// Revenu par spécialité, calculé sur le montant brut des lignes (numérateur et
// échelle cohérents, contrairement à la version précédente brut/net mélangés).
const specMap: Record<string, number> = {};
payees.forEach((f) => {
  f.lignes.forEach((l) => {
    const presta = PRESTATIONS.find((p) => p.libelle === l.libelle);
    const spec = presta?.specialite ?? 'Autre';
    specMap[spec] = (specMap[spec] ?? 0) + l.qte * l.pu;
  });
});
const bySpec = Object.entries(specMap).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

const actifs = MEDECINS.filter((m) => m.actif);
const specCount: Record<string, number> = {};
actifs.forEach((m) => { specCount[m.specialite] = (specCount[m.specialite] ?? 0) + 1; });
const medParSpec = Object.entries(specCount).map(([label, value]) => ({ label, value }));

export default function StatsPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-lg font-bold">Statistiques</h1>

      <Tabs defaultValue="revenus" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[480px]">
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="specialites">Spécialités</TabsTrigger>
          <TabsTrigger value="medecins">Médecins</TabsTrigger>
        </TabsList>

        <TabsContent value="revenus" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Chiffre d’affaires" value={fmt(revenue)} tone="primary" hint="Factures payées" />
            <KpiCard label="Factures payées" value={String(payees.length)} tone="success" />
            <KpiCard label="Partielles" value={String(FACTURES.filter((f) => f.statut === 'PARTIEL').length)} tone="warning" />
            <KpiCard label="Annulées" value={String(FACTURES.filter((f) => f.statut === 'ANNULE').length)} tone="danger" />
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader><CardTitle className="text-sm">Évolution (6 mois)</CardTitle></CardHeader>
              <CardContent><LineChart data={evolution} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Modes de paiement</CardTitle></CardHeader>
              <CardContent><Donut data={parMode} format={fmt} /></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specialites">
          <Card>
            <CardHeader><CardTitle className="text-sm">Revenus par spécialité</CardTitle></CardHeader>
            <CardContent><HBars data={bySpec} format={fmt} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medecins" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-sm">Médecins par spécialité</CardTitle></CardHeader>
              <CardContent><Donut data={medParSpec} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Médecins actifs</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {actifs.map((m) => (
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
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

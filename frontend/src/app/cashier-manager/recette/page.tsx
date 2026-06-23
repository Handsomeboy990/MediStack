import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FACTURES, fmt } from '@/lib/mock-data';

const today = '2026-06-23';
const facs = FACTURES.filter((f) => f.date === today && f.statut === 'PAYE');
const total = facs.reduce((s, f) => s + f.net, 0);
const especes = facs.filter((f) => f.modePaiement === 'ESPECES').reduce((s, f) => s + f.net, 0);
const mobile = facs.filter((f) => f.modePaiement === 'MOBILE').reduce((s, f) => s + f.net, 0);
const mixte = facs.filter((f) => f.modePaiement === 'MIXTE').reduce((s, f) => s + f.net, 0);

const agents = ['Ahouansou B.', 'Codjo M.'];

export default function RecetteManagerPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-primary">{fmt(total)}</h1>
        <p className="text-sm text-muted-foreground">Recette globale — 23 juin 2026</p>
      </div>

      <Tabs defaultValue="globale" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[360px]">
          <TabsTrigger value="globale">Recette globale</TabsTrigger>
          <TabsTrigger value="caissier">Par caissier</TabsTrigger>
        </TabsList>

        <TabsContent value="globale">
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Répartition par mode</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[{ label: 'Espèces', val: especes }, { label: 'Mobile money', val: mobile }, { label: 'Mixte', val: mixte }].map((r) => (
                  <div key={r.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{r.label}</span><strong className="text-primary">{fmt(r.val)}</strong>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-[#004D40]" style={{ width: total > 0 ? `${Math.round((r.val / total) * 100)}%` : '0%' }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Indicateurs</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Factures soldées</span><strong>{facs.length}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Partielles</span><strong>{FACTURES.filter((f) => f.date === today && f.statut === 'PARTIEL').length}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">En attente</span><strong>{FACTURES.filter((f) => f.date === today && f.statut === 'EN_ATTENTE').length}</strong></div>
                <Separator />
                <div className="flex justify-between text-base font-semibold"><span>Total encaissé</span><strong className="text-primary">{fmt(total)}</strong></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="caissier">
          <div className="space-y-3">
            {agents.map((agent) => {
              const agentFacs = facs.filter((f) => f.agent === agent);
              const agentTotal = agentFacs.reduce((s, f) => s + f.net, 0);
              return (
                <Card key={agent}>
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="font-semibold">{agent}</p>
                      <p className="text-xs text-muted-foreground">{agentFacs.length} facture(s) soldée(s)</p>
                    </div>
                    <p className="text-xl font-bold text-primary">{fmt(agentTotal)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

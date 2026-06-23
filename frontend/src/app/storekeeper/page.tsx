import Link from 'next/link';
import { AlertTriangle, ArrowDown, ArrowLeftRight, ArrowUp, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STOCK_ARTICLES, fmt } from '@/lib/mock-data';

const alerts = STOCK_ARTICLES.filter((a) => a.quantite <= a.seuil);
const ruptures = STOCK_ARTICLES.filter((a) => a.quantite === 0);

const navCards = [
  { href: '/storekeeper/entree', label: 'Entrée de stock', desc: 'Enregistrer une réception', icon: ArrowDown },
  { href: '/storekeeper/ajustement', label: 'Ajustement', desc: 'Corriger un écart', icon: RefreshCw },
  { href: '/storekeeper/transferts', label: 'Transferts', desc: 'Vers la pharmacie', icon: ArrowLeftRight },
  { href: '/storekeeper/alertes', label: 'Alertes', desc: `${alerts.length} article(s) en tension`, icon: AlertTriangle },
];

function stockVariant(q: number, s: number) {
  if (q === 0) return 'destructive' as const;
  if (q <= s) return 'warning' as const;
  return 'success' as const;
}

export default function StorekeeperPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Magasin central</h1>
        <p className="text-sm text-muted-foreground">{STOCK_ARTICLES.length} articles · {ruptures.length} rupture(s) · {alerts.length - ruptures.length} sous seuil</p>
      </div>

      {alerts.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">{alerts.length} article(s) en tension</p>
            <p className="text-sm text-amber-700">{alerts.map((a) => a.libelle).join(', ')}</p>
          </div>
          <Link href="/storekeeper/alertes" className="ml-auto text-sm font-medium text-amber-700 hover:underline">Voir →</Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {navCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href}>
              <Card className="h-full cursor-pointer transition hover:border-primary hover:shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">État du stock</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {STOCK_ARTICLES.map((a) => (
            <Link key={a.id} href={`/storekeeper/articles/${a.id}`}>
              <div className="flex items-center justify-between rounded-xl border border-border p-3 transition hover:border-primary hover:bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{a.libelle}</p>
                  <p className="text-xs text-muted-foreground">{a.code} · {a.unite} · {fmt(a.pu)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold">{a.quantite}</p>
                  <Badge variant={stockVariant(a.quantite, a.seuil)}>
                    {a.quantite === 0 ? 'Rupture' : a.quantite <= a.seuil ? 'Seuil' : 'OK'}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const stockItems = [
  { code: 'MED-001', libelle: 'Paracétamol 500 mg', unite: 'boîte', quantite: 48, seuil: 20, prix: 750 },
  { code: 'MED-002', libelle: 'Amoxicilline 250 mg', unite: 'boîte', quantite: 12, seuil: 15, prix: 1800 },
  { code: 'MAT-001', libelle: 'Seringues 5 ml', unite: 'carton', quantite: 5, seuil: 10, prix: 3500 },
  { code: 'MED-003', libelle: 'Metformine 500 mg', unite: 'boîte', quantite: 30, seuil: 10, prix: 2100 },
  { code: 'MAT-002', libelle: 'Gants latex M', unite: 'boîte', quantite: 0, seuil: 5, prix: 4200 },
];

const movements = [
  { date: '23/06 09:14', article: 'Paracétamol 500 mg', type: 'ENTREE', quantite: 50, agent: 'Hodonou F.' },
  { date: '23/06 10:32', article: 'Seringues 5 ml', type: 'SORTIE', quantite: 10, agent: 'Hodonou F.' },
  { date: '23/06 11:05', article: 'Amoxicilline 250 mg', type: 'SORTIE', quantite: 3, agent: 'Hodonou F.' },
];

function stockStatus(quantite: number, seuil: number) {
  if (quantite === 0) return { label: 'Rupture', variant: 'destructive' as const };
  if (quantite <= seuil) return { label: 'Alerte seuil', variant: 'warning' as const };
  return { label: 'Disponible', variant: 'success' as const };
}

export default function StorekeeperPage() {
  const alerts = stockItems.filter((s) => s.quantite <= s.seuil);

  return (
    <main className="space-y-6">
      {/* Alertes actives */}
      {alerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">{alerts.length} article{alerts.length > 1 ? 's' : ''} sous le seuil</p>
              <p className="text-sm text-amber-700">{alerts.map((a) => a.libelle).join(', ')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total articles</p><p className="mt-1 text-2xl font-bold text-primary">{stockItems.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Ruptures</p><p className="mt-1 text-2xl font-bold text-rose-600">{stockItems.filter((s) => s.quantite === 0).length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Sous le seuil</p><p className="mt-1 text-2xl font-bold text-amber-600">{alerts.length}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[520px]">
          <TabsTrigger value="stock">État du stock</TabsTrigger>
          <TabsTrigger value="mouvement">Mouvement</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Magasin central</CardTitle>
              <CardDescription>Quantités en temps réel avec alertes de réapprovisionnement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stockItems.map((item) => {
                const status = stockStatus(item.quantite, item.seuil);
                return (
                  <div key={item.code} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <p className="font-medium">{item.libelle}</p>
                      <p className="text-xs text-muted-foreground">{item.code} · {item.unite} · {item.prix.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold">{item.quantite}</p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mouvement">
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><ArrowDown className="h-5 w-5 text-emerald-600" /><CardTitle>Entrée de stock</CardTitle></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Article (code ou libellé)" />
                <Input placeholder="Quantité reçue" type="number" defaultValue="0" />
                <Input placeholder="Motif / Fournisseur" />
                <Button className="w-full">Enregistrer l&apos;entrée</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><ArrowUp className="h-5 w-5 text-rose-500" /><CardTitle>Sortie / Ajustement</CardTitle></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Article (code ou libellé)" />
                <Input placeholder="Quantité sortie" type="number" defaultValue="0" />
                <Input placeholder="Motif" />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2"><RefreshCw className="h-4 w-4" />Ajustement</Button>
                  <Button variant="destructive" className="flex-1">Sortie</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Journal des mouvements</CardTitle>
              <CardDescription>Historique complet — entrées, sorties, ajustements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {movements.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <p className="font-medium">{m.article}</p>
                    <p className="text-xs text-muted-foreground">{m.date} · {m.agent}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{m.type === 'ENTREE' ? '+' : '-'}{m.quantite}</p>
                    <Badge variant={m.type === 'ENTREE' ? 'success' : 'secondary'}>{m.type}</Badge>
                  </div>
                </div>
              ))}
              <Separator />
              <Button variant="outline" className="w-full">Charger plus de mouvements</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

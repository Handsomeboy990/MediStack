import Link from 'next/link';
import { AlertTriangle, ArrowDown, ArrowLeftRight, ArrowUp, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STOCK_ARTICLES, fmt } from '@/lib/mock-data';

const alerts = STOCK_ARTICLES.filter((a) => a.quantite <= a.seuil);
const ruptures = STOCK_ARTICLES.filter((a) => a.quantite === 0);

const navCards = [
  { href: '/storekeeper/entree', label: 'Entrée de stock', desc: 'Enregistrer une réception', icon: ArrowDown },
  { href: '/storekeeper/ajustement', label: 'Inventaire', desc: 'Corriger un écart', icon: RefreshCw },
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


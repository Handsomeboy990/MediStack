import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STOCK_ARTICLES, fmt } from '@/lib/mock-data';

const alerts = STOCK_ARTICLES.filter((a) => a.quantite <= a.seuil);

export default function AlertesPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-lg font-bold">Alertes de rupture</h1>
        <p className="text-sm text-muted-foreground">{alerts.length} article(s) sous le seuil de réapprovisionnement</p>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Aucune alerte active — tous les articles sont au-dessus du seuil.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => {
            const isRupture = a.quantite === 0;
            return (
              <Card key={a.id} className={isRupture ? 'border-rose-200' : 'border-amber-200'}>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-semibold">{a.libelle}</p>
                    <p className="text-xs text-muted-foreground">{a.code} · {a.unite} · {fmt(a.pu)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Actuel / Seuil</p>
                      <p className={`font-bold ${isRupture ? 'text-rose-600' : 'text-amber-600'}`}>{a.quantite} / {a.seuil}</p>
                    </div>
                    <Badge variant={isRupture ? 'destructive' : 'warning'}>{isRupture ? 'Rupture' : 'Seuil atteint'}</Badge>
                    <Link href="/storekeeper/entree">
                      <Button size="sm" className="bg-[#004D40] text-white hover:bg-[#003830]">Commander</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Articles OK</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {STOCK_ARTICLES.filter((a) => a.quantite > a.seuil).map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <p className="font-medium">{a.libelle}</p>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-primary">{a.quantite} {a.unite}(s)</p>
                <Badge variant="success">OK</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

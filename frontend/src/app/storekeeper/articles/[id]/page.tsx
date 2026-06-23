import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { STOCK_ARTICLES, MOUVEMENTS_STOCK, fmt } from '@/lib/mock-data';

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = STOCK_ARTICLES.find((a) => a.id === params.id) ?? STOCK_ARTICLES[0];
  const mouvements = MOUVEMENTS_STOCK.filter((m) => m.articleId === article.id);

  const isAlert = article.quantite <= article.seuil;
  const isRupture = article.quantite === 0;

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/storekeeper">
          <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Retour</Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">{article.libelle}</h1>
          <p className="text-xs text-muted-foreground">{article.code}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Fiche article</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Catégorie</span><strong>{article.categorie}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Unité</span><strong>{article.unite}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Prix unitaire</span><strong>{fmt(article.pu)}</strong></div>
            <Separator />
            <div className="flex justify-between"><span className="text-muted-foreground">Quantité</span><strong className={isRupture ? 'text-rose-600' : isAlert ? 'text-amber-600' : 'text-primary'}>{article.quantite} {article.unite}(s)</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Seuil alerte</span><strong>{article.seuil}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Statut</span>
              <Badge variant={isRupture ? 'destructive' : isAlert ? 'warning' : 'success'}>
                {isRupture ? 'Rupture' : isAlert ? 'Sous seuil' : 'Disponible'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Historique des mouvements</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {mouvements.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Aucun mouvement enregistré.</p>
            ) : mouvements.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <div>
                  <p className="font-medium">{m.motif}</p>
                  <p className="text-xs text-muted-foreground">{m.date} · {m.agent}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{m.type === 'ENTREE' ? '+' : ''}{m.quantite}</p>
                  <Badge variant={m.type === 'ENTREE' ? 'success' : 'secondary'}>{m.type}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

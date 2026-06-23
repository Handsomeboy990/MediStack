'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Printer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { STOCK_ARTICLES, fmt } from '@/lib/mock-data';
import { printBonCommande } from '@/lib/print';

function stockBadge(q: number, s: number) {
  if (q === 0) return <Badge variant="destructive">Rupture</Badge>;
  if (q <= s) return <Badge variant="warning">Seuil</Badge>;
  return <Badge variant="success">OK</Badge>;
}

const alerts = STOCK_ARTICLES.filter((a) => a.quantite <= a.seuil);
const ruptures = STOCK_ARTICLES.filter((a) => a.quantite === 0);
const valeurStock = STOCK_ARTICLES.reduce((s, a) => s + a.quantite * a.pu, 0);

export default function StorekeeperPage() {
  const router = useRouter();

  const commander = () =>
    printBonCommande(
      alerts.map((a) => ({ code: a.code, libelle: a.libelle, unite: a.unite, qte: Math.max(a.seuil * 2 - a.quantite, a.seuil), pu: a.pu })),
    );

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Magasin central</h1>
          <p className="text-sm text-muted-foreground">État du stock au 23 juin 2026</p>
        </div>
        <Button variant="brand" className="gap-2" onClick={commander} disabled={alerts.length === 0}>
          <Printer className="h-4 w-4" />Bon de commande
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Articles" value={String(STOCK_ARTICLES.length)} tone="neutral" hint="Références au catalogue" />
        <KpiCard label="Ruptures" value={String(ruptures.length)} tone="danger" hint="Quantité nulle" />
        <KpiCard label="Sous seuil" value={String(alerts.length - ruptures.length)} tone="warning" hint="À réapprovisionner" />
        <KpiCard label="Valeur du stock" value={fmt(valeurStock)} tone="primary" hint="Au prix unitaire" />
      </div>

      {alerts.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-sm font-medium text-amber-900">{alerts.length} article(s) en tension</p>
          <Link href="/storekeeper/alertes" className="ml-auto text-sm font-medium text-amber-700 hover:underline">Voir les alertes</Link>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-base">État du stock</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Qté</TableHead>
              <TableHead className="text-right">Seuil</TableHead>
              <TableHead className="text-right">PU</TableHead>
              <TableHead className="text-right">Valeur</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STOCK_ARTICLES.map((a) => (
              <TableRow key={a.id} className="cursor-pointer" onClick={() => router.push(`/storekeeper/articles/${a.id}`)}>
                <TableCell>
                  <p className="font-medium">{a.libelle}</p>
                  <p className="text-xs text-muted-foreground">{a.code} · {a.unite}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">{a.categorie}</TableCell>
                <TableCell className="text-right font-bold">{a.quantite}</TableCell>
                <TableCell className="text-right text-muted-foreground">{a.seuil}</TableCell>
                <TableCell className="text-right text-muted-foreground">{fmt(a.pu)}</TableCell>
                <TableCell className="text-right font-semibold">{fmt(a.quantite * a.pu)}</TableCell>
                <TableCell>{stockBadge(a.quantite, a.seuil)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="text-xs uppercase text-muted-foreground">Valeur totale</TableCell>
              <TableCell className="text-right text-primary">{fmt(valeurStock)}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </main>
  );
}

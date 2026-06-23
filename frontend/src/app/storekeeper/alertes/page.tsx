'use client';

import { Printer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { STOCK_ARTICLES, fmt } from '@/lib/mock-data';
import { printBonCommande } from '@/lib/print';

const alerts = STOCK_ARTICLES.filter((a) => a.quantite <= a.seuil);
const ok = STOCK_ARTICLES.filter((a) => a.quantite > a.seuil);

export default function AlertesPage() {
  const commander = () =>
    printBonCommande(
      alerts.map((a) => ({ code: a.code, libelle: a.libelle, unite: a.unite, qte: Math.max(a.seuil * 2 - a.quantite, a.seuil), pu: a.pu })),
    );

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">Alertes de rupture</h1>
          <p className="text-sm text-muted-foreground">{alerts.length} article(s) sous le seuil</p>
        </div>
        <Button variant="brand" className="gap-2" onClick={commander} disabled={alerts.length === 0}>
          <Printer className="h-4 w-4" />Bon de commande
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-sm">Articles à réapprovisionner</CardTitle></CardHeader>
        {alerts.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucune alerte active.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead className="text-right">Actuel</TableHead>
                <TableHead className="text-right">Seuil</TableHead>
                <TableHead className="text-right">À commander</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a) => {
                const suggere = Math.max(a.seuil * 2 - a.quantite, a.seuil);
                const rupture = a.quantite === 0;
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <p className="font-medium">{a.libelle}</p>
                      <p className="text-xs text-muted-foreground">{a.code} · {a.unite}</p>
                    </TableCell>
                    <TableCell className="text-right font-bold">{a.quantite}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{a.seuil}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{suggere} {a.unite}</TableCell>
                    <TableCell><Badge variant={rupture ? 'destructive' : 'warning'}>{rupture ? 'Rupture' : 'Seuil'}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-sm">Articles au-dessus du seuil</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ok.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.libelle}</TableCell>
                <TableCell className="text-right">{a.quantite} {a.unite}(s)</TableCell>
                <TableCell><Badge variant="success">OK</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}

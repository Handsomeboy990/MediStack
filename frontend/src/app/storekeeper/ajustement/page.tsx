'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { STOCK_ARTICLES, MOUVEMENTS_STOCK } from '@/lib/mock-data';

const historique = MOUVEMENTS_STOCK.filter((m) => m.type === 'AJUSTEMENT');

export default function InventairePage() {
  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-lg font-bold">Inventaire</h1>
        <p className="text-sm text-muted-foreground">Corriger un écart suite à un inventaire physique ou une perte.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader><CardTitle className="text-sm">Saisie d&apos;inventaire</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Article</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Sélectionner un article" /></SelectTrigger>
                <SelectContent>
                  {STOCK_ARTICLES.map((a) => <SelectItem key={a.id} value={a.id}>{a.libelle} · stock actuel : {a.quantite}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Sens</Label>
                <Select defaultValue="PLUS">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLUS">Ajout (+)</SelectItem>
                    <SelectItem value="MINUS">Retrait (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quantité</Label>
                <Input type="number" min={1} placeholder="0" className="no-arrows" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Motif (obligatoire)</Label>
              <Textarea placeholder="Inventaire physique du 23/06/2026, écart constaté." />
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" defaultValue="2026-06-23" />
            </div>
            <Button variant="brand" className="w-full">Valider l&apos;inventaire</Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader><CardTitle className="text-sm">Historique des inventaires</CardTitle></CardHeader>
          {historique.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">Aucun inventaire enregistré.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead className="text-right">Écart</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Motif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historique.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-muted-foreground">{m.date}</TableCell>
                    <TableCell className="font-medium">{m.article}</TableCell>
                    <TableCell className={`text-right font-bold ${m.quantite < 0 ? 'text-rose-600' : ''}`}>{m.quantite > 0 ? `+${m.quantite}` : m.quantite}</TableCell>
                    <TableCell className="text-muted-foreground">{m.agent}</TableCell>
                    <TableCell className="text-muted-foreground">{m.motif}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </main>
  );
}

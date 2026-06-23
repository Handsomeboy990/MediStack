'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { STOCK_ARTICLES } from '@/lib/mock-data';

export default function AjustementPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-lg font-bold">Ajustement de stock</h1>
      <p className="text-sm text-muted-foreground">Corriger un écart suite à un inventaire physique ou une perte.</p>

      <Card className="max-w-xl">
        <CardHeader><CardTitle>Formulaire d&apos;ajustement</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Article</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {STOCK_ARTICLES.map((a) => (
                <option key={a.id} value={a.id}>{a.libelle} · stock actuel : {a.quantite}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="PLUS">Ajustement positif (+)</option>
                <option value="MINUS">Ajustement négatif (−)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Quantité à ajuster</Label>
              <Input type="number" min={1} placeholder="0" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Motif (obligatoire)</Label>
            <Textarea placeholder="Inventaire physique du 23/06/2026 — écart constaté de 5 unités…" />
          </div>

          <div className="space-y-1.5">
            <Label>Date de l&apos;inventaire</Label>
            <Input type="date" defaultValue="2026-06-23" />
          </div>

          <Button className="w-full bg-[#004D40] text-white hover:bg-[#003830]">Valider l&apos;ajustement</Button>
        </CardContent>
      </Card>
    </main>
  );
}

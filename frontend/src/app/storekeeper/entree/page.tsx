'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { STOCK_ARTICLES, MOUVEMENTS_STOCK } from '@/lib/mock-data';

const entrees = MOUVEMENTS_STOCK.filter((m) => m.type === 'ENTREE');

export default function EntreeStockPage() {
  const [article, setArticle] = useState('');
  const [qte, setQte] = useState('');
  const [fournisseur, setFournisseur] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="space-y-6">
      <h1 className="text-lg font-bold">Entrée de stock</h1>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Enregistrer une réception</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                Entrée enregistrée avec succès.
                <button onClick={() => setSubmitted(false)} className="ml-2 underline">Nouvelle entrée</button>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>Article</Label>
                  <Select value={article} onValueChange={setArticle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un article" />
                    </SelectTrigger>
                    <SelectContent>
                      {STOCK_ARTICLES.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.libelle} (stock actuel : {a.quantite})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Quantité reçue</Label>
                  <Input type="number" min={1} placeholder="0" className="no-arrows" value={qte} onChange={(e) => setQte(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Fournisseur / Motif</Label>
                  <Input placeholder="Nom du fournisseur ou motif" value={fournisseur} onChange={(e) => setFournisseur(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Date de réception</Label>
                  <Input type="date" defaultValue="2026-06-23" />
                </div>
                <div className="space-y-1.5">
                  <Label>N° bon de livraison</Label>
                  <Input placeholder="BL-XXXXX" />
                </div>
                <Button
                  variant="brand" className="w-full "
                  onClick={() => setSubmitted(true)}
                  disabled={!article || !qte}
                >
                  Enregistrer l&apos;entrée
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Articles sous seuil</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {STOCK_ARTICLES.filter((a) => a.quantite <= a.seuil).map((a) => (
              <div key={a.id} className="flex justify-between rounded-xl border border-border p-3 text-sm">
                <div>
                  <p className="font-medium">{a.libelle}</p>
                  <p className="text-xs text-muted-foreground">Seuil : {a.seuil} · Actuel : {a.quantite}</p>
                </div>
                <span className="font-semibold text-primary">+{a.seuil * 2 - a.quantite} suggéré</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-sm">Dernières entrées</CardTitle></CardHeader>
        {entrees.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucune entrée enregistrée.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Article</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Motif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrees.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="text-muted-foreground">{m.date}</TableCell>
                  <TableCell className="font-medium">{m.article}</TableCell>
                  <TableCell className="text-right font-bold">+{m.quantite}</TableCell>
                  <TableCell className="text-muted-foreground">{m.agent}</TableCell>
                  <TableCell className="text-muted-foreground">{m.motif}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </main>
  );
}

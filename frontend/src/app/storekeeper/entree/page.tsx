'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STOCK_ARTICLES } from '@/lib/mock-data';

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
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                  >
                    <option value="">Sélectionner un article…</option>
                    {STOCK_ARTICLES.map((a) => (
                      <option key={a.id} value={a.id}>{a.libelle} (stock actuel : {a.quantite})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Quantité reçue</Label>
                  <Input type="number" min={1} placeholder="0" value={qte} onChange={(e) => setQte(e.target.value)} />
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
                  className="w-full bg-[#004D40] text-white hover:bg-[#003830]"
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
                <span className="font-semibold text-amber-600">+{a.seuil * 2 - a.quantite} suggéré</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

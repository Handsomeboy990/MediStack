'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/searchable-select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MAGASINS, STOCK_ARTICLES, MOUVEMENTS_STOCK } from '@/lib/mock-data';

const transferts = MOUVEMENTS_STOCK.filter((m) => m.type === 'TRANSFERT');
const articleOptions = STOCK_ARTICLES.map((a) => ({ value: a.id, label: a.libelle, hint: `${a.quantite} dispo` }));
const destinationOptions = MAGASINS.filter((m) => !m.central).map((m) => ({ value: m.id, label: m.nom, hint: m.type === 'PHARMACIE' ? 'Pharmacie' : 'Magasin' }));

export default function TransfertsPage() {
  const [article, setArticle] = useState('');
  const [destination, setDestination] = useState(destinationOptions[0]?.value ?? '');

  return (
    <main className="space-y-6">
      <h1 className="text-lg font-bold">Sorties et transferts</h1>

      <Tabs defaultValue="nouveau" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[360px]">
          <TabsTrigger value="nouveau">Nouveau transfert</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="nouveau">
          <Card className="max-w-xl">
            <CardHeader><CardTitle>Bon de transfert</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Article</Label>
                <SearchableSelect options={articleOptions} value={article} onChange={setArticle} placeholder="Sélectionner un article" />
              </div>
              <div className="space-y-1.5">
                <Label>Quantité à transférer</Label>
                <Input type="number" min={1} placeholder="0" className="no-arrows" />
              </div>
              <div className="space-y-1.5">
                <Label>Destination</Label>
                <SearchableSelect options={destinationOptions} value={destination} onChange={setDestination} placeholder="Magasin ou pharmacie" />
              </div>
              <div className="space-y-1.5">
                <Label>Responsable destinataire</Label>
                <Input placeholder="Nom du responsable" />
              </div>
              <Separator />
              <Button variant="brand" className="w-full">Valider le transfert</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader><CardTitle className="text-base">Historique des transferts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {transferts.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Aucun transfert enregistré.</p>
              ) : transferts.map((t) => (
                <div key={t.id} className="flex justify-between rounded-xl border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">{t.article}</p>
                    <p className="text-xs text-muted-foreground">{t.date} · {t.agent}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{t.quantite}</p>
                    <Badge variant="secondary">Transféré</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

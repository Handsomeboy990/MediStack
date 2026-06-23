import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STOCK_ARTICLES, MOUVEMENTS_STOCK } from '@/lib/mock-data';

const transferts = MOUVEMENTS_STOCK.filter((m) => m.type === 'TRANSFERT');

export default function TransfertsPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-lg font-bold">Transferts vers la pharmacie</h1>

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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un article" />
                  </SelectTrigger>
                  <SelectContent>
                    {STOCK_ARTICLES.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.libelle} · {a.quantite} disponible(s)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quantité à transférer</Label>
                <Input type="number" min={1} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label>Destination</Label>
                <Input defaultValue="Pharmacie centrale" />
              </div>
              <div className="space-y-1.5">
                <Label>Responsable destinataire</Label>
                <Input placeholder="Nom du pharmacien" />
              </div>
              <Separator />
              <Button variant="brand" className="w-full ">Valider le transfert</Button>
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

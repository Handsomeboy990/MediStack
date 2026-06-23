'use client';

import Link from 'next/link';
import { ArrowLeft, Printer, Receipt } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';
import { printFacture, printTicket } from '@/lib/print';

export default function DetailFacturePage({ params }: { params: { id: string } }) {
  const f = FACTURES.find((fc) => fc.id === params.id) ?? FACTURES[0];
  const resteAPayer = f.net - f.verse;

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/cashier/factures">
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Retour</Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">{f.id}</h1>
            <p className="text-xs text-muted-foreground">{f.patient} · {f.date} · {f.agent}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={STATUT_VARIANTS[f.statut]}>{STATUT_LABELS[f.statut]}</Badge>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => printTicket(f)}><Receipt className="h-4 w-4" />Ticket</Button>
          <Button variant="brand" size="sm" className="gap-2" onClick={() => printFacture(f)}><Printer className="h-4 w-4" />Imprimer la facture</Button>
        </div>
      </div>

      <Tabs defaultValue="detail" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[440px]">
          <TabsTrigger value="detail">Détail</TabsTrigger>
          <TabsTrigger value="paiement">Encaissement</TabsTrigger>
          <TabsTrigger value="annulation">Annulation</TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
            <Card>
              <CardHeader><CardTitle>Lignes de facturation</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {f.lignes.map((l, i) => (
                  <div key={i} className="flex justify-between rounded-xl border border-border p-3 text-sm">
                    <div><p className="font-medium">{l.libelle}</p><p className="text-xs text-muted-foreground">x{l.qte}</p></div>
                    <p className="font-semibold">{fmt(l.qte * l.pu)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="h-fit">
              <CardHeader><CardTitle>Totaux</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Brut</span><strong>{fmt(f.montantBrut)}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Assurance</span><strong className="text-emerald-600">−{fmt(f.assurancePrise)}</strong></div>
                <Separator />
                <div className="flex justify-between"><span className="font-semibold">Net</span><strong className="text-primary">{fmt(f.net)}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Versé</span><strong>{fmt(f.verse)}</strong></div>
                {resteAPayer > 0 && (
                  <div className="flex justify-between text-amber-700"><span className="font-medium">Reste</span><strong>{fmt(resteAPayer)}</strong></div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="paiement">
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Encaissement</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {f.statut === 'PAYE' ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    Facture entièrement payée. Montant versé : <strong>{fmt(f.verse)}</strong>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
                      Reste à payer : <strong>{fmt(resteAPayer)}</strong>
                    </div>
                    <div className="space-y-1.5"><Label>Espèces reçues</Label><Input type="number" placeholder="0" /></div>
                    <div className="space-y-1.5"><Label>Mobile money</Label><Input type="number" placeholder="0" /></div>
                    <div className="space-y-1.5"><Label>Référence mobile</Label><Input placeholder="MM-XXXXX" /></div>
                    <div className="flex gap-3">
                      <Button variant="brand" className="flex-1 ">Encaisser</Button>
                      <Button variant="outline" className="flex-1">Paiement partiel</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Historique</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Agent</span><strong>{f.agent}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><strong>{f.modePaiement ?? '-'}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Statut</span><Badge variant={STATUT_VARIANTS[f.statut]}>{STATUT_LABELS[f.statut]}</Badge></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="annulation">
          <Card>
            <CardHeader><CardTitle>Demande d&apos;annulation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {f.statut === 'ANNULE' ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
                  Cette facture est déjà annulée.
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    La demande sera transmise au responsable de caisse pour validation.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Demander l&apos;annulation</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Demande d&apos;annulation : {f.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Patient : <strong>{f.patient}</strong> · Montant : <strong>{fmt(f.net)}</strong></p>
                        <div className="space-y-1.5">
                          <Label>Motif (obligatoire)</Label>
                          <Textarea placeholder="Décrivez la raison de l'annulation…" className="min-h-[100px]" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Annuler</Button>
                        <Button variant="destructive">Soumettre la demande</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

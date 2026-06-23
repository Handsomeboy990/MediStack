'use client';

import Link from 'next/link';
import { ArrowLeft, Printer, Receipt } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ANNULATIONS, FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';
import { printFacture, printTicket } from '@/lib/print';

const MODE_LABELS: Record<string, string> = { ESPECES: 'Espèces', MOBILE: 'Mobile money', MIXTE: 'Mixte' };

export default function DetailFactureManagerPage({ params }: { params: { id: string } }) {
  const f = FACTURES.find((fc) => fc.id === params.id) ?? FACTURES[0];
  const reste = f.net - f.verse;
  const annulation = ANNULATIONS.find((a) => a.factureId === f.id && a.statut === 'EN_ATTENTE');

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/cashier-manager/factures">
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

      {annulation && (
        <Card className="border-rose-200">
          <CardHeader><CardTitle className="text-sm text-rose-700">Demande d&apos;annulation à traiter</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm"><span className="text-muted-foreground">Motif :</span> {annulation.motif}</p>
            <p className="text-xs text-muted-foreground">Demandée par {annulation.agent} le {annulation.date} · Montant {fmt(annulation.montant)}</p>
            <div className="flex gap-2">
              <Button variant="brand" size="sm">Approuver</Button>
              <Button variant="outline" size="sm" className="border-destructive/40 text-destructive hover:bg-destructive/5">Rejeter</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <Card className="overflow-hidden">
          <CardHeader><CardTitle className="text-sm">Lignes de facturation</CardTitle></CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Désignation</TableHead>
                <TableHead className="text-right">Qté</TableHead>
                <TableHead className="text-right">PU</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {f.lignes.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{l.libelle}</TableCell>
                  <TableCell className="text-right">{l.qte}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{fmt(l.pu)}</TableCell>
                  <TableCell className="text-right font-semibold">{fmt(l.qte * l.pu)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-sm">Totaux</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Brut</span><strong>{fmt(f.montantBrut)}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Assurance</span><strong>-{fmt(f.assurancePrise)}</strong></div>
            <Separator />
            <div className="flex justify-between"><span className="font-semibold">Net</span><strong className="text-primary">{fmt(f.net)}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Versé</span><strong>{fmt(f.verse)}</strong></div>
            {reste > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Reste</span><strong>{fmt(reste)}</strong></div>}
            <Separator />
            <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><strong>{f.modePaiement ? MODE_LABELS[f.modePaiement] ?? f.modePaiement : '-'}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Agent</span><strong>{f.agent}</strong></div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

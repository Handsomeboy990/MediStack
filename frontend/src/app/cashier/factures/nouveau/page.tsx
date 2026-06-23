'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Lock, Plus, Printer, ShieldCheck, Trash2, User, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PRESTATIONS, fmt } from '@/lib/mock-data';
import { usePatients } from '@/lib/patients-store';

type Ligne = { libelle: string; qte: number; pu: number };

export default function NouvelleFacturePage() {
  const patients = usePatients();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '');
  const [carteId, setCarteId] = useState('aucune');
  const [lignes, setLignes] = useState<Ligne[]>([{ libelle: 'Consultation générale', qte: 1, pu: 5000 }]);
  const [newLibelle, setNewLibelle] = useState('');
  const [newQte, setNewQte] = useState(1);
  const [newPu, setNewPu] = useState(0);
  const [prestation, setPrestation] = useState('');
  const [montantRecu, setMontantRecu] = useState('');

  const patient = patients.find((p) => p.id === patientId) ?? patients[0];
  const carte = patient?.cartesAssurance.find((c) => c.id === carteId);
  const taux = carte?.taux ?? 0;
  const brut = lignes.reduce((s, l) => s + l.qte * l.pu, 0);
  const assurance = Math.round((brut * taux) / 100);
  const net = brut - assurance;
  const rendu = Math.max(0, Number(montantRecu || 0) - net);

  const addLigne = () => {
    if (!newLibelle.trim()) return;
    setLignes([...lignes, { libelle: newLibelle, qte: newQte, pu: newPu }]);
    setNewLibelle('');
    setNewQte(1);
    setNewPu(0);
    setPrestation('');
  };

  return (
    <main className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/cashier/factures">
          <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Retour</Button>
        </Link>
        <h1 className="text-lg font-bold">Nouvelle facture</h1>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Colonne gauche : patient */}
        <div className="flex w-full shrink-0 flex-col gap-4 xl:w-72">
          <div className="space-y-1.5">
            <Label>Patient</Label>
            <Select value={patientId} onValueChange={(v) => { setPatientId(v); setCarteId('aucune'); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom} · {p.telephone}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><User className="h-6 w-6 text-primary" /></div>
                <div>
                  <p className="font-semibold leading-tight">{patient?.prenom} {patient?.nom}</p>
                  <p className="text-xs text-muted-foreground">{patient?.id}</p>
                </div>
              </div>
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Actif</span>
            </div>
            <CardContent className="space-y-3 p-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Carte d&apos;assurance</Label>
                <Select value={carteId} onValueChange={setCarteId}>
                  <SelectTrigger><SelectValue placeholder="Aucune assurance" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aucune">Aucune assurance</SelectItem>
                    {patient?.cartesAssurance.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom} · {c.taux}% · {c.numeroMatricule}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-primary" /><span className="text-muted-foreground">Couverture</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${taux}%` }} /></div>
                <p className="mt-1 text-xs font-bold text-primary">{taux}% pris en charge</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne centrale : actes */}
        <Card className="flex min-h-[460px] flex-1 flex-col overflow-hidden">
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border bg-muted/40">
            <CardTitle className="flex items-center gap-2 text-base"><FileText className="h-5 w-5 text-primary" />Détails de la facturation</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="Dr Agossou C.">
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr Agossou C.">Presc. : Dr Agossou C.</SelectItem>
                  <SelectItem value="Dr Bossa I.">Presc. : Dr Bossa I.</SelectItem>
                  <SelectItem value="Dr Capo L.">Presc. : Dr Capo L.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Désignation</TableHead>
                  <TableHead className="text-right">Qté</TableHead>
                  <TableHead className="text-right">PU</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lignes.map((l, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{l.libelle}</TableCell>
                    <TableCell className="text-right">{l.qte}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{fmt(l.pu)}</TableCell>
                    <TableCell className="text-right font-semibold">{fmt(l.qte * l.pu)}</TableCell>
                    <TableCell className="text-right">
                      <button onClick={() => setLignes(lignes.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-xs uppercase text-muted-foreground">Total brut</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell className="text-right text-primary">{fmt(brut)}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="flex gap-2 border-t border-border p-3">
            <Select value={prestation} onValueChange={(v) => { setPrestation(v); const p = PRESTATIONS.find((pr) => pr.libelle === v); if (p) { setNewLibelle(p.libelle); setNewPu(p.tarif); } }}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Ajouter une prestation..." /></SelectTrigger>
              <SelectContent>
                {PRESTATIONS.filter((p) => p.actif).map((p) => <SelectItem key={p.id} value={p.libelle}>{p.libelle} · {fmt(p.tarif)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input className="w-20 no-arrows" type="number" min={1} value={newQte} onChange={(e) => setNewQte(+e.target.value)} placeholder="Qté" />
            <Button size="sm" onClick={addLigne} variant="brand" className="gap-1"><Plus className="h-4 w-4" /></Button>
          </div>
        </Card>

        {/* Colonne droite : caisse */}
        <div className="flex w-full shrink-0 flex-col gap-4 xl:w-72">
          <Card>
            <CardContent className="flex flex-col gap-5 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Résumé de caisse</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Brut</span><strong>{fmt(brut)}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Assurance ({taux}%)</span><strong className="text-emerald-600">-{fmt(assurance)}</strong></div>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-primary/20 bg-primary/5 py-4">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Net à payer</p>
                <p className="text-3xl font-bold text-primary">{fmt(net)}</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase">Montant reçu</Label>
                <Input className="no-arrows text-right text-lg font-medium" type="number" value={montantRecu} onChange={(e) => setMontantRecu(e.target.value)} placeholder="0" />
              </div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Rendu monnaie</span><strong>{fmt(rendu)}</strong></div>
              <Button variant="brand" className="w-full gap-2"><Lock className="h-4 w-4" />Valider et verrouiller</Button>
              <Button variant="outline" className="w-full gap-2"><Printer className="h-4 w-4" />Aperçu ticket</Button>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/5"><XCircle className="h-4 w-4" />Demande d&apos;annulation</Button>
            <Button variant="outline" className="w-full gap-2"><Printer className="h-4 w-4" />Impression facture</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Lock, Plus, Printer, ShieldCheck, Stethoscope, Trash2, User, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/searchable-select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MEDECINS, PRESTATIONS, fmt } from '@/lib/mock-data';
import { printFacture, printTicket, type PrintableFacture } from '@/lib/print';
import { usePatients } from '@/lib/patients-store';

type Ligne = { libelle: string; qte: number; pu: number };

const MODES_PAIEMENT = ['Espèces', 'MTN MoMo', 'Moov Money', 'Celtiis Cash', 'Chèque', 'Virement bancaire'];
const medecinOptions = MEDECINS.map((m) => ({ value: m.id, label: `Dr ${m.prenom} ${m.nom}`, hint: m.specialite }));
const prestationOptions = PRESTATIONS.filter((p) => p.actif).map((p) => ({ value: p.libelle, label: p.libelle, hint: fmt(p.tarif) }));

export default function NouvelleFacturePage() {
  const patients = usePatients();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '');
  const [carteId, setCarteId] = useState('aucune');
  const [prescripteur, setPrescripteur] = useState('M-001');
  const [executant, setExecutant] = useState('M-002');
  const [lignes, setLignes] = useState<Ligne[]>([{ libelle: 'Consultation générale', qte: 1, pu: 5000 }]);
  const [prestation, setPrestation] = useState('');
  const [newQte, setNewQte] = useState(1);
  const [mode, setMode] = useState('Espèces');
  const [montantRecu, setMontantRecu] = useState('');
  const [monnaieRendue, setMonnaieRendue] = useState(true);

  const patient = patients.find((p) => p.id === patientId) ?? patients[0];
  const carte = patient?.cartesAssurance.find((c) => c.id === carteId);
  const taux = carte?.taux ?? 0;
  const brut = lignes.reduce((s, l) => s + l.qte * l.pu, 0);
  const assurance = Math.round((brut * taux) / 100);
  const net = brut - assurance;
  const recu = Number(montantRecu) || 0;
  const rendu = Math.max(0, recu - net);

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.telephone }));
  const carteOptions = [
    { value: 'aucune', label: 'Aucune assurance' },
    ...(patient?.cartesAssurance.map((c) => ({ value: c.id, label: `${c.nom} (${c.taux}%)`, hint: c.numeroMatricule })) ?? []),
  ];

  const addLigne = () => {
    const p = PRESTATIONS.find((pr) => pr.libelle === prestation);
    if (!p) return;
    setLignes([...lignes, { libelle: p.libelle, qte: newQte, pu: p.tarif }]);
    setPrestation('');
    setNewQte(1);
  };

  const draft: PrintableFacture = {
    id: 'BROUILLON',
    patient: patient ? `${patient.prenom} ${patient.nom}` : '-',
    date: '2026-06-23',
    agent: 'Ahouansou B.',
    lignes,
    montantBrut: brut,
    assurancePrise: assurance,
    net,
    verse: Number(montantRecu || 0),
    statut: 'EN_ATTENTE',
    modePaiement: mode,
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
        {/* Colonne gauche : patient + médecins */}
        <div className="flex w-full shrink-0 flex-col gap-4 xl:w-72">
          <div className="space-y-1.5">
            <Label>Patient</Label>
            <SearchableSelect options={patientOptions} value={patientId} onChange={(v) => { setPatientId(v); setCarteId('aucune'); }} placeholder="Rechercher un patient..." />
          </div>

          <Card className="overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted"><User className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="font-semibold leading-tight">{patient?.prenom} {patient?.nom}</p>
                <p className="text-xs text-muted-foreground">{patient?.id}</p>
              </div>
            </div>
            <CardContent className="space-y-3 p-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Carte d&apos;assurance</Label>
                <SearchableSelect options={carteOptions} value={carteId} onChange={setCarteId} placeholder="Aucune assurance" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />Couverture</span>
                <strong className="text-primary">{taux}%</strong>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Stethoscope className="h-4 w-4 text-primary" />Médecins</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Prescripteur</Label>
                <SearchableSelect options={medecinOptions} value={prescripteur} onChange={setPrescripteur} placeholder="Rechercher un médecin..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Exécutant</Label>
                <SearchableSelect options={medecinOptions} value={executant} onChange={setExecutant} placeholder="Rechercher un médecin..." />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne centrale : actes */}
        <Card className="flex min-h-[460px] flex-1 flex-col overflow-hidden">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-base"><FileText className="h-5 w-5 text-primary" />Détails de la facturation</CardTitle>
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
            <SearchableSelect className="flex-1" options={prestationOptions} value={prestation} onChange={setPrestation} placeholder="Rechercher une prestation..." />
            <Input className="w-20 no-arrows" type="number" min={1} value={newQte} onChange={(e) => setNewQte(+e.target.value)} placeholder="Qté" />
            <Button size="sm" onClick={addLigne} variant="brand" className="gap-1"><Plus className="h-4 w-4" /></Button>
          </div>
        </Card>

        {/* Colonne droite : caisse */}
        <div className="flex w-full shrink-0 flex-col gap-4 xl:w-72">
          <Card>
            <CardContent className="flex flex-col gap-4 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Résumé de caisse</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Brut</span><strong>{fmt(brut)}</strong></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Assurance ({taux}%)</span><strong className="text-emerald-600">-{fmt(assurance)}</strong></div>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border bg-muted/40 py-4">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Net à payer</p>
                <p className="text-3xl font-bold text-primary">{fmt(net)}</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase">Mode de paiement</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {MODES_PAIEMENT.map((m) => (
                    <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase">Montant reçu</Label>
                <Input className="no-arrows text-right text-lg font-medium" type="number" value={montantRecu} onChange={(e) => setMontantRecu(e.target.value)} placeholder="0" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rendu monnaie</span>
                <strong className={rendu > 0 ? 'text-primary' : ''}>{fmt(rendu)}</strong>
              </div>
              {rendu > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm">
                  <span className="text-muted-foreground">Monnaie rendue ?</span>
                  <div className="flex gap-1.5">
                    {[true, false].map((v) => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => setMonnaieRendue(v)}
                        className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${monnaieRendue === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}
                      >
                        {v ? 'Oui' : 'Non'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="brand" className="w-full gap-2"><Lock className="h-4 w-4" />Valider et verrouiller</Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => printTicket(draft, rendu, monnaieRendue)}><Printer className="h-4 w-4" />Aperçu ticket</Button>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/5"><XCircle className="h-4 w-4" />Demande d&apos;annulation</Button>
            <Button variant="outline" className="w-full gap-2" onClick={() => printFacture(draft)}><Printer className="h-4 w-4" />Impression facture</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

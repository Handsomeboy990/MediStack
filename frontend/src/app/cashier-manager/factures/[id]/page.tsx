'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PencilLine, Plus, Printer, Receipt, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { ANNULATIONS, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';
import { updateFacture, useFactures } from '@/lib/factures-store';
import { printFacture, printTicket } from '@/lib/print';

const buildQrUrl = (id: string, patient: string, net: number) => {
  const payload = `MediTrace|Facture:${id}|Patient:${patient}|Net:${net}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(payload)}&color=55bab3&format=png`;
};

const MODE_LABELS: Record<string, string> = { ESPECES: 'Espèces', MOBILE: 'Mobile money', MIXTE: 'Mixte' };
const EXAMEN_PACKS = [
  { libelle: 'NFS (Numération formule sanguine)', pu: 4500 },
  { libelle: 'Bilan glycémique complet', pu: 3500 },
  { libelle: 'CRP quantitative', pu: 4000 },
  { libelle: 'ECBU', pu: 5000 },
];

export default function DetailFactureManagerPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const factures = useFactures();
  const f = factures.find((fc) => fc.id === params.id);
  const [diagnostic, setDiagnostic] = useState('');
  const [observations, setObservations] = useState('');
  const [medecinTraitant, setMedecinTraitant] = useState('Dr Agossou Christophe');
  const [hospitalisationType, setHospitalisationType] = useState<'AUCUNE' | 'JOUR' | 'COMPLETE'>('AUCUNE');
  const [serviceHosp, setServiceHosp] = useState('Médecine générale');
  const [joursHosp, setJoursHosp] = useState(1);
  const [chambre, setChambre] = useState('A12');
  const [caution, setCaution] = useState('0');
  const [newLibelle, setNewLibelle] = useState('');
  const [newQte, setNewQte] = useState(1);
  const [newPu, setNewPu] = useState('0');
  const [editableLignes, setEditableLignes] = useState(f?.lignes ?? []);

  useEffect(() => {
    if (!f) return;
    setEditableLignes(f.lignes);
  }, [f]);

  if (!f) {
    return (
      <main className="space-y-4">
        <p className="rounded-xl border border-border p-4 text-sm text-muted-foreground">Facture introuvable.</p>
        <Link href="/cashier-manager/factures">
          <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Retour</Button>
        </Link>
      </main>
    );
  }

  const qrUrl = buildQrUrl(f.id, f.patient, f.net);

  const brutEdited = editableLignes.reduce((sum, l) => sum + l.qte * l.pu, 0);
  const assuranceRatio = f.montantBrut > 0 ? f.assurancePrise / f.montantBrut : 0;
  const assuranceEdited = Math.round(brutEdited * assuranceRatio);
  const netEdited = Math.max(0, brutEdited - assuranceEdited);
  const reste = Math.max(0, netEdited - f.verse);
  const annulation = ANNULATIONS.find((a) => a.factureId === f.id && a.statut === 'EN_ATTENTE');

  const addExamenPack = (libelle: string, pu: number) => {
    setEditableLignes((prev) => [...prev, { libelle, qte: 1, pu }]);
  };

  const addHospitalisation = () => {
    if (hospitalisationType === 'AUCUNE') return;
    const label = hospitalisationType === 'JOUR'
      ? `Hospitalisation de jour (${serviceHosp})`
      : `Hospitalisation complète ${joursHosp}j (${serviceHosp}) - Chambre ${chambre}`;
    const pu = hospitalisationType === 'JOUR' ? 18000 : 35000;
    setEditableLignes((prev) => [...prev, { libelle: label, qte: Math.max(1, joursHosp), pu }]);
  };

  const addCustomLine = () => {
    const pu = Number(newPu) || 0;
    if (!newLibelle.trim() || pu <= 0 || newQte <= 0) return;
    setEditableLignes((prev) => [...prev, { libelle: newLibelle.trim(), qte: newQte, pu }]);
    setNewLibelle('');
    setNewQte(1);
    setNewPu('0');
  };

  const applyFormChanges = () => {
    updateFacture(
      f.id,
      {
        lignes: editableLignes,
        montantBrut: brutEdited,
        assurancePrise: assuranceEdited,
        net: netEdited,
      },
      'Resp. de caisse',
    );
    toast({ title: 'Enregistré', description: `La facture ${f.id} a été mise à jour.` });
  };

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

      <div className="flex items-center justify-end">
        <div className="rounded-xl border border-border bg-white p-2">
          <img src={qrUrl} alt="QR code facture" className="h-20 w-20 rounded-md object-cover" />
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
              {editableLignes.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{l.libelle}</TableCell>
                  <TableCell className="text-right">{l.qte}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{fmt(l.pu)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    <div className="flex items-center justify-end gap-2">
                      <span>{fmt(l.qte * l.pu)}</span>
                      <button
                        type="button"
                        onClick={() => setEditableLignes((prev) => prev.filter((_, idx) => idx !== i))}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Supprimer ligne"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-3 border-t border-border p-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Ajout rapide examens</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {EXAMEN_PACKS.map((ex) => (
                  <Button key={ex.libelle} variant="outline" size="sm" className="gap-1" onClick={() => addExamenPack(ex.libelle, ex.pu)}>
                    <Plus className="h-3.5 w-3.5" /> {ex.libelle}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[1fr_90px_120px_auto]">
              <Input value={newLibelle} onChange={(e) => setNewLibelle(e.target.value)} placeholder="Ajouter une ligne personnalisée..." />
              <Input type="number" min={1} value={newQte} onChange={(e) => setNewQte(Math.max(1, Number(e.target.value) || 1))} />
              <Input type="number" min={0} value={newPu} onChange={(e) => setNewPu(e.target.value)} />
              <Button variant="brand" className="gap-1" onClick={addCustomLine}><Plus className="h-4 w-4" />Ajouter</Button>
            </div>
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-sm">Totaux</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Brut</span><strong>{fmt(brutEdited)}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Assurance</span><strong>-{fmt(assuranceEdited)}</strong></div>
            <Separator />
            <div className="flex justify-between"><span className="font-semibold">Net</span><strong className="text-primary">{fmt(netEdited)}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Versé</span><strong>{fmt(f.verse)}</strong></div>
            {reste > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Reste</span><strong>{fmt(reste)}</strong></div>}
            <Separator />
            <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><strong>{f.modePaiement ? MODE_LABELS[f.modePaiement] ?? f.modePaiement : '-'}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Agent</span><strong>{f.agent}</strong></div>
            <div className="pt-2">
              <Button className="w-full gap-2" variant="brand" onClick={applyFormChanges}>
                <PencilLine className="h-4 w-4" /> Enregistrer les modifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Formulaire de modification clinique</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Médecin traitant</Label>
              <Input value={medecinTraitant} onChange={(e) => setMedecinTraitant(e.target.value)} placeholder="Dr ..." />
            </div>
            <div className="space-y-1.5">
              <Label>Diagnostic</Label>
              <Textarea value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)} placeholder="Diagnostic principal..." className="min-h-[90px]" />
            </div>
            <div className="space-y-1.5">
              <Label>Observations</Label>
              <Textarea value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Observations cliniques et administratives..." className="min-h-[90px]" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Hospitalisation</Label>
              <select
                value={hospitalisationType}
                onChange={(e) => setHospitalisationType(e.target.value as 'AUCUNE' | 'JOUR' | 'COMPLETE')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="AUCUNE">Aucune</option>
                <option value="JOUR">Hospitalisation de jour</option>
                <option value="COMPLETE">Hospitalisation complète</option>
              </select>
            </div>

            {hospitalisationType !== 'AUCUNE' && (
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Service</Label>
                  <Input value={serviceHosp} onChange={(e) => setServiceHosp(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Jours</Label>
                  <Input type="number" min={1} value={joursHosp} onChange={(e) => setJoursHosp(Math.max(1, Number(e.target.value) || 1))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Chambre</Label>
                  <Input value={chambre} onChange={(e) => setChambre(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Caution</Label>
                  <Input type="number" min={0} value={caution} onChange={(e) => setCaution(e.target.value)} />
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={addHospitalisation}>Ajouter hospitalisation à la facture</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

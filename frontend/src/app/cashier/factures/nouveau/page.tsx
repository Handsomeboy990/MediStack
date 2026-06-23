'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PATIENTS, PRESTATIONS, fmt } from '@/lib/mock-data';

type Ligne = { libelle: string; qte: number; pu: number };

export default function NouvelleFacturePage() {
  const [patientId, setPatientId] = useState('PAT-001');
  const [lignes, setLignes] = useState<Ligne[]>([
    { libelle: 'Consultation générale', qte: 1, pu: 5000 },
  ]);
  const [newLibelle, setNewLibelle] = useState('');
  const [newQte, setNewQte] = useState(1);
  const [newPu, setNewPu] = useState(0);
  const [selectedPrestationValue, setSelectedPrestationValue] = useState('');

  const patient = PATIENTS.find((p) => p.id === patientId) ?? PATIENTS[0];
  const total = lignes.reduce((s, l) => s + l.qte * l.pu, 0);
  const assurance = Math.round((total * patient.tauxCouverture) / 100);
  const net = total - assurance;

  const addLigne = () => {
    if (newLibelle.trim()) {
      setLignes([...lignes, { libelle: newLibelle, qte: newQte, pu: newPu }]);
      setNewLibelle('');
      setNewQte(1);
      setNewPu(0);
      setSelectedPrestationValue('');
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/cashier/factures">
          <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Retour</Button>
        </Link>
        <h1 className="text-lg font-bold">Nouvelle facture</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Patient</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Sélectionner un patient</Label>
                <Select value={patientId} onValueChange={setPatientId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PATIENTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom} · {p.telephone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {patient.assurance && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <span>Assuré :</span>
                  <Badge variant="success">{patient.assurance}</Badge>
                  <span>· {patient.tauxCouverture}% pris en charge</span>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Médecin prescripteur</Label>
                  <Select defaultValue="Dr Agossou C.">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr Agossou C.">Dr Agossou C.</SelectItem>
                      <SelectItem value="Dr Bossa I.">Dr Bossa I.</SelectItem>
                      <SelectItem value="Dr Capo L.">Dr Capo L.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Médecin exécutant</Label>
                  <Select defaultValue="Dr Bossa I.">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr Bossa I.">Dr Bossa I.</SelectItem>
                      <SelectItem value="Dr Agossou C.">Dr Agossou C.</SelectItem>
                      <SelectItem value="Dr Capo L.">Dr Capo L.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Lignes de facturation</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {lignes.map((l, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="font-medium">{l.libelle}</p>
                    <p className="text-xs text-muted-foreground">x{l.qte} · {fmt(l.pu)} l&apos;unité</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-primary">{fmt(l.qte * l.pu)}</p>
                    <button onClick={() => setLignes(lignes.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex gap-2 rounded-xl border border-dashed border-border p-3">
                <Select value={selectedPrestationValue} onValueChange={(value) => {
                  setSelectedPrestationValue(value);
                  const p = PRESTATIONS.find((pr) => pr.libelle === value);
                  if (p) { setNewLibelle(p.libelle); setNewPu(p.tarif); }
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choisir une prestation..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESTATIONS.filter((p) => p.actif).map((p) => (
                      <SelectItem key={p.id} value={p.libelle}>{p.libelle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input className="w-20" type="number" min={1} value={newQte} onChange={(e) => setNewQte(+e.target.value)} placeholder="Qté" />
                <Button size="sm" onClick={addLigne} variant="brand" className="gap-1 ">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>Résumé</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total brut</span><strong>{fmt(total)}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Assurance ({patient.tauxCouverture}%)</span><strong className="text-emerald-600">−{fmt(assurance)}</strong></div>
              <Separator />
              <div className="flex justify-between text-base"><span className="font-semibold">Net à payer</span><strong className="text-primary">{fmt(net)}</strong></div>
            </div>
            <Button variant="brand" className="w-full ">Valider la facture</Button>
            <Button variant="outline" className="w-full">Enregistrer en brouillon</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

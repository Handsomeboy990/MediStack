'use client';

import { useState, type ReactNode } from 'react';
import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InsuranceCardsField } from '@/components/insurance-cards-field';
import { isNpiValide, lookupNpi, type CarteAssurance } from '@/lib/mock-data';
import { addPatient, nextPatientId } from '@/lib/patients-store';

const ANNEE_COURANTE = new Date().getFullYear();
const EMPTY = { nom: '', prenom: '', dateNaissance: '', age: '', telephone: '', adresse: '', urgenceNom: '', urgenceTel: '' };

type Props = { trigger?: ReactNode; onCreated?: (id: string) => void };

export function NewPatientDialog({ trigger, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [nationalite, setNationalite] = useState<'BENINOIS' | 'ETRANGER'>('BENINOIS');
  const [npi, setNpi] = useState('');
  const [npiError, setNpiError] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [cards, setCards] = useState<CarteAssurance[]>([]);
  const set = (key: keyof typeof EMPTY, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const beninois = nationalite === 'BENINOIS';
  const idLocked = beninois; // Nom, prénom et date de naissance proviennent de l'ANIP.

  const recupererNpi = () => {
    if (!isNpiValide(npi)) { setNpiError('Entrez un NPI valide (exactement 10 chiffres).'); return; }
    const rec = lookupNpi(npi);
    if (!rec) { setNpiError('NPI introuvable dans la base ANIP.'); return; }
    setNpiError('');
    setForm((f) => ({ ...f, nom: rec.nom, prenom: rec.prenom, dateNaissance: rec.dateNaissance, adresse: rec.adresse }));
  };

  const reset = () => { setForm(EMPTY); setCards([]); setNpi(''); setNpiError(''); setNationalite('BENINOIS'); };

  const save = () => {
    if (!form.nom.trim() || !form.prenom.trim()) return;
    const dateNaissance = form.dateNaissance || (form.age ? `${ANNEE_COURANTE - Number(form.age)}-01-01` : '');
    const id = nextPatientId();
    addPatient({
      id,
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      dateNaissance,
      telephone: form.telephone.trim(),
      adresse: form.adresse.trim(),
      urgenceNom: form.urgenceNom.trim(),
      urgenceTel: form.urgenceTel.trim(),
      cartesAssurance: cards,
      nationalite,
      npi: beninois ? npi.trim() : undefined,
    });
    reset();
    setOpen(false);
    onCreated?.(id);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="brand" className="gap-2"><Plus className="h-4 w-4" /> Nouveau patient</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader><DialogTitle>Créer un patient</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {(['BENINOIS', 'ETRANGER'] as const).map((n) => (
              <button key={n} type="button" onClick={() => setNationalite(n)} className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${nationalite === n ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                {n === 'BENINOIS' ? 'Béninois' : 'Étranger'}
              </button>
            ))}
          </div>

          {beninois && (
            <div className="space-y-1.5">
              <Label>NPI</Label>
              <div className="flex gap-2">
                <Input placeholder="10 chiffres" inputMode="numeric" maxLength={10} value={npi} onChange={(e) => setNpi(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                <Button type="button" variant="outline" className="gap-1 shrink-0" onClick={recupererNpi}><Search className="h-4 w-4" />Récupérer</Button>
              </div>
              {npiError && <p className="text-xs text-destructive">{npiError}</p>}
              <p className="text-xs text-muted-foreground">Les données d&apos;identité sont récupérées auprès de l&apos;ANIP.</p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Nom</Label><Input placeholder="Kone" value={form.nom} onChange={(e) => set('nom', e.target.value)} disabled={idLocked} /></div>
            <div className="space-y-1.5"><Label>Prénom</Label><Input placeholder="Amina" value={form.prenom} onChange={(e) => set('prenom', e.target.value)} disabled={idLocked} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Date de naissance</Label><Input type="date" value={form.dateNaissance} onChange={(e) => set('dateNaissance', e.target.value)} disabled={idLocked} /></div>
            {!beninois && (
              <div className="space-y-1.5">
                <Label>Âge (si date inconnue)</Label>
                <Input type="number" min={0} max={120} placeholder="42" value={form.age} onChange={(e) => set('age', e.target.value)} disabled={!!form.dateNaissance} />
              </div>
            )}
          </div>
          <div className="space-y-1.5"><Label>Téléphone</Label><Input placeholder="01 97 00 11 22" value={form.telephone} onChange={(e) => set('telephone', e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Adresse</Label><Input placeholder="Cotonou, Zongo" value={form.adresse} onChange={(e) => set('adresse', e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Contact urgence (nom)</Label><Input placeholder="Kone Ibrahim" value={form.urgenceNom} onChange={(e) => set('urgenceNom', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Contact urgence (téléphone)</Label><Input placeholder="01 96 22 33 44" value={form.urgenceTel} onChange={(e) => set('urgenceTel', e.target.value)} /></div>
          </div>
          <InsuranceCardsField cards={cards} onChange={setCards} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="brand" onClick={save}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InsuranceCardsField } from '@/components/insurance-cards-field';
import { type CarteAssurance } from '@/lib/mock-data';
import { addPatient, nextPatientId } from '@/lib/patients-store';

const ANNEE_COURANTE = new Date().getFullYear();
const EMPTY = { nom: '', prenom: '', dateNaissance: '', age: '', telephone: '', adresse: '', urgenceNom: '', urgenceTel: '' };

export function NewPatientDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [cards, setCards] = useState<CarteAssurance[]>([]);
  const set = (key: keyof typeof EMPTY, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const save = () => {
    if (!form.nom.trim() || !form.prenom.trim()) return;
    // Si la date de naissance est inconnue, on déduit l'année à partir de l'âge.
    const dateNaissance =
      form.dateNaissance || (form.age ? `${ANNEE_COURANTE - Number(form.age)}-01-01` : '');
    addPatient({
      id: nextPatientId(),
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      dateNaissance,
      telephone: form.telephone.trim(),
      adresse: form.adresse.trim(),
      urgenceNom: form.urgenceNom.trim(),
      urgenceTel: form.urgenceTel.trim(),
      cartesAssurance: cards,
    });
    setForm(EMPTY);
    setCards([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="brand" className="gap-2">
          <Plus className="h-4 w-4" /> Nouveau patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Créer un patient</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Nom</Label><Input placeholder="Kone" value={form.nom} onChange={(e) => set('nom', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Prénom</Label><Input placeholder="Amina" value={form.prenom} onChange={(e) => set('prenom', e.target.value)} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Date de naissance</Label><Input type="date" value={form.dateNaissance} onChange={(e) => set('dateNaissance', e.target.value)} /></div>
            <div className="space-y-1.5">
              <Label>Âge (si date inconnue)</Label>
              <Input type="number" min={0} max={120} placeholder="42" value={form.age} onChange={(e) => set('age', e.target.value)} disabled={!!form.dateNaissance} />
            </div>
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

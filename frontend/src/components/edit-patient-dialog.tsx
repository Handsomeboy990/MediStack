'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Patient } from '@/lib/mock-data';
import { updatePatient } from '@/lib/patients-store';

// Modification des informations d'un patient. L'identité (nom, prénom, date de
// naissance) d'un Béninois provient de l'ANIP : elle reste verrouillée.
export function EditPatientDialog({ patient }: { patient: Patient }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nom: patient.nom,
    prenom: patient.prenom,
    telephone: patient.telephone,
    adresse: patient.adresse,
    urgenceNom: patient.urgenceNom,
    urgenceTel: patient.urgenceTel,
  });
  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const idLocked = patient.nationalite === 'BENINOIS';

  const save = () => {
    updatePatient(patient.id, {
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      telephone: form.telephone.trim(),
      adresse: form.adresse.trim(),
      urgenceNom: form.urgenceNom.trim(),
      urgenceTel: form.urgenceTel.trim(),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-3.5 w-3.5" />Modifier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Modifier : {patient.prenom} {patient.nom}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Nom</Label><Input value={form.nom} onChange={(e) => set('nom', e.target.value)} disabled={idLocked} /></div>
            <div className="space-y-1.5"><Label>Prénom</Label><Input value={form.prenom} onChange={(e) => set('prenom', e.target.value)} disabled={idLocked} /></div>
          </div>
          <div className="space-y-1.5"><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => set('telephone', e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Adresse</Label><Input value={form.adresse} onChange={(e) => set('adresse', e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Contact urgence (nom)</Label><Input value={form.urgenceNom} onChange={(e) => set('urgenceNom', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Contact urgence (téléphone)</Label><Input value={form.urgenceTel} onChange={(e) => set('urgenceTel', e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="brand" onClick={save}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

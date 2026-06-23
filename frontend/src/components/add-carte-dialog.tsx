'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InsuranceCardsField } from '@/components/insurance-cards-field';
import { type CarteAssurance } from '@/lib/mock-data';
import { addCarteAssurance } from '@/lib/patients-store';

// Ajoute une ou plusieurs cartes d'assurance à un patient déjà enregistré.
export function AddCarteDialog({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<CarteAssurance[]>([]);

  const save = () => {
    cards.forEach((c) => addCarteAssurance(patientId, c));
    setCards([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Ajouter une carte
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ajouter une assurance</DialogTitle>
        </DialogHeader>
        <InsuranceCardsField cards={cards} onChange={setCards} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="brand" onClick={save} disabled={cards.length === 0}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

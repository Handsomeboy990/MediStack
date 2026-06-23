'use client';

import { useState } from 'react';
import { Plus, ShieldCheck, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ASSURANCES, type CarteAssurance } from '@/lib/mock-data';

type Props = { cards: CarteAssurance[]; onChange: (cards: CarteAssurance[]) => void };

const EMPTY = { nom: '', societe: '', numeroPolice: '', numeroMatricule: '', taux: '', dateExpiration: '' };

// Gestion multi-cartes d'assurance d'un patient. Le nom de l'assurance est un
// champ libre (avec suggestions) : l'agent de caisse peut saisir une assurance
// absente de la base, elle sera enregistrée avec le patient.
export function InsuranceCardsField({ cards, onChange }: Props) {
  const [draft, setDraft] = useState(EMPTY);
  const set = (key: keyof typeof EMPTY, value: string) => setDraft((d) => ({ ...d, [key]: value }));

  const add = () => {
    if (!draft.nom.trim()) return;
    const connue = ASSURANCES.find(
      (a) => a.code.toLowerCase() === draft.nom.trim().toLowerCase() || a.nom.toLowerCase() === draft.nom.trim().toLowerCase(),
    );
    onChange([
      ...cards,
      {
        id: `CA-${Date.now()}`,
        nom: draft.nom.trim(),
        societe: draft.societe.trim() || connue?.nom || '',
        numeroPolice: draft.numeroPolice.trim(),
        numeroMatricule: draft.numeroMatricule.trim(),
        dateExpiration: draft.dateExpiration,
        taux: Number(draft.taux) || connue?.taux || 0,
      },
    ]);
    setDraft(EMPTY);
  };

  return (
    <div className="space-y-3">
      <Label>Cartes d&apos;assurance</Label>

      {cards.length > 0 && (
        <div className="space-y-2">
          {cards.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">{c.nom} · {c.taux}%</p>
                  <p className="text-xs text-muted-foreground">
                    {c.numeroMatricule || 'Sans matricule'}
                    {c.dateExpiration ? ` · exp. ${c.dateExpiration}` : ''}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => onChange(cards.filter((x) => x.id !== c.id))} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
        <datalist id="assurances-connues">
          {ASSURANCES.map((a) => <option key={a.id} value={a.code}>{a.nom}</option>)}
        </datalist>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input list="assurances-connues" placeholder="Nom (ex. CNSS)" value={draft.nom} onChange={(e) => set('nom', e.target.value)} />
          <Input placeholder="Société / organisme" value={draft.societe} onChange={(e) => set('societe', e.target.value)} />
          <Input placeholder="Numéro de police" value={draft.numeroPolice} onChange={(e) => set('numeroPolice', e.target.value)} />
          <Input placeholder="Numéro matricule" value={draft.numeroMatricule} onChange={(e) => set('numeroMatricule', e.target.value)} />
          <Input type="number" min={0} max={100} placeholder="Taux (%)" value={draft.taux} onChange={(e) => set('taux', e.target.value)} />
          <Input type="date" placeholder="Date d'expiration" value={draft.dateExpiration} onChange={(e) => set('dateExpiration', e.target.value)} />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={add} disabled={!draft.nom.trim()} className="gap-1">
          <Plus className="h-4 w-4" /> Ajouter la carte
        </Button>
      </div>
    </div>
  );
}

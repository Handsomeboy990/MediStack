'use client';

import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelectField } from '@/components/searchable-select';
import { PRESTATIONS, SPECIALITES } from '@/lib/mock-data';

const specialiteOptions = SPECIALITES.map((s) => ({ value: s, label: s }));
const statutOptions = [
  { value: 'actif', label: 'Actif' },
  { value: 'inactif', label: 'Inactif' },
];

export default function PrestationsPage() {
  const [search, setSearch] = useState('');
  const filtered = PRESTATIONS.filter((p) =>
    p.libelle.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-bold">Gestion des prestations</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="brand" className="gap-2 ">
              <Plus className="h-4 w-4" /> Nouvelle prestation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajouter une prestation</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Code</Label><Input placeholder="CONS-XXX" /></div>
                <div className="space-y-1.5"><Label>Tarif (FCFA)</Label><Input type="number" placeholder="5000" /></div>
              </div>
              <div className="space-y-1.5"><Label>Libellé</Label><Input placeholder="Consultation générale" /></div>
              <div className="space-y-1.5">
                <Label>Spécialité</Label>
                <SearchableSelectField options={specialiteOptions} placeholder="Sélectionner une spécialité" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button variant="brand" className="">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input placeholder="Rechercher…" className="max-w-sm" value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card>
        <CardHeader><CardTitle className="text-base">{filtered.length} prestation(s)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold">{p.libelle}</p>
                <p className="text-xs text-muted-foreground">{p.code} · {p.specialite}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-primary">{p.tarif.toLocaleString('fr-FR')} FCFA</p>
                <Badge variant={p.actif ? 'success' : 'secondary'}>{p.actif ? 'Actif' : 'Inactif'}</Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-3.5 w-3.5" />Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Modifier : {p.libelle}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5"><Label>Code</Label><Input defaultValue={p.code} /></div>
                        <div className="space-y-1.5"><Label>Tarif</Label><Input type="number" defaultValue={p.tarif} /></div>
                      </div>
                      <div className="space-y-1.5"><Label>Libellé</Label><Input defaultValue={p.libelle} /></div>
                      <div className="space-y-1.5">
                        <Label>Spécialité</Label>
                        <SearchableSelectField options={specialiteOptions} defaultValue={p.specialite} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Statut</Label>
                        <SearchableSelectField options={statutOptions} defaultValue={p.actif ? 'actif' : 'inactif'} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button variant="brand" className="">Enregistrer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

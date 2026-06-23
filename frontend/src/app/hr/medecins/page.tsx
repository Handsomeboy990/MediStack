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
import { MEDECINS, SPECIALITES } from '@/lib/mock-data';

const specialiteOptions = SPECIALITES.map((s) => ({ value: s, label: s }));
const statutOptions = [
  { value: 'actif', label: 'Actif' },
  { value: 'inactif', label: 'Inactif' },
];

export default function MedecinsPage() {
  const [search, setSearch] = useState('');
  const filtered = MEDECINS.filter(
    (m) =>
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.prenom.toLowerCase().includes(search.toLowerCase()) ||
      m.specialite.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-bold">Liste des médecins</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="brand" className="gap-2 ">
              <Plus className="h-4 w-4" /> Ajouter un médecin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajouter un médecin</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Nom</Label><Input placeholder="Agossou" /></div>
                <div className="space-y-1.5"><Label>Prénom</Label><Input placeholder="Christophe" /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Spécialité</Label>
                <SearchableSelectField options={specialiteOptions} placeholder="Sélectionner une spécialité" />
              </div>
              <div className="space-y-1.5"><Label>Téléphone</Label><Input placeholder="97 XX XX XX" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="medecin@clinicflow.bj" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button variant="brand" className="">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input placeholder="Rechercher par nom ou spécialité…" className="max-w-sm" value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card>
        <CardHeader><CardTitle className="text-base">{filtered.length} médecin(s)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold">Dr {m.prenom} {m.nom}</p>
                <p className="text-xs text-muted-foreground">{m.specialite} · {m.telephone} · {m.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={m.actif ? 'success' : 'secondary'}>{m.actif ? 'Actif' : 'Inactif'}</Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-3.5 w-3.5" />Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Modifier : Dr {m.prenom} {m.nom}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5"><Label>Nom</Label><Input defaultValue={m.nom} /></div>
                        <div className="space-y-1.5"><Label>Prénom</Label><Input defaultValue={m.prenom} /></div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Spécialité</Label>
                        <SearchableSelectField options={specialiteOptions} defaultValue={m.specialite} />
                      </div>
                      <div className="space-y-1.5"><Label>Téléphone</Label><Input defaultValue={m.telephone} /></div>
                      <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={m.email} /></div>
                      <div className="space-y-1.5">
                        <Label>Statut</Label>
                        <SearchableSelectField options={statutOptions} defaultValue={m.actif ? 'actif' : 'inactif'} />
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

'use client';

import { useState } from 'react';
import { Lock, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { addMagasin, removeMagasin, useMagasins } from '@/lib/magasins-store';

const TYPE_OPTIONS = [
  { value: 'MAGASIN', label: 'Magasin' },
  { value: 'PHARMACIE', label: 'Pharmacie' },
];

const EMPTY = { nom: '', type: 'MAGASIN', responsable: '', localisation: '' };

export default function MagasinsPage() {
  const magasins = useMagasins();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const set = (key: keyof typeof EMPTY, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const save = () => {
    if (!form.nom.trim()) return;
    addMagasin({ nom: form.nom.trim(), type: form.type as 'MAGASIN' | 'PHARMACIE', responsable: form.responsable.trim(), localisation: form.localisation.trim() });
    setForm(EMPTY);
    setOpen(false);
  };

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">Magasins et pharmacies</h1>
          <p className="text-sm text-muted-foreground">Le magasin central ne peut pas être supprimé.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" className="gap-2"><Plus className="h-4 w-4" /> Nouveau site</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Créer un magasin ou une pharmacie</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Nom</Label><Input placeholder="Pharmacie annexe Akpakpa" value={form.nom} onChange={(e) => set('nom', e.target.value)} /></div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <SearchableSelect options={TYPE_OPTIONS} value={form.type} onChange={(v) => set('type', v)} />
              </div>
              <div className="space-y-1.5"><Label>Responsable</Label><Input placeholder="Nom du responsable" value={form.responsable} onChange={(e) => set('responsable', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Localisation</Label><Input placeholder="Cotonou, Akpakpa" value={form.localisation} onChange={(e) => set('localisation', e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button variant="brand" onClick={save}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-sm">{magasins.length} site(s)</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {magasins.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <span className="flex items-center gap-2 font-medium">{m.nom}{m.central && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}</span>
                  <span className="text-xs text-muted-foreground">{m.id}</span>
                </TableCell>
                <TableCell><Badge variant={m.type === 'PHARMACIE' ? 'secondary' : 'outline'}>{m.type === 'PHARMACIE' ? 'Pharmacie' : 'Magasin'}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{m.responsable}</TableCell>
                <TableCell className="text-muted-foreground">{m.localisation}</TableCell>
                <TableCell className="text-right">
                  {m.central ? (
                    <span className="text-xs text-muted-foreground">Central</span>
                  ) : (
                    <button onClick={() => removeMagasin(m.id)} className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline">
                      <Trash2 className="h-3.5 w-3.5" />Supprimer
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}

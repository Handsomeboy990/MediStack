'use client';

import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PRESTATIONS, SPECIALITES } from '@/lib/mock-data';

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
            <Button className="gap-2 bg-[#004D40] text-white hover:bg-[#003830]">
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
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {SPECIALITES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button className="bg-[#004D40] text-white hover:bg-[#003830]">Enregistrer</Button>
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
                    <DialogHeader><DialogTitle>Modifier — {p.libelle}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5"><Label>Code</Label><Input defaultValue={p.code} /></div>
                        <div className="space-y-1.5"><Label>Tarif</Label><Input type="number" defaultValue={p.tarif} /></div>
                      </div>
                      <div className="space-y-1.5"><Label>Libellé</Label><Input defaultValue={p.libelle} /></div>
                      <div className="space-y-1.5">
                        <Label>Spécialité</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={p.specialite}>
                          {SPECIALITES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Statut</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={p.actif ? 'actif' : 'inactif'}>
                          <option value="actif">Actif</option>
                          <option value="inactif">Inactif</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button className="bg-[#004D40] text-white hover:bg-[#003830]">Enregistrer</Button>
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

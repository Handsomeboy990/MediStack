'use client';

import { Pencil, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ASSURANCES } from '@/lib/mock-data';

export default function AssurancesPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Gestion des assurances</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#004D40] text-white hover:bg-[#003830]">
              <Plus className="h-4 w-4" /> Nouvel organisme
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajouter un organisme</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Code</Label><Input placeholder="CNSS" /></div>
                <div className="space-y-1.5"><Label>Taux (%)</Label><Input type="number" placeholder="40" /></div>
              </div>
              <div className="space-y-1.5"><Label>Nom complet</Label><Input placeholder="Caisse Nationale…" /></div>
              <div className="space-y-1.5"><Label>Contact</Label><Input placeholder="email@organisme.bj" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button className="bg-[#004D40] text-white hover:bg-[#003830]">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{ASSURANCES.length} organisme(s)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {ASSURANCES.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold">{a.nom}</p>
                <p className="text-xs text-muted-foreground">{a.code} · {a.contact}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">{a.taux}%</span>
                <Badge variant={a.actif ? 'success' : 'secondary'}>{a.actif ? 'Actif' : 'Inactif'}</Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-3.5 w-3.5" />Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Modifier : {a.code}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5"><Label>Code</Label><Input defaultValue={a.code} /></div>
                        <div className="space-y-1.5"><Label>Taux (%)</Label><Input type="number" defaultValue={a.taux} /></div>
                      </div>
                      <div className="space-y-1.5"><Label>Nom complet</Label><Input defaultValue={a.nom} /></div>
                      <div className="space-y-1.5"><Label>Contact</Label><Input defaultValue={a.contact} /></div>
                      <div className="space-y-1.5">
                        <Label>Statut</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={a.actif ? 'actif' : 'inactif'}>
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

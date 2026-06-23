'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SPECIALITES } from '@/lib/mock-data';

export default function SpecialitesPage() {
  const [specs, setSpecs] = useState([...SPECIALITES]);
  const [newSpec, setNewSpec] = useState('');

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Liste des spécialités</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#004D40] text-white hover:bg-[#003830]">
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajouter une spécialité</DialogTitle></DialogHeader>
            <div className="space-y-1.5">
              <Label>Nom de la spécialité</Label>
              <Input placeholder="Ex. Ophtalmologie" value={newSpec} onChange={(e) => setNewSpec(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button
                className="bg-[#004D40] text-white hover:bg-[#003830]"
                onClick={() => { if (newSpec.trim()) { setSpecs([...specs, newSpec.trim()]); setNewSpec(''); } }}
              >
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{specs.length} spécialité(s)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
              <p className="text-sm font-medium">{s}</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

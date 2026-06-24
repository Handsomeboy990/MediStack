'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
            <Button variant="brand" className="gap-2 ">
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
                variant="brand" className=""
                onClick={() => { if (newSpec.trim()) { setSpecs([...specs, newSpec.trim()]); setNewSpec(''); } }}
              >
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-sm">{specs.length} spécialité(s)</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Spécialité</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specs.map((s, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{s}</TableCell>
                <TableCell className="text-right">
                  <button onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline">
                    <Trash2 className="h-3.5 w-3.5" />Supprimer
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}

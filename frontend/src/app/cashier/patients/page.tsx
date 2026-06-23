'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PATIENTS, ASSURANCES } from '@/lib/mock-data';

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const filtered = PATIENTS.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.telephone.includes(search),
  );

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, prénom ou téléphone…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#004D40] text-white hover:bg-[#003830]">
              <Plus className="h-4 w-4" /> Nouveau patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un patient</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Nom</Label><Input placeholder="Kone" /></div>
                <div className="space-y-1.5"><Label>Prénom</Label><Input placeholder="Amina" /></div>
              </div>
              <div className="space-y-1.5"><Label>Date de naissance</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label>Téléphone</Label><Input placeholder="97 00 11 22" /></div>
              <div className="space-y-1.5"><Label>Adresse</Label><Input placeholder="Cotonou, Zongo" /></div>
              <div className="space-y-1.5">
                <Label>Assurance</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Aucune</option>
                  {ASSURANCES.filter((a) => a.actif).map((a) => (
                    <option key={a.id} value={a.code}>{a.code} — {a.nom}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Numéro de police</Label><Input placeholder="CNSS-XXXX" /></div>
              <div className="space-y-1.5"><Label>Contact urgence</Label><Input placeholder="Nom et téléphone" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button className="bg-[#004D40] text-white hover:bg-[#003830]">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Aucun patient trouvé.</p>
        )}
        {filtered.map((p) => (
          <Link key={p.id} href={`/cashier/patients/${p.id}`}>
            <div className="flex items-center justify-between rounded-xl border border-border bg-white p-4 transition hover:border-primary hover:shadow-sm">
              <div>
                <p className="font-semibold">{p.prenom} {p.nom}</p>
                <p className="text-xs text-muted-foreground">{p.id} · {p.telephone} · {p.adresse}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.assurance ? (
                  <Badge variant="success">{p.assurance} — {p.tauxCouverture}%</Badge>
                ) : (
                  <Badge variant="secondary">Sans assurance</Badge>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} patient(s) affiché(s)</p>
    </main>
  );
}

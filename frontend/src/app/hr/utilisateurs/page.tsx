'use client';

import { useState } from 'react';
import { Pencil, Plus, XCircle, CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UTILISATEURS, ROLES_LIST } from '@/lib/mock-data';

export default function UtilisateursHRPage() {
  const [search, setSearch] = useState('');
  const filtered = UTILISATEURS.filter(
    (u) =>
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-bold">Gestion des utilisateurs</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#004D40] text-white hover:bg-[#003830]">
              <Plus className="h-4 w-4" /> Nouveau compte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Créer un compte</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Nom</Label><Input /></div>
                <div className="space-y-1.5"><Label>Prénom</Label><Input /></div>
              </div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="agent@clinicflow.bj" /></div>
              <div className="space-y-1.5"><Label>Téléphone</Label><Input placeholder="97 XX XX XX" /></div>
              <div className="space-y-1.5">
                <Label>Rôle</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {ROLES_LIST.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Mot de passe provisoire</Label><Input type="password" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button className="bg-[#004D40] text-white hover:bg-[#003830]">Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Rechercher par nom ou rôle…" className="max-w-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        <p className="flex items-center text-xs text-muted-foreground">{filtered.length} résultat(s)</p>
      </div>

      <Card>
        <CardContent className="space-y-2 pt-4">
          {filtered.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold">{u.prenom} {u.nom}</p>
                <p className="text-xs text-muted-foreground">{u.email} · {u.telephone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{u.role}</Badge>
                <Badge variant={u.actif ? 'success' : 'secondary'}>{u.actif ? 'Actif' : 'Inactif'}</Badge>

                {/* Edit modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-3.5 w-3.5" />Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Modifier — {u.prenom} {u.nom}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5"><Label>Nom</Label><Input defaultValue={u.nom} /></div>
                        <div className="space-y-1.5"><Label>Prénom</Label><Input defaultValue={u.prenom} /></div>
                      </div>
                      <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={u.email} /></div>
                      <div className="space-y-1.5"><Label>Téléphone</Label><Input defaultValue={u.telephone} /></div>
                      <div className="space-y-1.5">
                        <Label>Rôle</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={u.role}>
                          {ROLES_LIST.map((r) => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button className="bg-[#004D40] text-white hover:bg-[#003830]">Enregistrer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Toggle activation */}
                <Button
                  size="sm"
                  variant={u.actif ? 'destructive' : 'default'}
                  className={`gap-1 ${!u.actif ? 'bg-[#004D40] text-white hover:bg-[#003830]' : ''}`}
                >
                  {u.actif ? <><XCircle className="h-3.5 w-3.5" />Désactiver</> : <><CheckCircle2 className="h-3.5 w-3.5" />Activer</>}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

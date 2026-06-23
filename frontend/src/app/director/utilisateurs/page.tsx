'use client';

import { useState } from 'react';
import { Pencil, Trash2, XCircle, CheckCircle2, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UTILISATEURS, ROLES_LIST } from '@/lib/mock-data';

export default function DirectorUtilisateursPage() {
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
            <Button variant="brand" className="gap-2 ">
              <Plus className="h-4 w-4" /> Nouveau
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Créer un compte</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Nom</Label><Input /></div>
                <div className="space-y-1.5"><Label>Prénom</Label><Input /></div>
              </div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" /></div>
              <div className="space-y-1.5"><Label>Téléphone</Label><Input /></div>
              <div className="space-y-1.5">
                <Label>Rôle</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {ROLES_LIST.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Mot de passe</Label><Input type="password" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button variant="brand" className="">Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input placeholder="Rechercher…" className="max-w-sm" value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card>
        <CardContent className="space-y-2 pt-4">
          {filtered.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold">{u.prenom} {u.nom}</p>
                <p className="text-xs text-muted-foreground">{u.email} · Créé le {u.creeLe}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{u.role}</Badge>
                <Badge variant={u.actif ? 'success' : 'secondary'}>{u.actif ? 'Actif' : 'Inactif'}</Badge>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-3.5 w-3.5" /></Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Modifier : {u.prenom} {u.nom}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5"><Label>Nom</Label><Input defaultValue={u.nom} /></div>
                        <div className="space-y-1.5"><Label>Prénom</Label><Input defaultValue={u.prenom} /></div>
                      </div>
                      <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={u.email} /></div>
                      <div className="space-y-1.5">
                        <Label>Rôle</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={u.role}>
                          {ROLES_LIST.map((r) => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button variant="brand" className="">Enregistrer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button size="sm" variant={u.actif ? 'destructive' : 'brand'} className="gap-1">
                  {u.actif ? <><XCircle className="h-3.5 w-3.5" /></> : <><CheckCircle2 className="h-3.5 w-3.5" /></>}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Supprimer {u.prenom} {u.nom} ?</DialogTitle></DialogHeader>
                    <p className="text-sm text-muted-foreground">Cette action est irréversible. L&apos;historique de l&apos;utilisateur sera conservé.</p>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button variant="destructive">Supprimer</Button>
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

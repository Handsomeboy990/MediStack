'use client';

import { useState } from 'react';
import { Pencil, Plus, Search, XCircle, CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelectField } from '@/components/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UTILISATEURS, ROLES_LIST } from '@/lib/mock-data';

// Les RH ne peuvent pas attribuer le profil Administrateur : seul un
// administrateur dispose de ce privilège (via son propre espace).
const ROLES_ATTRIBUABLES = ROLES_LIST.filter((r) => r !== 'Administrateur');
const roleOptions = ROLES_ATTRIBUABLES.map((r) => ({ value: r, label: r }));

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
            <Button variant="brand" className="gap-2 ">
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
                <SearchableSelectField options={roleOptions} placeholder="Sélectionner un rôle" />
              </div>
              <div className="space-y-1.5"><Label>Mot de passe provisoire</Label><Input type="password" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button variant="brand" className="">Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher par nom ou rôle..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.prenom} {u.nom}</TableCell>
                <TableCell className="text-muted-foreground">{u.email} · {u.telephone}</TableCell>
                <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                <TableCell><Badge variant={u.actif ? 'success' : 'secondary'}>{u.actif ? 'Actif' : 'Inactif'}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-3.5 w-3.5" />Modifier</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Modifier : {u.prenom} {u.nom}</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5"><Label>Nom</Label><Input defaultValue={u.nom} /></div>
                            <div className="space-y-1.5"><Label>Prénom</Label><Input defaultValue={u.prenom} /></div>
                          </div>
                          <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={u.email} /></div>
                          <div className="space-y-1.5"><Label>Téléphone</Label><Input defaultValue={u.telephone} /></div>
                          <div className="space-y-1.5">
                            <Label>Rôle</Label>
                            <SearchableSelectField options={roleOptions} defaultValue={u.role} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Annuler</Button>
                          <Button variant="brand">Enregistrer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant={u.actif ? 'destructive' : 'brand'} className="gap-1">
                      {u.actif ? <><XCircle className="h-3.5 w-3.5" />Désactiver</> : <><CheckCircle2 className="h-3.5 w-3.5" />Activer</>}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Aucun utilisateur trouvé.</p>}
      </Card>
    </main>
  );
}

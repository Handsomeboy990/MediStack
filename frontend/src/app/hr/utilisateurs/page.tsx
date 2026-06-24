'use client';

import { useState } from 'react';
import { CheckCircle2, Search, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EditUserDialog, NewUserDialog } from '@/components/user-dialogs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROLES_LIST } from '@/lib/mock-data';
import { toggleActif, useUtilisateurs } from '@/lib/users-store';

// Les RH ne peuvent pas attribuer le profil Administrateur : seul un
// administrateur dispose de ce privilège (via son propre espace).
const roleOptions = ROLES_LIST.filter((r) => r !== 'Administrateur').map((r) => ({ value: r, label: r }));

export default function UtilisateursHRPage() {
  const users = useUtilisateurs();
  const [search, setSearch] = useState('');
  const filtered = users.filter(
    (u) =>
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold">Gestion des utilisateurs</h1>
        <NewUserDialog roleOptions={roleOptions} />
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
                    <EditUserDialog user={u} roleOptions={roleOptions} />
                    <Button size="sm" variant={u.actif ? 'destructive' : 'brand'} className="gap-1" onClick={() => toggleActif(u.id)}>
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

'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const user = {
  nom: 'Ahouansou',
  prenom: 'Brice',
  email: 'b.ahouansou@clinicflow.bj',
  telephone: '97 11 22 33',
  role: 'Agent de caisse',
  actif: true,
  creeLe: '2025-01-10',
};

export default function ProfilPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {user.prenom[0]}{user.nom[0]}
          </div>
          <h1 className="text-2xl font-bold">{user.prenom} {user.nom}</h1>
          <Badge variant="outline" className="mt-2">{user.role}</Badge>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Informations du compte</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><strong>{user.email}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Téléphone</span><strong>{user.telephone}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Compte créé le</span><strong>{user.creeLe}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Statut</span><Badge variant="success">Actif</Badge></div>
            <Separator />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2" variant="outline">
                  <Pencil className="h-4 w-4" /> Modifier mon profil
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Modifier mon profil</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label>Nom</Label><Input defaultValue={user.nom} /></div>
                    <div className="space-y-1.5"><Label>Prénom</Label><Input defaultValue={user.prenom} /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Téléphone</Label><Input defaultValue={user.telephone} /></div>
                  <Separator />
                  <div className="space-y-1.5"><Label>Nouveau mot de passe</Label><Input type="password" placeholder="Laisser vide pour ne pas changer" /></div>
                  <div className="space-y-1.5"><Label>Confirmer le mot de passe</Label><Input type="password" /></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button variant="brand" className="">Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

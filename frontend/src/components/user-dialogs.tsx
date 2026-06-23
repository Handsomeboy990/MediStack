'use client';

import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect, type SelectOption } from '@/components/searchable-select';
import { type Utilisateur } from '@/lib/mock-data';
import { addUtilisateur, updateUtilisateur } from '@/lib/users-store';

export function NewUserDialog({ roleOptions }: { roleOptions: SelectOption[] }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', role: '' });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.nom.trim() || !form.prenom.trim() || !form.role) return;
    addUtilisateur({ nom: form.nom.trim(), prenom: form.prenom.trim(), email: form.email.trim(), telephone: form.telephone.trim(), role: form.role, actif: true });
    setForm({ nom: '', prenom: '', email: '', telephone: '', role: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="brand" className="gap-2"><Plus className="h-4 w-4" /> Nouveau compte</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Créer un compte</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Nom</Label><Input value={form.nom} onChange={(e) => set('nom', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Prénom</Label><Input value={form.prenom} onChange={(e) => set('prenom', e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="agent@meditrust.bj" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Téléphone</Label><Input placeholder="01 97 00 11 22" value={form.telephone} onChange={(e) => set('telephone', e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Rôle</Label><SearchableSelect options={roleOptions} value={form.role} onChange={(v) => set('role', v)} placeholder="Sélectionner un rôle" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="brand" onClick={save}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditUserDialog({ user, roleOptions }: { user: Utilisateur; roleOptions: SelectOption[] }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nom: user.nom, prenom: user.prenom, email: user.email, telephone: user.telephone, role: user.role });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    updateUtilisateur(user.id, { nom: form.nom.trim(), prenom: form.prenom.trim(), email: form.email.trim(), telephone: form.telephone.trim(), role: form.role });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-3.5 w-3.5" />Modifier</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Modifier : {user.prenom} {user.nom}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Nom</Label><Input value={form.nom} onChange={(e) => set('nom', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Prénom</Label><Input value={form.prenom} onChange={(e) => set('prenom', e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => set('telephone', e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Rôle</Label><SearchableSelect options={roleOptions} value={form.role} onChange={(v) => set('role', v)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="brand" onClick={save}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

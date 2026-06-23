'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NewPatientDialog } from '@/components/new-patient-dialog';
import { usePatients } from '@/lib/patients-store';

export default function PatientsPage() {
  const patients = usePatients();
  const [search, setSearch] = useState('');
  const filtered = patients.filter(
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
            placeholder="Rechercher par nom, prénom ou téléphone..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <NewPatientDialog />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Aucun patient trouvé.</p>
        )}
        {filtered.map((p) => {
          const carte = p.cartesAssurance[0];
          return (
            <Link key={p.id} href={`/cashier/patients/${p.id}`}>
              <div className="flex items-center justify-between rounded-xl border border-border bg-white p-4 transition hover:border-primary hover:shadow-sm">
                <div>
                  <p className="font-semibold">{p.prenom} {p.nom}</p>
                  <p className="text-xs text-muted-foreground">{p.id} · {p.telephone} · {p.adresse}</p>
                </div>
                <div className="flex items-center gap-2">
                  {carte ? (
                    <Badge variant="success">
                      {carte.nom} · {carte.taux}%
                      {p.cartesAssurance.length > 1 ? ` (+${p.cartesAssurance.length - 1})` : ''}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Sans assurance</Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} patient(s) affiché(s)</p>
    </main>
  );
}

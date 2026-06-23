'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NewPatientDialog } from '@/components/new-patient-dialog';
import { EditPatientDialog } from '@/components/edit-patient-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePatients } from '@/lib/patients-store';

export default function PatientsPage() {
  const router = useRouter();
  const patients = usePatients();
  const [search, setSearch] = useState('');
  const filtered = patients.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.telephone.includes(search),
  );

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold">Patients</h1>
        <NewPatientDialog />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, prénom ou téléphone..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Assurance</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const carte = p.cartesAssurance[0];
              return (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => router.push(`/cashier/patients/${p.id}`)}>
                  <TableCell className="font-medium text-primary">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.prenom} {p.nom}</TableCell>
                  <TableCell className="text-muted-foreground">{p.telephone}</TableCell>
                  <TableCell className="text-muted-foreground">{p.adresse}</TableCell>
                  <TableCell>
                    {carte ? (
                      <Badge variant="success">
                        {carte.nom} · {carte.taux}%{p.cartesAssurance.length > 1 ? ` (+${p.cartesAssurance.length - 1})` : ''}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Sans assurance</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <EditPatientDialog patient={p} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filtered.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Aucun patient trouvé.</p>}
      </Card>
      <p className="text-xs text-muted-foreground">{filtered.length} patient(s) affiché(s)</p>
    </main>
  );
}

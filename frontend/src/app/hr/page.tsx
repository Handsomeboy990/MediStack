import Link from 'next/link';
import { BookOpen, Stethoscope, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { UTILISATEURS, MEDECINS, SPECIALITES } from '@/lib/mock-data';

const actifs = UTILISATEURS.filter((u) => u.actif).length;

const kpis = [
  { label: 'Utilisateurs', value: String(UTILISATEURS.length), tone: 'primary' as const, hint: `${actifs} actifs` },
  { label: 'Médecins', value: String(MEDECINS.length), tone: 'success' as const, hint: `${MEDECINS.filter((m) => m.actif).length} actifs` },
  { label: 'Spécialités', value: String(SPECIALITES.length), tone: 'neutral' as const, hint: 'Au catalogue' },
  { label: 'Comptes inactifs', value: String(UTILISATEURS.length - actifs), tone: 'warning' as const, hint: 'Désactivés' },
];

const navCards = [
  { href: '/hr/medecins', label: 'Médecins', desc: `${MEDECINS.length} médecins enregistrés`, icon: Stethoscope },
  { href: '/hr/specialites', label: 'Spécialités', desc: 'Gérer le catalogue', icon: BookOpen },
  { href: '/hr/utilisateurs', label: 'Utilisateurs', desc: `${UTILISATEURS.length} comptes`, icon: Users },
];

export default function HrPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Ressources humaines</h1>
        <p className="text-sm text-muted-foreground">Gestion du personnel et des comptes</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => <KpiCard key={k.label} label={k.label} value={k.value} tone={k.tone} hint={k.hint} />)}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {navCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href}>
              <Card className="h-full cursor-pointer transition hover:border-primary hover:shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

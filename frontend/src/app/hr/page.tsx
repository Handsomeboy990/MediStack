import Link from 'next/link';
import { CheckCircle2, Stethoscope, BookOpen, Users, XCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { UTILISATEURS, MEDECINS } from '@/lib/mock-data';

const navCards = [
  { href: '/hr/medecins', label: 'Médecins', desc: `${MEDECINS.length} médecins enregistrés`, icon: Stethoscope },
  { href: '/hr/specialites', label: 'Spécialités', desc: 'Gérer le catalogue', icon: BookOpen },
  { href: '/hr/utilisateurs', label: 'Utilisateurs', desc: `${UTILISATEURS.length} comptes`, icon: Users },
];

export default function HrPage() {
  const actifs = UTILISATEURS.filter((u) => u.actif).length;

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Ressources humaines</h1>
        <p className="text-sm text-muted-foreground">{UTILISATEURS.length} utilisateurs · {actifs} actifs</p>
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

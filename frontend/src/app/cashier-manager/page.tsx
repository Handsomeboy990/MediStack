import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Receipt, Shield, Stethoscope, TrendingUp, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FACTURES, ANNULATIONS, fmt } from '@/lib/mock-data';

const today = '2026-06-23';
const facs = FACTURES.filter((f) => f.date === today);
const totalJour = facs.filter((f) => f.statut === 'PAYE').reduce((s, f) => s + f.net, 0);

const kpis = [
  { label: 'Recette du jour', value: fmt(totalJour), tone: 'text-primary' },
  { label: 'Factures payées', value: String(facs.filter((f) => f.statut === 'PAYE').length), tone: 'text-emerald-600' },
  { label: 'Partielles', value: String(facs.filter((f) => f.statut === 'PARTIEL').length), tone: 'text-amber-600' },
  { label: 'Annulations en attente', value: String(ANNULATIONS.filter((a) => a.statut === 'EN_ATTENTE').length), tone: 'text-rose-600' },
];

const navCards = [
  { href: '/cashier-manager/factures', label: 'Liste des factures', desc: 'Toutes les factures du centre', icon: Receipt },
  { href: '/cashier-manager/annulations', label: 'Annulations', desc: `${ANNULATIONS.filter((a) => a.statut === 'EN_ATTENTE').length} en attente`, icon: AlertTriangle },
  { href: '/cashier-manager/recette', label: 'Recette', desc: 'Globale et par caissier', icon: TrendingUp },
  { href: '/cashier-manager/prestations', label: 'Prestations', desc: 'Gérer le catalogue', icon: Stethoscope },
  { href: '/cashier-manager/assurances', label: 'Assurances', desc: 'Organismes et taux', icon: Shield },
];

export default function CashierManagerPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">23 juin 2026 · Responsable de caisse</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className={`mt-1 text-2xl font-bold ${k.tone}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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

      <Card>
        <CardHeader><CardTitle className="text-base">Activité récente</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {FACTURES.slice(0, 4).map((f) => (
            <Link key={f.id} href={`/cashier-manager/factures`}>
              <div className="flex items-center justify-between rounded-xl border border-border p-3 transition hover:bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{f.patient}</p>
                  <p className="text-xs text-muted-foreground">{f.id} · {f.agent}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-primary">{fmt(f.net)}</p>
                  <Badge variant={f.statut === 'PAYE' ? 'success' : f.statut === 'PARTIEL' ? 'warning' : 'secondary'}>
                    {f.statut === 'PAYE' ? 'Payée' : f.statut === 'PARTIEL' ? 'Partielle' : f.statut}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

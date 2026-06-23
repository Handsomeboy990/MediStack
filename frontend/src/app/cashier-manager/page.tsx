import Link from 'next/link';
import { AlertTriangle, Receipt, Shield, Stethoscope, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { FACTURES, ANNULATIONS, fmt } from '@/lib/mock-data';

const today = '2026-06-23';
const facs = FACTURES.filter((f) => f.date === today);
const totalJour = facs.filter((f) => f.statut === 'PAYE').reduce((s, f) => s + f.net, 0);
const enAttenteAnnul = ANNULATIONS.filter((a) => a.statut === 'EN_ATTENTE').length;

const kpis = [
  { label: 'Recette du jour', value: fmt(totalJour), tone: 'primary' as const, hint: 'Net encaissé' },
  { label: 'Factures payées', value: String(facs.filter((f) => f.statut === 'PAYE').length), tone: 'success' as const, hint: 'Aujourd’hui' },
  { label: 'Partielles', value: String(facs.filter((f) => f.statut === 'PARTIEL').length), tone: 'warning' as const, hint: 'Solde restant' },
  { label: 'Annulations en attente', value: String(enAttenteAnnul), tone: 'danger' as const, hint: 'À traiter' },
];

const navCards = [
  { href: '/cashier-manager/factures', label: 'Liste des factures', desc: 'Toutes les factures du centre', icon: Receipt },
  { href: '/cashier-manager/annulations', label: 'Annulations', desc: `${enAttenteAnnul} en attente`, icon: AlertTriangle },
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
        {kpis.map((k) => <KpiCard key={k.label} label={k.label} value={k.value} tone={k.tone} hint={k.hint} />)}
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
            <Link key={f.id} href="/cashier-manager/factures">
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

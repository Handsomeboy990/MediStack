import Link from 'next/link';
import { BarChart3, Shield, Users, Warehouse } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { Donut, LineChart } from '@/components/charts';
import { FACTURES, UTILISATEURS, STOCK_ARTICLES, fmt } from '@/lib/mock-data';

const payees = FACTURES.filter((f) => f.statut === 'PAYE');
const revenue = payees.reduce((s, f) => s + f.net, 0);
const alerts = STOCK_ARTICLES.filter((a) => a.quantite <= a.seuil).length;

const kpis = [
  { label: 'Chiffre d’affaires', value: fmt(revenue), tone: 'primary' as const, hint: 'Factures payées' },
  { label: 'Utilisateurs actifs', value: String(UTILISATEURS.filter((u) => u.actif).length), tone: 'success' as const, hint: 'Comptes actifs' },
  { label: 'Factures totales', value: String(FACTURES.length), tone: 'neutral' as const, hint: 'Toutes périodes' },
  { label: 'Alertes stock', value: String(alerts), tone: alerts > 0 ? ('warning' as const) : ('neutral' as const), hint: 'Articles en tension' },
];

const MODE_LABELS: Record<string, string> = { ESPECES: 'Espèces', MOBILE: 'Mobile money', MIXTE: 'Mixte' };
const parMode = ['ESPECES', 'MOBILE', 'MIXTE'].map((m) => ({
  label: MODE_LABELS[m],
  value: payees.filter((f) => f.modePaiement === m).reduce((s, f) => s + f.net, 0),
}));

const evolution = [
  { label: 'Jan', value: 3200000 }, { label: 'Fév', value: 3800000 }, { label: 'Mar', value: 4100000 },
  { label: 'Avr', value: 3600000 }, { label: 'Mai', value: 4500000 }, { label: 'Juin', value: revenue },
];

const navCards = [
  { href: '/director/stats', label: 'Statistiques', desc: 'Revenus, médecins, évolution', icon: BarChart3 },
  { href: '/director/utilisateurs', label: 'Utilisateurs', desc: 'Gestion complète des comptes', icon: Users },
  { href: '/director/roles', label: 'Rôles', desc: 'Attribution et permissions', icon: Shield },
  { href: '/director/magasins', label: 'Magasins', desc: 'Magasins et pharmacies', icon: Warehouse },
];

export default function DirectorPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Tableau de bord global</h1>
        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble du centre de santé</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => <KpiCard key={k.label} label={k.label} value={k.value} tone={k.tone} hint={k.hint} />)}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle className="text-sm">Évolution des revenus (6 mois)</CardTitle></CardHeader>
          <CardContent><LineChart data={evolution} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Modes de paiement</CardTitle></CardHeader>
          <CardContent><Donut data={parMode} format={fmt} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

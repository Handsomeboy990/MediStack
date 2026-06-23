import Link from 'next/link';
import { BarChart3, Shield, TrendingUp, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { FACTURES, UTILISATEURS, STOCK_ARTICLES, fmt } from '@/lib/mock-data';

const revenue = FACTURES.filter((f) => f.statut === 'PAYE').reduce((s, f) => s + f.net, 0);
const alerts = STOCK_ARTICLES.filter((a) => a.quantite <= a.seuil).length;

const kpis = [
  { label: 'Chiffre d\'affaires', value: fmt(revenue), tone: 'text-primary' },
  { label: 'Utilisateurs actifs', value: String(UTILISATEURS.filter((u) => u.actif).length), tone: 'text-emerald-600' },
  { label: 'Factures totales', value: String(FACTURES.length), tone: 'text-foreground' },
  { label: 'Alertes stock', value: String(alerts), tone: alerts > 0 ? 'text-amber-600' : 'text-foreground' },
];

const navCards = [
  { href: '/director/stats', label: 'Statistiques', desc: 'Revenus, médecins, évolution', icon: BarChart3 },
  { href: '/director/utilisateurs', label: 'Utilisateurs', desc: 'Gestion complète des comptes', icon: Users },
  { href: '/director/roles', label: 'Rôles', desc: 'Attribution et permissions', icon: Shield },
];

export default function DirectorPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Tableau de bord global</h1>
        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble du centre de santé</p>
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

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="font-semibold">Répartition des revenus par mode de paiement</p>
          </div>
          {(['ESPECES', 'MOBILE', 'MIXTE'] as const).map((mode) => {
            const val = FACTURES.filter((f) => f.statut === 'PAYE' && f.modePaiement === mode).reduce((s, f) => s + f.net, 0);
            const pct = revenue > 0 ? Math.round((val / revenue) * 100) : 0;
            return (
              <div key={mode} className="mb-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{mode}</span>
                  <strong className="text-primary">{fmt(val)} ({pct}%)</strong>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}

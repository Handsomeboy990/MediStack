import Link from 'next/link';
import { ClipboardList, FileText, Receipt, TrendingUp, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FACTURES, STATUT_LABELS, STATUT_VARIANTS, fmt } from '@/lib/mock-data';

const today = '2026-06-23';
const todayFacs = FACTURES.filter((f) => f.date === today);
const totalJour = todayFacs.filter((f) => f.statut === 'PAYE').reduce((s, f) => s + f.net, 0);
const enAttente = todayFacs.filter((f) => f.statut === 'EN_ATTENTE').length;
const partiels = todayFacs.filter((f) => f.statut === 'PARTIEL').length;

const kpis = [
  { label: 'Factures du jour', value: String(todayFacs.length), tone: 'text-primary' },
  { label: 'Encaissé', value: fmt(totalJour), tone: 'text-primary' },
  { label: 'En attente', value: String(enAttente), tone: 'text-amber-600' },
  { label: 'Partielles', value: String(partiels), tone: 'text-orange-500' },
];

const quickLinks = [
  { href: '/cashier/patients', label: 'Patients', desc: 'Rechercher ou créer un patient', icon: Users },
  { href: '/cashier/factures/nouveau', label: 'Nouvelle facture', desc: 'Démarrer une facturation', icon: FileText },
  { href: '/cashier/factures', label: 'Mes factures', desc: 'Historique et encaissements', icon: Receipt },
  { href: '/cashier/recette', label: 'Ma recette', desc: 'Résumé de ma journée', icon: TrendingUp },
];

export default function CashierPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Bonjour, Ahouansou B.</h1>
        <p className="text-sm text-muted-foreground">Lundi 23 juin 2026 — Caisse ouverte</p>
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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((l) => {
          const Icon = l.icon;
          return (
            <Link key={l.href} href={l.href}>
              <Card className="h-full cursor-pointer transition hover:border-primary hover:shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{l.label}</p>
                    <p className="text-xs text-muted-foreground">{l.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Dernières factures</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {todayFacs.slice(0, 4).map((f) => (
            <Link key={f.id} href={`/cashier/factures/${f.id}`}>
              <div className="flex items-center justify-between rounded-xl border border-border p-3 transition hover:border-primary hover:bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{f.patient}</p>
                  <p className="text-xs text-muted-foreground">{f.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-primary">{fmt(f.net)}</p>
                  <Badge variant={STATUT_VARIANTS[f.statut]}>{STATUT_LABELS[f.statut]}</Badge>
                </div>
              </div>
            </Link>
          ))}
          <div className="pt-1">
            <Link href="/cashier/factures">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <ClipboardList className="h-4 w-4" /> Voir toutes mes factures
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

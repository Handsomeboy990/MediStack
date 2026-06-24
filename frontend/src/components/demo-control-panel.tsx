'use client';

import { useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { seedDemoData, resetDemoData, type DemoPreset } from '@/lib/demo-seed';

export function DemoControlPanel() {
  const [loading, setLoading] = useState<DemoPreset | null>(null);
  const [message, setMessage] = useState('');

  const runPreset = (preset: DemoPreset) => {
    setLoading(preset);
    setTimeout(() => {
      const result = seedDemoData(preset);
      setMessage(`Jeu ${preset} chargé: ${result.patients} patients, ${result.factures} factures, ${result.users} utilisateurs, ${result.logs} logs.`);
      setLoading(null);
    }, 10);
  };

  const reset = () => {
    setLoading('small');
    setTimeout(() => {
      resetDemoData();
      setMessage('Dataset réinitialisé aux données de base.');
      setLoading(null);
    }, 10);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4 text-primary" />
          Mode démo: données massives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Charge un volume important de données mock pour tester recherche, filtres, tableaux et navigation sans backend.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => runPreset('small')} disabled={!!loading}>Lot léger</Button>
          <Button size="sm" variant="outline" onClick={() => runPreset('medium')} disabled={!!loading}>Lot moyen</Button>
          <Button size="sm" variant="brand" onClick={() => runPreset('large')} disabled={!!loading}>Lot massif</Button>
          <Button size="sm" variant="ghost" onClick={reset} disabled={!!loading} className="gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Réinitialiser
          </Button>
        </div>
        {message && <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
}

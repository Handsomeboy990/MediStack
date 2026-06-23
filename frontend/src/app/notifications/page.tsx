'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationsAdmin, type LogAction } from '@/lib/logs-store';

const ACTION_LABELS: Record<LogAction, string> = { CREATE: 'Création', UPDATE: 'Modification', DELETE: 'Suppression' };
const ACTION_VARIANTS: Record<LogAction, 'success' | 'warning' | 'destructive'> = { CREATE: 'success', UPDATE: 'warning', DELETE: 'destructive' };

export default function NotificationsPage() {
  const notifs = useNotificationsAdmin();

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Modifications et suppressions à l&apos;attention de l&apos;administrateur</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{notifs.length} notification(s)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {notifs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aucune notification.</p>
          ) : (
            notifs.map((n) => (
              <div key={n.id} className="flex gap-4 rounded-xl border border-border p-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{ACTION_LABELS[n.action]} · {n.entity}</p>
                    <Badge variant={ACTION_VARIANTS[n.action]}>{ACTION_LABELS[n.action]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{new Date(n.date).toLocaleString('fr-FR')} · {n.user}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}

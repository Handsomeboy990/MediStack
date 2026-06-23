import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const notifs = [
  { id: 1, type: 'warning', titre: 'Stock sous seuil', corps: 'Amoxicilline 250 mg est passée sous le seuil de réapprovisionnement (12 / 15).', date: '23 juin 2026 · 11:05', lu: false },
  { id: 2, type: 'info', titre: 'Demande d\'annulation', corps: 'L\'agent Codjo M. a soumis une demande d\'annulation sur FAC-20260623-002.', date: '23 juin 2026 · 10:48', lu: false },
  { id: 3, type: 'success', titre: 'Clôture de caisse', corps: 'La caisse du 22 juin 2026 a été clôturée. Total : 172 000 FCFA.', date: '22 juin 2026 · 18:00', lu: true },
  { id: 4, type: 'warning', titre: 'Rupture de stock', corps: 'Gants latex M est en rupture totale.', date: '22 juin 2026 · 16:00', lu: true },
  { id: 5, type: 'info', titre: 'Nouveau compte créé', corps: 'Un compte Agent de caisse a été créé pour Gbessi Théodore.', date: '20 juin 2026 · 09:30', lu: true },
];

const typeBadge: Record<string, 'warning' | 'success' | 'secondary'> = {
  warning: 'warning', success: 'success', info: 'secondary',
};

export default function NotificationsPage() {
  const unread = notifs.filter((n) => !n.lu).length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">{unread} non lue(s)</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{notifs.length} notifications</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {notifs.map((n) => (
            <div key={n.id} className={`flex gap-4 rounded-xl border p-4 ${n.lu ? 'border-border bg-white' : 'border-primary/30 bg-primary/5'}`}>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm">{n.titre}</p>
                  <Badge variant={typeBadge[n.type]}>{n.type === 'warning' ? 'Alerte' : n.type === 'success' ? 'Info' : 'Info'}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.corps}</p>
                <p className="mt-2 text-xs text-muted-foreground">{n.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

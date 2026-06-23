import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const roles = [
  {
    id: 'R-01',
    nom: 'Administrateur',
    description: 'Accès total : gestion des utilisateurs, statistiques globales, supervision.',
    permissions: ['Tableau de bord global', 'Gestion utilisateurs', 'Gestion des rôles', 'Statistiques complètes', 'Suppression de comptes'],
    utilisateurs: 1,
  },
  {
    id: 'R-02',
    nom: 'Responsable de caisse',
    description: 'Supervision des opérations de caisse, validation des annulations, clôture.',
    permissions: ['Liste des factures', 'Approbation annulations', 'Recette globale', 'Gestion prestations', 'Gestion assurances'],
    utilisateurs: 1,
  },
  {
    id: 'R-03',
    nom: 'Agent de caisse',
    description: 'Création de patients, facturation, encaissement, demande d\'annulation.',
    permissions: ['Patients', 'Nouvelle facture', 'Encaissement', 'Demande annulation', 'Ma recette'],
    utilisateurs: 2,
  },
  {
    id: 'R-04',
    nom: 'Agent magasinier',
    description: 'Gestion du stock central, entrées, sorties, transferts et alertes.',
    permissions: ['État du stock', 'Entrée de stock', 'Inventaire', 'Transferts', 'Alertes rupture'],
    utilisateurs: 1,
  },
  {
    id: 'R-05',
    nom: 'Ressources humaines',
    description: 'Gestion du personnel, des médecins, des spécialités et des accès.',
    permissions: ['Médecins', 'Spécialités', 'Gestion utilisateurs', 'Activation/désactivation'],
    utilisateurs: 1,
  },
];

export default function RolesPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-lg font-bold">Gestion des rôles</h1>
        <p className="text-sm text-muted-foreground">{roles.length} rôles définis dans le système</p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{role.nom}</CardTitle>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
                <Badge variant="outline">{role.utilisateurs} utilisateur(s)</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-3" />
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((p) => (
                  <span key={p} className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground">
                    {p}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

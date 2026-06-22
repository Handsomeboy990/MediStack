// MediTrust application roles and their entry point in the interface.
// The slug drives the route folder; nom and description are user facing and
// stay in French.
export interface RoleDefinition {
  slug: string;
  nom: string;
  description: string;
}

export const ROLES: RoleDefinition[] = [
  {
    slug: 'director',
    nom: 'Promoteur',
    description: 'Vision globale, statistiques et supervision du centre.',
  },
  {
    slug: 'cashier-manager',
    nom: 'Responsable de caisse',
    description: 'Pilotage des opérations de caisse et validation des annulations.',
  },
  {
    slug: 'cashier',
    nom: 'Agent de caisse',
    description: 'Enregistrement des patients, facturation et encaissement.',
  },
  {
    slug: 'storekeeper',
    nom: 'Agent magasinier',
    description: 'Gestion du stock du magasin central et des mouvements.',
  },
  {
    slug: 'hr',
    nom: 'Ressources humaines',
    description: 'Gestion du personnel et des accès.',
  },
];

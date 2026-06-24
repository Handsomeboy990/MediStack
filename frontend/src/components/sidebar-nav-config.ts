import {
  AlertTriangle, ArrowDown, ArrowLeftRight, BarChart3, BookOpen,
  ClipboardList, FileText, LayoutDashboard, Receipt, RefreshCw, Shield,
  Stethoscope, TrendingUp, Users, Warehouse,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: React.ElementType };
export type RoleConfig = { label: string; icon: React.ElementType; items: NavItem[] };

export const roleNavConfig: Record<string, RoleConfig> = {
  '/doctor': {
    label: 'Médecin',
    icon: Stethoscope,
    items: [
      { href: '/doctor', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/doctor/prescriptions', label: 'Prescription médicale', icon: FileText },
    ],
  },
  '/cashier-manager': {
    label: 'Resp. de caisse',
    icon: LayoutDashboard,
    items: [
      { href: '/cashier-manager', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/cashier-manager/factures', label: 'Factures', icon: Receipt },
      { href: '/cashier-manager/annulations', label: 'Annulations', icon: AlertTriangle },
      { href: '/cashier-manager/recette', label: 'Recette', icon: TrendingUp },
      { href: '/cashier-manager/prestations', label: 'Prestations', icon: Stethoscope },
      { href: '/cashier-manager/assurances', label: 'Assurances', icon: Shield },
    ],
  },
  '/cashier': {
    label: 'Agent de caisse',
    icon: ClipboardList,
    items: [
      { href: '/cashier', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/cashier/patients', label: 'Patients', icon: Users },
      { href: '/cashier/factures', label: 'Factures', icon: Receipt },
      { href: '/cashier/recette', label: 'Ma recette', icon: TrendingUp },
    ],
  },
  '/storekeeper': {
    label: 'Magasinier',
    icon: Warehouse,
    items: [
      { href: '/storekeeper', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/storekeeper/entree', label: 'Entrée stock', icon: ArrowDown },
      { href: '/storekeeper/transferts', label: 'Sorties / Transferts', icon: ArrowLeftRight },
      { href: '/storekeeper/ajustement', label: 'Inventaire', icon: RefreshCw },
      { href: '/storekeeper/mouvements', label: 'Mouvements', icon: ClipboardList },
      { href: '/storekeeper/alertes', label: 'Alertes rupture', icon: AlertTriangle },
    ],
  },
  '/hr': {
    label: 'Ressources humaines',
    icon: Users,
    items: [
      { href: '/hr', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/hr/medecins', label: 'Médecins', icon: Stethoscope },
      { href: '/hr/specialites', label: 'Spécialités', icon: BookOpen },
      { href: '/hr/utilisateurs', label: 'Utilisateurs', icon: Users },
    ],
  },
  '/director': {
    label: 'Administrateur',
    icon: BarChart3,
    items: [
      { href: '/director', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/director/stats', label: 'Statistiques', icon: BarChart3 },
      { href: '/director/utilisateurs', label: 'Utilisateurs', icon: Users },
      { href: '/director/roles', label: 'Rôles', icon: Shield },
      { href: '/director/magasins', label: 'Magasins / Pharmacies', icon: Warehouse },
      { href: '/director/logs', label: 'Journal', icon: ClipboardList },
    ],
  },
};

export const roleOrder = ['/doctor', '/cashier-manager', '/cashier', '/storekeeper', '/hr', '/director'];

export function getCurrentRole(pathname: string) {
  return roleOrder.find((r) => pathname.startsWith(r)) ?? null;
}

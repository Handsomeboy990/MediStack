# Implementation tracker

## Purpose

This document tracks the progress of the frontend page implementation for ClinicFlow. It is the working reference for the visual and functional evolution of each screen.

## Visual direction

- Font: Montserrat
- Primary color: green
- Sidebar: shadcn/ui composable sidebar pattern
- Tone: clean, operational, medical and traceable

## Page inventory

### Fondations & transversal

| Route | Description | Status |
|---|---|---|
| `/login` | Connexion (email + mot de passe, toggle visibilité) | ✅ Done |
| `/profil` | Profil utilisateur courant, modal de modification | ✅ Done |
| `/notifications` | Fil de notifications, alertes stock + annulations | ✅ Done |

### Agent de caisse (`/cashier`)

| Route | Description | Status |
|---|---|---|
| `/cashier` | Dashboard — KPI jour, accès rapide, factures récentes | ✅ Done |
| `/cashier/patients` | Liste patients + modal "Nouveau patient" | ✅ Done |
| `/cashier/patients/[id]` | Fiche patient — infos, assurance, historique factures | ✅ Done |
| `/cashier/factures` | Factures du jour — liste + lien vers détail | ✅ Done |
| `/cashier/factures/nouveau` | Création facture — patient, médecins, lignes, totaux | ✅ Done |
| `/cashier/factures/[id]` | Détail facture — 3 onglets : détail, encaissement, annulation | ✅ Done |
| `/cashier/recette` | Ma recette journalière — par mode de paiement | ✅ Done |

### Responsable de caisse (`/cashier-manager`)

| Route | Description | Status |
|---|---|---|
| `/cashier-manager` | Dashboard — KPI, accès rapide, activité récente | ✅ Done |
| `/cashier-manager/factures` | Toutes les factures — filtres statut + recherche | ✅ Done |
| `/cashier-manager/annulations` | File d'attente annulations — modal approbation/rejet | ✅ Done |
| `/cashier-manager/recette` | Recette globale + par caissier (onglets) | ✅ Done |
| `/cashier-manager/prestations` | CRUD prestations — add/edit via modal | ✅ Done |
| `/cashier-manager/assurances` | CRUD assurances — add/edit via modal | ✅ Done |

### Agent magasinier (`/storekeeper`)

| Route | Description | Status |
|---|---|---|
| `/storekeeper` | Dashboard — alerte rupture, liste stock, nav cards | ✅ Done |
| `/storekeeper/articles/[id]` | Fiche article — qté, seuil, historique mouvements | ✅ Done |
| `/storekeeper/entree` | Saisie entrée de stock — article, qté, fournisseur, BL | ✅ Done |
| `/storekeeper/ajustement` | Ajustement stock (+/-) avec motif obligatoire | ✅ Done |
| `/storekeeper/transferts` | Transferts pharmacie — onglets nouveau + historique | ✅ Done |
| `/storekeeper/alertes` | Alertes rupture — Commander → /entree | ✅ Done |

### Ressources humaines (`/hr`)

| Route | Description | Status |
|---|---|---|
| `/hr` | Dashboard — nav cards médecins, spécialités, utilisateurs | ✅ Done |
| `/hr/medecins` | Liste médecins + add/edit via modal | ✅ Done |
| `/hr/specialites` | Catalogue spécialités — add + suppression | ✅ Done |
| `/hr/utilisateurs` | Comptes utilisateurs — add/edit/activer-désactiver | ✅ Done |

### Promoteur / Directeur (`/director`)

| Route | Description | Status |
|---|---|---|
| `/director` | Dashboard — KPI globaux, répartition revenus, nav cards | ✅ Done |
| `/director/stats` | Statistiques — revenus, évolution 6 mois, par spécialité, par médecin | ✅ Done |
| `/director/utilisateurs` | Gestion complète comptes (+ suppression vs HR) | ✅ Done |
| `/director/roles` | Rôles système — permissions par rôle, nb utilisateurs | ✅ Done |

## Recommended implementation order

1. Shared shell and navigation.
2. Login and role selection.
3. Cashier workflow because it drives the core business process.
4. Stock workflow because it is linked to invoice validation.
5. Cash manager workflow.
6. Director dashboard and analytics.
7. HR administration screens.

## Per-page breakdown

### `/` Role selection

- Application branding.
- Short project statement.
- Cards for each role.
- Clear access to login.

### `/login`

- Authentication form.
- Validation and error messages.
- Role-based redirect after login.

### `/cashier`

- Patient search and registration.
- Insurance information.
- Invoice builder with lines and pricing.
- Doctor selection for prescription and execution.
- Payment panel with partial payments.
- Cancellation request flow.
- Printable invoice summary.

### `/cashier-manager`

- Daily receipts by cashier.
- Invoice status monitoring.
- Cancellation approval or rejection.
- Cash closing summary.

### `/storekeeper`

- Central stock state.
- Entry, exit and transfer movements.
- Threshold and rupture alerts.
- Movement history.

### `/director`

- Global indicators.
- Revenue and trend charts.
- Breakdown by specialty and doctor.
- Stock and cashier supervision.

### `/hr`

- Staff directory.
- Create and edit user accounts.
- Role management.
- Enable and disable access.

## UI standards

- Reuse shadcn/ui components for all common patterns.
- Keep forms compact and task-oriented.
- Display status tags for invoice and stock states.
- Use a sidebar on workspace pages and simple entry points on public pages.
- Preserve French labels for the user-facing interface.

## Progress log

- 2026-06-23: shadcn/ui dépendances installées, Montserrat + thème vert #004D40, tracker créé.
- 2026-06-23: Erreur compile globals.css corrigée (`bg-background`), lint vert.
- 2026-06-23: Toutes les pages cashier, cashier-manager, storekeeper, hr, director, profil, notifications créées.
- 2026-06-23: Lint final — 0 erreur ESLint. Implémentation complète (35 routes). Modals pour tous les formulaires.
- 2026-06-23: All remaining pages implemented — `/login`, `/cashier-manager`, `/director`, `/storekeeper`, `/hr`. All placeholder components replaced. Lint passes with zero errors.
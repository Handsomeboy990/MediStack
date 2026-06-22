# Database, Backend

DBMS: PostgreSQL. ORM: Prisma. The source of truth schema is
[prisma/schema.prisma](../prisma/schema.prisma). Columns are named in
snake_case, tables in the plural form.

## Tables

### roles
Application roles. Initial values are loaded by the seed.

| Column | Type | Notes |
| --- | --- | --- |
| id | int | PK auto |
| code | text | unique (PROMOTEUR, RESP_CAISSE, AGENT_CAISSE, AGENT_MAGASIN, RH) |
| libelle | text | display label (kept in French) |
| description | text | nullable |

### users
Staff accounts.

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| nom, prenom | text | |
| email | text | unique |
| telephone | text | nullable |
| mot_de_passe | text | hashed |
| actif | bool | default true |
| role_id | int | FK roles |

### assurances
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| nom | text | |
| taux_couverture | decimal(5,2) | coverage percentage |
| actif | bool | |

### patients
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| matricule | text | unique |
| nom, prenom | text | |
| date_naissance | timestamp | nullable |
| sexe, telephone, adresse | text | nullable |
| assurance_id | uuid | FK assurances, nullable |

### patient_contacts
Emergency contact persons of a patient. A patient may register one or two
contacts; the limit is enforced in the application layer.

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| patient_id | uuid | FK patients, cascade |
| nom | text | |
| prenom | text | nullable |
| telephone | text | |
| lien | text | nullable (relationship: parent, spouse, friend, and so on) |

### specialites
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| code | text | unique |
| libelle | text | |

### medecins
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| nom, prenom, telephone | text | |
| specialite_id | uuid | FK specialites, nullable |

### prestations
Billable acts.

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| code | text | unique |
| libelle | text | |
| prix | decimal(12,2) | |
| actif | bool | |
| medecin_id | uuid | FK medecins, nullable |

### stock_magasin_central
Central warehouse items.

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| code | text | unique |
| libelle | text | |
| unite | text | nullable |
| quantite | int | |
| seuil_alerte | int | triggers replenishment alerts |
| prix_unitaire | decimal(12,2) | |

### mouvements_stock
Movement history (ENTREE, SORTIE, AJUSTEMENT).

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| article_id | uuid | FK stock_magasin_central |
| type | text | ENTREE, SORTIE, AJUSTEMENT |
| quantite | int | |
| motif | text | nullable |
| agent_id | uuid | FK users, nullable |

### factures
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| numero | text | unique |
| patient_id | uuid | FK patients |
| medecin_id | uuid | FK medecins, nullable |
| agent_id | uuid | FK users (cashier) |
| montant_total | decimal(12,2) | |
| montant_paye | decimal(12,2) | |
| statut | text | EN_ATTENTE, PAYEE, PARTIELLE, ANNULEE |

### facture_lignes
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| facture_id | uuid | FK factures, cascade |
| prestation_id | uuid | FK prestations, nullable |
| designation | text | |
| quantite | int | |
| prix_unitaire | decimal(12,2) | |
| montant_ligne | decimal(12,2) | |

### paiements
Modes: ESPECES, MOBILE_MONEY, CARTE, ASSURANCE.

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| facture_id | uuid | FK factures |
| montant | decimal(12,2) | |
| mode | text | |
| reference | text | nullable (for example a Mobile Money reference) |
| agent_id | uuid | FK users |

### demandes_annulation
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| facture_id | uuid | FK factures |
| motif | text | |
| statut | text | EN_ATTENTE, APPROUVEE, REFUSEE |
| demandeur_id | uuid | FK users |
| traiteur_id | uuid | FK users, nullable |
| traite_le | timestamp | nullable |

## Main relationships

- A patient belongs to at most one insurance.
- A patient may have one or two emergency contacts.
- A doctor belongs to at most one specialty.
- An invoice belongs to a patient, is issued by an agent, and contains several
  lines and several payments.
- A cancellation request targets an invoice, raised by a requester and handled
  by a manager.
- Each stock movement references a central warehouse item.

## Migrations

Migrations are managed by Prisma Migrate (`npm run prisma:migrate`). The initial
seed loads the five application roles.

## Note on naming

Enumerated values (statuses, modes, movement types) and some column names keep
their French wording because they belong to the business domain and are reused
as is in the user interface. Code, comments and documentation are in English.

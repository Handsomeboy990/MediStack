# Règles de développement, MediTrust

Ce fichier rassemble les règles de développement du projet MediTrust. Il est
versionné et fait référence pour toute l'équipe.

MediTrust est un projet réalisé pour le hackathon MTN Bénin x Ministère de la
Santé (Y'ello Care, 22 au 24 juin 2026).

## 1. Identité et Git
- Messages de commit en anglais, courts, clairs, sans emojis
- Aucune mention d'outil d'IA dans les commits, le code, les commentaires ou les PR (pas de "Co-Authored-By", pas de "Generated with...")
- Commits atomiques, un changement logique = un commit
- Créer la branche feature avant le premier commit, jamais sur main ou dev directement
- Ne jamais committer les fichiers internes de travail (notes de session, etc.)
- Descriptions de PR en anglais

## 2. Règles de code
- Aucun emoji nulle part
- Aucun tiret cadratin nulle part
- Découper les fichiers : viser moins de ~150 lignes par composant/module
- Code cohérent avec les conventions du projet (PascalCase composants, kebab-case
  services/helpers, camelCase variables, snake_case colonnes DB, UPPER_SNAKE_CASE constantes)
- Français : toujours avec accents (é, è, ê, à, â, î, ô, û, ç, œ), y compris dans les fichiers i18n

## 3. Stack
- Backend : NestJS (TypeScript), architecture modulaire par domaine métier
- Frontend : Next.js (TypeScript), App Router
- Monorepo avec workspace (npm workspaces), dossiers backend et frontend a la racine
- Déploiement prévu : Frontend vers Vercel, Backend vers Railway (ou équivalent supportant Node persistant)

## 4. Workflow (une tâche à la fois)
1. Une seule tâche à la fois
2. Après chaque tâche : commit, revue de code, validation des entrées,
   audit sécurité, audit qualité frontend (si applicable), attendre validation
   explicite avant de poursuivre

## 5. Branches et protection
- main et dev sont protégées : push direct interdit, Pull Request obligatoire,
  au moins une approbation requise, force-push et suppression interdits
- Flux : feature -> PR vers dev -> PR vers main
- Format de branche : type/courte-description-en-anglais-kebab-case
- Types autorisés : feature, fix, chore, docs, refactor, test
- Exemples : feature/invoice-locking, fix/stock-decrement-bug, docs/api-conventions
- Une branche = une tâche, jamais plusieurs sujets mélangés
- Jamais de branche nommée directement avec un nom de personne ou une date seule

## 6. Économie et communication
- Concis, sans préambule ni récap inutile
- Rapporter les résultats honnêtement (tests qui passent/échouent, étapes sautées)
- Confirmer avant toute action difficilement réversible (publication, suppression, push)

## 7. Conventions API (contrat backend/frontend)
- Toutes les routes API en kebab-case, préfixées /api, versionnées si possible (/api/v1/...)
- Réponses JSON toujours enveloppées dans une structure cohérente, par exemple :
  succès : { data: ..., meta: ... }
  erreur : { error: { code: string, message: string, details: ... } }
- Codes HTTP corrects et cohérents : 200 lecture, 201 création, 204 suppression sans contenu,
  400 validation, 401 non authentifié, 403 non autorisé, 404 non trouvé, 409 conflit, 500 erreur serveur
- Pagination standard sur les listes : query params page et limit, réponse incluant total et totalPages
- Dates toujours en ISO 8601 avec offset, jamais de format local ambigu
- Validation des entrées côté backend systématique (DTO avec class-validator côté NestJS),
  jamais de confiance aveugle dans ce qui vient du frontend
- Le frontend ne doit jamais afficher un message d'erreur technique brut (code HTTP, stack trace,
  chemin d'endpoint) à l'utilisateur final ; toujours un message traduit et compréhensible
- Le frontend consomme l'API via une couche d'abstraction unique (client HTTP centralisé,
  pas d'appels fetch ou axios dispersés dans les composants)
- Toute nouvelle route doit être documentée dans backend/docs/FEATURES.md au moment
  où elle est créée, pas après coup

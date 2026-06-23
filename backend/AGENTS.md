# CLAUDE.md, MediTrust Backend

Single source of guidance for any AI assistant working on the MediTrust backend.
This file is local only (gitignored) and is never committed.

Authoritative project rules live in `../CONTRIBUTING.md`. This file does not
duplicate them, it summarizes what matters for backend work and references them.

## 1. Project

MediTrust is the backend of a billing and stock management platform for health
centers, built for the MTN Benin x Ministry of Health hackathon (Y'ello Care).
It is a REST API consumed by a Next.js frontend.

- Monorepo (npm workspaces): `backend/` (this app) and `frontend/` (Next.js).
- Cross cutting docs: `../docs/OVERVIEW.md`.
- Backend domain docs: `docs/db_schema.yml`, `docs/ROLE_AND_PERMISSIONS.md`,
  `docs/FEATURES.md`, `docs/ARCHITECTURE.md`, `docs/API_CONVENTIONS.md`.

## 2. Tech stack

- NestJS 10.4 (TypeScript 5.5), modular architecture by business domain.
- Prisma 5.18 ORM over PostgreSQL (Neon). DB columns mapped to snake_case.
- Validation: class-validator and class-transformer (global `ValidationPipe`).
- Tests: Jest. Lint: ESLint.
- API served under the `api/v1` prefix (see `src/main.ts`).
- Deployment: backend to Railway, frontend to Vercel.

## 3. Important: current code state

The existing Prisma schema and modules use French names (`Facture`, `Paiement`,
`Prestation`, `Patient`, modules `factures/`, `paiements/`, ...). This is
OBSOLETE and will be refactored later.

- Target naming is English everywhere.
- The authoritative business model is `docs/db_schema.yml` and
  `docs/ROLE_AND_PERMISSIONS.md` (both in English).
- Every new entity, module, route, and field MUST use English. Do not follow the
  current French naming when adding new code.

The backend is still a skeleton: most modules expose only read (`GET`) endpoints,
auth has no password hashing or JWT yet, RBAC is not enforced, and there are no
tests. Treat these as the work ahead, not as patterns to copy.

## 4. Features and business domains

- Auth and RBAC: login, JWT, role and permission enforcement.
- Users: staff accounts linked to a role.
- Patients (`personnes`) and insurance organisations, with patient to insurance
  membership (discount, validity period).
- Service catalog: services grouped by category (consultation, laboratory,
  radiology, pharmacy, blood_bank), with department and speciality references.
- Tarification: versioned price catalog per service.
- Invoicing: `invoices` with `invoice_items`, prescribing and executing doctors,
  totals split between insurance and patient.
- Payments: `paiements` per invoice (cash, mobile_money, cheque), supporting
  partial and multiple payments, with status pending/completed/failed.
- Invoice cancellation workflow: requests with status pending/approved/rejected.
- Stock: central inventory with stock transactions (add, remove, transfer, sold)
  and low stock alerts.
- Statistics and revenue reporting: own / cashier / global scopes, plus stats by
  specialty, doctor, and period.

## 5. Architecture and target structure

```
src/
├── common/        # constants, decorators (metadata|responses|validations|requests),
│                  # exceptions, filters, guards, interceptors, interfaces,
│                  # middlewares, pipes, utils
├── core/          # logger, cache, services, jobs (consumers|producers), core.module.ts
├── prisma/        # PrismaModule + PrismaService (already present, keep it)
└── modules/       # one folder per domain:
                   #   <module>.controller.ts | .service.ts | .module.ts
                   #   dto/, interfaces/, repositories/
```

Layered request flow:

`Controller` (HTTP, DTO validation) -> `Service` (business logic) ->
`Repository` / `PrismaService` (data access).

- Never call Prisma directly from a controller. Keep data access in services or
  repositories.
- Reuse the existing building blocks instead of recreating them:
  - `src/common/interceptors/response.interceptor.ts` (response envelope)
  - `src/common/filters/http-exception.filter.ts` (error normalization)
  - `src/common/dto/pagination-query.dto.ts` (pagination)
  - `src/prisma/prisma.service.ts` (PrismaClient wrapper)
  - global `api/v1` prefix and `ValidationPipe` from `src/main.ts`

## 6. Naming conventions

English everywhere for domain concepts.

- Classes: PascalCase.
- Files, services, helpers: kebab-case.
- Variables and functions: camelCase.
- DB columns: snake_case (via Prisma `@map`).
- Constants: UPPER_SNAKE_CASE.
- NestJS file suffixes: `*.controller.ts`, `*.service.ts`, `*.module.ts`,
  `*.dto.ts`, `*.guard.ts`, `*.interceptor.ts`, `*.pipe.ts`, `*.filter.ts`.
- Permissions: `resource:action` (for example `invoice:create`, `stock:transfer`).
- Roles: `super_admin`, `cash_manager`, `cashier`, `store_keeper`, `hr_manager`.

## 7. API conventions (summary of CONTRIBUTING section 7)

- Routes in kebab-case, prefixed and versioned under `/api/v1`.
- Success response envelope: `{ data, meta }`.
- Error response envelope: `{ error: { code, message, details } }`.
- HTTP status codes: 200 read, 201 create, 204 delete no content, 400 validation,
  401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 500 server error.
- List pagination: query params `page` and `limit`, response includes `total` and
  `totalPages`.
- Dates: ISO 8601 with offset, never ambiguous local formats.
- Backend input validation is mandatory (DTOs with class-validator). Never trust
  frontend input blindly.
- Document every new route in `docs/FEATURES.md` at creation time, not afterwards.

## 8. RBAC

- 5 roles (see section 6) and granular `resource:action` permissions.
- `docs/ROLE_AND_PERMISSIONS.md` is the reference matrix of roles to permissions.
- Enforce access with NestJS Guards under `src/common/guards/` once JWT auth is in
  place. Do not scatter authorization checks inside controllers or services.

## 9. Best practices

- Keep files small, aim for under ~150 lines per component or module.
- One task at a time, atomic commits, one logical change per commit.
- Commit messages and PR descriptions in English, short and clear.
- No AI tool mentions anywhere in commits, code, comments, or PRs (no
  "Co-Authored-By", no "Generated with...").
- No emojis and no em-dashes anywhere.
- French user facing text always with accents (UI and i18n).
- Branch naming: `type/short-description-kebab-case`, where type is one of
  feature, fix, chore, docs, refactor, test. Flow: feature -> PR to dev -> PR to
  main. Never push directly to `main` or `dev`.

## 10. Useful commands

```bash
npm run start:dev          # run the API in watch mode
npm run build              # compile to dist/
npm run lint               # ESLint
npm test                   # Jest

npm run prisma:generate    # regenerate Prisma client
npm run prisma:migrate     # apply/create migrations
npm run prisma:studio      # open Prisma Studio
npm run prisma:seed        # seed the database
```

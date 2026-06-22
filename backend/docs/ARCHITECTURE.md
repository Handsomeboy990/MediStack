# Architecture, Backend

## Principles

The backend follows a modular NestJS architecture, organized by business domain.
Each domain is isolated in a self contained module (controller, service, DTO),
which makes the code easier to evolve and test.

## Layers

- Controllers: expose the HTTP routes, validate input through DTOs, delegate to
  the service. No business logic.
- Services: hold the business logic and data access through Prisma.
- Data access: `PrismaService` (singleton, global module) wraps the Prisma
  client and the connection lifecycle.

## Cross cutting layer (common)

- `ResponseInterceptor`: wraps success responses in `{ data, meta }`.
- `HttpExceptionFilter`: normalizes errors to `{ error: { code, message, details } }`.
- `PaginationQueryDto` and `buildMeta`: standard list pagination.
- `HealthController`: liveness probe.

## Business modules

| Module | Responsibility |
| --- | --- |
| auth | Authentication and token issuance |
| users | Staff accounts and roles |
| patients | Patient records, insurances and emergency contacts |
| prestations | Catalog of billable services |
| factures | Invoices and invoice lines |
| paiements | Payments and cancellation requests |
| stock | Central warehouse and stock movements |
| statistiques | Indicators and dashboards |

## Request flow

1. The request reaches the API under the `/api/v1` prefix.
2. The global `ValidationPipe` validates and transforms input according to the DTO.
3. The controller calls the service.
4. The service queries PostgreSQL through Prisma.
5. `ResponseInterceptor` formats the response, or `HttpExceptionFilter` formats
   the error.

## Technical choices

- Prisma ORM for type safety and fast setup.
- Validation with `class-validator` and `class-transformer`.
- Configuration through `@nestjs/config` (environment variables).

## Current state

Functional skeleton: every module starts and exposes at least one paginated read
endpoint. The full business logic (invoice creation, payment collection, stock
decrement, cancellation rules) is still to be implemented.

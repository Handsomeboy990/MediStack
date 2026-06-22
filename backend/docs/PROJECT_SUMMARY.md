# Project summary, Backend

## Goal

Provide the MediTrust API: cash desk, billing, payment and stock management for
a health center, with role based steering.

## Context

Built for the MTN Benin x Ministry of Health hackathon (Y'ello Care, 22 to 24
June 2026).

## Stack

- NestJS (TypeScript), modular architecture by domain
- PostgreSQL through Prisma
- Validation with class-validator, configuration with @nestjs/config

## Target scope

- Authentication and role management (Director, Cash manager, Cashier,
  Storekeeper, HR)
- Patient records, insurances and emergency contacts
- Catalog of services and doctors
- Billing, invoice lines, multi mode payments
- Cancellation requests with an approval workflow
- Central warehouse stock and movements
- Summary statistics

## Current state

Functional skeleton that starts. Modules in place with paginated reads. The
business logic (creation, transactions, cancellation rules, stock decrement)
is still to be implemented. External integrations (for example SYGMEF) are not
wired yet.

## Next

See [FEATURES.md](FEATURES.md) for the list of functions to implement.

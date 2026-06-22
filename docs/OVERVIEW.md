# MediTrust overview

Cross cutting documentation for the monorepo. For technical details, see the
documentation of each application.

## Context

MediTrust is built during the MTN Benin x Ministry of Health hackathon
(Y'ello Care, 22 to 24 June 2026). The goal is to provide a simple and reliable
tool for the cash desk and stock of a health center, usable outside of a heavy
IT environment.

## Business domains

- Patients and insurances
- Doctors and specialties
- Services (billable acts)
- Billing and invoice lines
- Payments and cancellation requests
- Central warehouse stock and stock movements
- Statistics and steering

## Backend / frontend contract

The API contract is described in
[backend/docs/API_CONVENTIONS.md](../backend/docs/API_CONVENTIONS.md).
The frontend consumes the API only through a single centralized HTTP client.

## Useful links

- Development rules: [../CLAUDE.md](../CLAUDE.md)
- Backend architecture: [../backend/docs/ARCHITECTURE.md](../backend/docs/ARCHITECTURE.md)
- Data schema: [../backend/docs/DATABASE.md](../backend/docs/DATABASE.md)
- Frontend architecture: [../frontend/docs/ARCHITECTURE.md](../frontend/docs/ARCHITECTURE.md)

# Features and routes, Backend

Every new route must be added here at the moment it is created. Common prefix:
`/api/v1`. Responses use the `{ data, meta }` format, errors use the
`{ error: { code, message, details } }` format.

## Available routes (skeleton)

| Method | Route | Description | Status |
| --- | --- | --- | --- |
| GET | /api/v1/health | Liveness probe | Working |
| POST | /api/v1/auth/login | Authentication (skeleton, no token issued yet) | Placeholder |
| GET | /api/v1/users | Paginated staff list | Read only |
| GET | /api/v1/patients | Paginated patient list | Read only |
| GET | /api/v1/prestations | Paginated service list | Read only |
| GET | /api/v1/factures | Paginated invoice list (with lines) | Read only |
| GET | /api/v1/paiements | Paginated payment list | Read only |
| GET | /api/v1/stock | Paginated central warehouse item list | Read only |
| GET | /api/v1/statistiques/resume | Summary indicators | Working |

## Pagination

List routes accept `page` (default 1) and `limit` (default 20, maximum 100). The
response includes `meta` with `page`, `limit`, `total`, `totalPages`.

## To implement

- auth: password hashing, verification, token issuance and validation, role
  based guards.
- patients: creation, update, search by matricule, registration of one or two
  emergency contacts.
- prestations: catalog management (creation, activation, pricing).
- factures: creation with lines, total computation, locking after payment.
- paiements: multi mode collection, remaining balance handling, cancellation
  requests and approval workflow.
- stock: inbound, outbound, adjustments, threshold alerts, automatic decrement.
- statistiques: revenue per period, per payment mode, per agent.

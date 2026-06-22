# API conventions, Backend

This document details the rules of section 8 of the CLAUDE.md file, with concrete
examples of MediTrust routes.

## Naming and versioning

- Every route is in kebab-case, prefixed with `/api`, versioned: `/api/v1/...`.
- Examples: `/api/v1/patients`, `/api/v1/factures`, `/api/v1/demandes-annulation`.

## Response format

Success:

```json
{
  "data": { "id": "...", "numero": "F-2026-0001" },
  "meta": null
}
```

Paginated list:

```json
{
  "data": [ { "id": "..." } ],
  "meta": { "page": 1, "limit": 20, "total": 134, "totalPages": 7 }
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The email field is invalid",
    "details": ["email must be an email"]
  }
}
```

## HTTP codes

| Code | Usage |
| --- | --- |
| 200 | Successful read |
| 201 | Successful creation |
| 204 | Deletion with no content |
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Conflict (for example an invoice number already used) |
| 500 | Server error |

## Pagination

- Query parameters: `page` (default 1), `limit` (default 20, maximum 100).
- Example: `GET /api/v1/factures?page=2&limit=50`.
- The response includes `meta.total` and `meta.totalPages`.

## Dates

Always in ISO 8601 with offset, for example `2026-06-22T09:30:00+01:00`. Never an
ambiguous local format.

## Validation

- Every input is validated by a `class-validator` DTO.
- The global `ValidationPipe` rejects undeclared fields (`forbidNonWhitelisted`).
- The backend never blindly trusts data coming from the frontend.

## MediTrust route examples

| Method | Route | Description |
| --- | --- | --- |
| POST | /api/v1/auth/login | Authentication |
| GET | /api/v1/patients | Paginated patient list |
| POST | /api/v1/patients | Create a patient with up to two contacts (201) |
| GET | /api/v1/patients/:id | Patient detail (404 if missing) |
| POST | /api/v1/factures | Create an invoice with lines (201) |
| POST | /api/v1/factures/:id/paiements | Collect a payment |
| POST | /api/v1/demandes-annulation | Request an invoice cancellation |
| POST | /api/v1/stock/:id/mouvements | Stock movement (inbound, outbound) |
| GET | /api/v1/statistiques/resume | Summary indicators |

## Errors on the frontend side

The frontend must never display a raw technical message (HTTP code, stack trace,
endpoint path). It translates the `error.code` field into a message the user can
understand.

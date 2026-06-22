# Data flow, Frontend

## Why this document

The frontend has no database of its own. Documenting a client side database
schema would make no sense. This file therefore replaces `DATABASE.md` with
`DATA_FLOW.md`, which describes how data flows between the interface and the API.
The source of truth schema is on the backend side:
[backend/docs/DATABASE.md](../../backend/docs/DATABASE.md).

## Data circulation

```
Component (UI)
  -> call to apiClient (src/lib/api-client.ts)
  -> HTTP request to NEXT_PUBLIC_API_URL
  -> NestJS API
  -> response { data, meta } or { error }
  -> apiClient returns ApiResponse or throws ApiError
  -> the component displays the data or a translated message
```

## Rules

- Single access source: `apiClient`. No scattered `fetch` or `axios`.
- Expected response format: `{ data, meta }`.
- Expected error format: `{ error: { code, message, details } }`.
- Pagination: lists read `meta.page`, `meta.limit`, `meta.total`,
  `meta.totalPages`.
- Received dates are ISO 8601; local formatting happens at display time.

## Local state and cache

At the skeleton stage, no global state manager is imposed. During
implementation, server state may be handled by a data fetching library (for
example a request cache), always on top of `apiClient`.

## Security of displayed data

Technical error messages are never displayed. Translation goes through
`src/lib/error-messages.ts`.

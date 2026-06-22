# Architecture, Frontend

## Principles

Next.js application with the App Router and TypeScript. The interface is
organized by application role. Styling is handled with Tailwind CSS.

## Folder layout

| Folder | Role |
| --- | --- |
| `src/app` | Routes (home, login, one folder per role space) |
| `src/components` | Reusable components (cards, screen templates) |
| `src/lib` | HTTP client, configuration, role definitions, error messages |

## Routing

App Router with static routes per role:

- `/`: role selection
- `/login`: login
- `/director`, `/cashier-manager`, `/cashier`, `/storekeeper`, `/hr`

The route slugs are in English; the labels shown to the user are in French.

## Data access

Everything goes through `src/lib/api-client.ts`, a single abstraction layer on
top of `fetch`. This client:

- prefixes calls with `NEXT_PUBLIC_API_URL`,
- expects the `{ data, meta }` format,
- throws a typed `ApiError` on failure.

Components never call `fetch` directly.

## Error handling

`src/lib/error-messages.ts` translates error codes (`error.code`) into messages
the user can understand. The user never sees a raw technical message.

## Conventions

- Components in PascalCase, helpers and files in kebab-case.
- User facing text in French with accents.
- Short components (target below 150 lines).

## Current state

Skeleton of role screens as placeholders. Login, forms and data lists will be
wired to the API later.

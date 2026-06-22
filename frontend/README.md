# MediTrust, Frontend

Web interface of MediTrust, built with Next.js (App Router, TypeScript,
Tailwind CSS).

## Requirements

- Node.js 20 or later
- npm 10 or later
- The MediTrust backend reachable (default `http://localhost:3001`)

## Local installation

From the monorepo root:

```bash
npm install
cp frontend/.env.example frontend/.env.local
```

## npm scripts

- `dev`: development server (port 3000)
- `build`: production build
- `start`: production server (after build)
- `lint`: Next ESLint analysis

## Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the API consumed by the HTTP client | `http://localhost:3001/api/v1` |

## Run

```bash
npm run dev:frontend
```

The application is available at `http://localhost:3000`.

## Layout

- `src/app`: App Router routes (home, login, role spaces)
- `src/components`: reusable components
- `src/lib`: centralized HTTP client, configuration, roles, error messages

The frontend consumes the API only through `src/lib/api-client.ts`. No direct
`fetch` call should be made in components.

## User facing language

The interface text shown in the browser is in French (with accents). Code,
comments, documentation and folder names are in English.

## Documentation

See the [docs/](docs/) folder:
[ARCHITECTURE](docs/ARCHITECTURE.md), [DATA_FLOW](docs/DATA_FLOW.md),
[FEATURES](docs/FEATURES.md), [INSTALLATION](docs/INSTALLATION.md),
[DEPLOYMENT](docs/DEPLOYMENT.md), [PROJECT_SUMMARY](docs/PROJECT_SUMMARY.md),
[TESTING_STRATEGY](docs/TESTING_STRATEGY.md).

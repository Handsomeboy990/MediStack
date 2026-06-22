# MediTrust, Backend

REST API of MediTrust, built with NestJS and PostgreSQL (Prisma).

## Requirements

- Node.js 20 or later
- npm 10 or later
- A reachable PostgreSQL instance

## Local installation

From the monorepo root, dependencies are installed for every workspace:

```bash
npm install
```

Configure the environment variables:

```bash
cp backend/.env.example backend/.env
```

Generate the Prisma client and apply the schema to the database:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run prisma:seed --workspace backend
```

## npm scripts

- `start:dev`: start in watch mode
- `start`: plain start
- `start:prod`: run the build (`dist/main.js`)
- `build`: NestJS compilation
- `lint`: ESLint static analysis
- `test`: Jest tests
- `prisma:generate`: generate the Prisma client
- `prisma:migrate`: create and apply migrations in development
- `prisma:studio`: database browser
- `prisma:seed`: load the initial data (roles)

## Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma | `postgresql://user:pass@localhost:5432/meditrust` |
| `PORT` | API listening port | `3001` |
| `FRONTEND_ORIGIN` | Allowed frontend origin (CORS) | `http://localhost:3000` |
| `NODE_ENV` | Runtime environment | `development` |

## Run

```bash
npm run dev:backend
```

The API exposes its routes under the `/api/v1` prefix. Liveness probe:
`GET /api/v1/health`.

## Documentation

See the [docs/](docs/) folder:
[ARCHITECTURE](docs/ARCHITECTURE.md), [DATABASE](docs/DATABASE.md),
[FEATURES](docs/FEATURES.md), [INSTALLATION](docs/INSTALLATION.md),
[DEPLOYMENT](docs/DEPLOYMENT.md), [PROJECT_SUMMARY](docs/PROJECT_SUMMARY.md),
[TESTING_STRATEGY](docs/TESTING_STRATEGY.md),
[API_CONVENTIONS](docs/API_CONVENTIONS.md).

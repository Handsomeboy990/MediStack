# Installation, Backend

## Requirements

- Node.js 20 or later
- npm 10 or later
- PostgreSQL 14 or later

## Steps

1. Install the dependencies from the monorepo root:

```bash
npm install
```

2. Create the environment file:

```bash
cp backend/.env.example backend/.env
```

Set `DATABASE_URL` with the connection string of your PostgreSQL instance.

3. Provision a local PostgreSQL database (example with Docker):

```bash
docker run --name meditrust-db -e POSTGRES_USER=meditrust \
  -e POSTGRES_PASSWORD=meditrust -e POSTGRES_DB=meditrust \
  -p 5432:5432 -d postgres:16
```

4. Generate the Prisma client and apply the schema:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run prisma:seed --workspace backend
```

5. Start the server in development mode:

```bash
npm run dev:backend
```

## Verification

```bash
curl http://localhost:3001/api/v1/health
```

The expected response contains `status: ok`.

## Troubleshooting

- Database connection error: check that PostgreSQL is listening and that
  `DATABASE_URL` is correct.
- Missing Prisma client: rerun `npm run prisma:generate --workspace backend`.

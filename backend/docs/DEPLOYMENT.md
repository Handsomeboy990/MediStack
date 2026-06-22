# Deployment, Backend (Railway)

Target: Railway, which supports a persistent Node service and a managed
PostgreSQL database.

## Overview

1. Railway PostgreSQL service, which provides `DATABASE_URL`.
2. Node backend service, NestJS build then start of `dist/main.js`.

## Environment variables to set on Railway

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | provided by the Railway PostgreSQL plugin |
| `PORT` | injected by Railway, read by the application |
| `FRONTEND_ORIGIN` | URL of the Vercel frontend |
| `NODE_ENV` | `production` |

## Steps

1. Create a Railway project and add the PostgreSQL plugin.
2. Connect the repository and point the service at the `backend` folder.
3. Build and start commands:

```bash
# Build
npm install && npm run prisma:generate --workspace backend && npm run build --workspace backend

# Start
npm run start:prod --workspace backend
```

4. Apply migrations in production:

```bash
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

## Notes

- The application reads `process.env.PORT`. Do not hardcode the port.
- The fine grained CORS configuration (restrict to `FRONTEND_ORIGIN`) will be
  enabled before production. At the skeleton stage, CORS is permissive.
- Provide a health probe on `/api/v1/health`.

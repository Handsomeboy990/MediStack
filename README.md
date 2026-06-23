# MediTrust

Cash desk, billing and stock management platform for health centers, built for
the MTN Benin x Ministry of Health hackathon (Y'ello Care, 22 to 24 June 2026).

MediTrust digitizes the cash desk journey of a health center: patient
registration, billing of services, payment collection, central warehouse stock
tracking, and role based dashboards.

## Tech stack

- Backend: NestJS (TypeScript), PostgreSQL via Prisma
- Frontend: Next.js (App Router, TypeScript, Tailwind CSS)
- Monorepo: npm workspaces (`backend`, `frontend`)
- Deployment targets: backend on Railway, frontend on Vercel

## Application roles

- Director (admin): global view, statistics, supervision
- Cash manager: cash operations oversight and approvals
- Cashier: patient registration, billing, payment collection
- Storekeeper: central warehouse stock management
- HR: staff and access management

## Monorepo layout

```
.
├── backend/         NestJS, REST API, PostgreSQL (Prisma)
├── frontend/        Next.js, role based interfaces
├── docs/            Cross cutting documentation
├── README.md        This file
├── LICENSE          MIT license
└── package.json     Workspaces configuration
```

## Quick start

Requirements: Node.js 20 or later, npm 10 or later, a PostgreSQL instance.

```bash
# Install all monorepo dependencies
npm install

# Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Run the backend (default port 3001)
npm run dev:backend

# Run the frontend (default port 3000)
npm run dev:frontend
```

## Documentation

- Development rules: [CONTRIBUTING.md](CONTRIBUTING.md)
- Backend: [backend/README.md](backend/README.md) and [backend/docs/](backend/docs/)
- Frontend: [frontend/README.md](frontend/README.md) and [frontend/docs/](frontend/docs/)

## License

Released under the MIT license. See [LICENSE](LICENSE).

# Installation, Frontend

## Requirements

- Node.js 20 or later
- npm 10 or later
- MediTrust backend reachable (default `http://localhost:3001`)

## Steps

1. Install the dependencies from the monorepo root:

```bash
npm install
```

2. Create the local environment file:

```bash
cp frontend/.env.example frontend/.env.local
```

Set `NEXT_PUBLIC_API_URL` if the API is not on the default address.

3. Start the development server:

```bash
npm run dev:frontend
```

The application is available at `http://localhost:3000`.

## Production build

```bash
npm run build --workspace frontend
npm run start --workspace frontend
```

## Troubleshooting

- Network error page: check that the backend is running and that
  `NEXT_PUBLIC_API_URL` points to the right host.
- Missing styles: check the Tailwind configuration and that `globals.css` is
  imported in `src/app/layout.tsx`.

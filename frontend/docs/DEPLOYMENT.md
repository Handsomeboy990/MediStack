# Deployment, Frontend (Vercel)

Target: Vercel, native Next.js support.

## Vercel project configuration

- Project root directory: `frontend`.
- Detected framework: Next.js.
- Build command: `next build` (default).
- Install command: `npm install` at the monorepo root.

## Environment variables

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Public URL of the backend API (Railway), suffixed with `/api/v1` |

Example: `https://meditrust-api.up.railway.app/api/v1`.

## Steps

1. Connect the repository to Vercel.
2. Set the root directory to `frontend`.
3. Set `NEXT_PUBLIC_API_URL` in the Vercel environment variables.
4. Trigger the deployment.

## Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put a
  secret there.
- Check that the backend allows the Vercel origin (CORS) before production.
- Each branch can generate a preview deployment.

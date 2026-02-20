# API (Hono)

Hono API app. Serves the headless form endpoint (POST /f/:formIdOrSlug) and deploys to Vercel.

## Endpoints

- `GET /` — API info
- `GET /health` — Health check
- `POST /f/:formIdOrSlug` — Headless form submission (Formspree-style). Accepts `application/x-www-form-urlencoded` or `multipart/form-data`; field names should match form question titles (or ids). Uses Convex to resolve the form and submit the response.

## Env

- **CONVEX_URL** (required for /f/): Your Convex deployment URL (e.g. `https://your-deployment.convex.cloud`). Set in Vercel project env (or `.env` locally).

## Local

- From repo root: `bun run dev` (runs all apps via Turbo), or
- From this app: `bun run dev` (uses `vercel dev` for local behavior matching Vercel). Set `CONVEX_URL` in `.env`.

## Deploy to Vercel

1. Create a new project from the same Git repo.
2. Set **Root Directory** to `apps/api`.
3. Add **CONVEX_URL** in the project’s environment variables.
4. Deploy. Vercel detects Hono and uses the default export from `src/index.ts`.

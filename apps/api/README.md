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

The app is ready for Vercel (zero-config Hono):

1. **New project** — Import your Git repo and create a new project.
2. **Root Directory** — Set to `apps/api`.
3. **Environment variables** — Add `CONVEX_URL` (e.g. `https://your-deployment.convex.cloud`) in Project Settings → Environment Variables.
4. **Deploy** — Vercel will detect Hono, use the default export from `src/index.ts`, and deploy. No custom build output required.

**Monorepo:** If you use Turborepo, Vercel will run install from the repo root; workspace deps (`@repo/convex`, etc.) will resolve. No extra config needed.

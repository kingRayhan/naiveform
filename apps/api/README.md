# API (Hono)

Hono API app. Deploy to Vercel as a separate project.

## Local

- From repo root: `bun run dev` (runs all apps via Turbo), or
- From this app: `bun run dev` (uses `vercel dev` for local Hono behavior matching Vercel)

## Deploy to Vercel

1. In Vercel, create a new project from the same Git repo.
2. Set **Root Directory** to `apps/api`.
3. Vercel will detect Hono (zero config) and use the default export from `src/index.ts` (or `src/server.ts` / `src/app.ts`).
4. Deploy. Routes become Vercel Functions (Fluid compute).

No `vercel.json` is required unless you need rewrites or env.

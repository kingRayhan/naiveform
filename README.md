# NaiveForm

A modern, intuitive form builder inspired by Google Forms. Create surveys, questionnaires, feedback forms, and more with an easy-to-use drag-and-drop interface.

## ✨ Features

- **Intuitive Form Builder**: Drag-and-drop interface for creating forms quickly
- **Block types**: Input blocks (short answer, paragraph, multiple choice, checkboxes, dropdown, date, star rating) and content blocks (image, paragraph text, YouTube embed)
- **Form Management**: Create, edit, duplicate forms; real-time preview; templates; custom slugs
- **Response Collection**: View responses, export to CSV, webhooks for integrations
- **Form Settings**: Limit one response per person, close dates, confirmation message, redirect URL
- **Authentication**: Clerk
- **Real-time**: Convex for sync and backend

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| **Console (builder)** | React 19, Vite 7, TanStack Router, Tailwind 4, dnd-kit, React Hook Form + Zod |
| **Form (respondent)** | Next.js 16, React 19, React Hook Form, Convex React |
| **Landing** | Next.js 16, React 19, Tailwind 4, Motion |
| **API** | Hono, Bun, Convex HTTP client |
| **Backend** | Convex (queries, mutations, actions), Clerk |
| **Monorepo** | Turborepo, Bun, TypeScript 5.9 |

---

## 📁 Project Structure

```
naiveform/
├── apps/
│   ├── api/                 # Submission API (Hono, port 4000)
│   │   └── src/
│   │       ├── index.ts     # Routes: /f/:id, /form-submission/:id, /html-action/:id, /form.js
│   │       ├── clients.ts   # ConvexHttpClient (CONVEX_URL)
│   │       └── services/formSubmit.ts
│   ├── console/             # Form builder SPA (Vite, default 5173)
│   │   └── src/
│   │       ├── components/form-builder/
│   │       ├── routes/      # TanStack Router
│   │       └── lib/         # form-builder-types, headlessHtml
│   ├── form/                # Public form filler (Next.js, form by id/slug)
│   │   └── src/app/[formId]/page.tsx, components/FormFiller.tsx
│   └── landing/             # Marketing (Next.js)
├── packages/
│   ├── convex/              # Convex backend
│   │   ├── convex/
│   │   │   ├── schema.ts    # forms, responses, webhookLogs
│   │   │   ├── forms.ts     # CRUD, get, getBySlug, listByUser
│   │   │   ├── responses.ts # saveResponse, submit, listByForm, webhooks, logs
│   │   │   └── http.ts      # Minimal HTTP router
│   │   └── (react, error, dataModel exports)
│   ├── design-system/       # Shared UI (Button, etc.) + Tailwind/PostCSS
│   └── types/               # API types (SubmitFormSuccess, etc.) + INPUT_QUESTION_TYPES
├── docker-compose.yml       # API service (Dockerfile.api)
├── Dockerfile.api
├── Dockerfile.console       # Build Vite → nginx
├── Dockerfile.form          # Next standalone
└── Dockerfile.landing       # Next standalone
```

---

## 🔧 Technical Details

### Data model (Convex)

- **forms**
  - `title`, `description`, `userId` (Clerk), `slug`, `isClosed`, `archived`, `updatedAt`
  - **blocks** (primary): array of blocks. Each block: `id`, `type`, `title`, `required`, and type-specific fields (`options`, `inputType`, `ratingMax`, `imageUrl`, `content`, `youtubeVideoId`).
  - **questions** (deprecated): same shape as `blocks`; kept for backward compatibility. Code uses `form.blocks ?? form.questions`.
  - **settings**: `limitOneResponsePerPerson`, `confirmationMessage`, `closeAt`, `redirectUrl`, `webhooks[]`
  - Indexes: `by_user`, `by_slug`, `by_user_updated`

- **responses**
  - `formId`, `answers` (record: block id → string | string[] | number)
  - Index: `by_form`

- **webhookLogs**
  - `formId`, `responseId`, `url`, `success`, `statusCode?`, `errorMessage?`
  - Index: `by_form`

### Block types

- **Input blocks** (collect an answer): `short_text`, `long_text`, `multiple_choice`, `checkboxes`, `dropdown`, `date`, `star_rating`
- **Content blocks** (display only): `image`, `paragraph`, `youtube_embed` (use `imageUrl`, `content`, `youtubeVideoId`)

### Form submission flow

1. **Respondent** submits via Form app (Next.js) or headless HTML/API.
2. **Form app** POSTs to API: `POST /f/:formId` or `POST /form-submission/:formId` with `{ values: { [blockId]: value } }`.
3. **API** (`formSubmit.ts`): uses Convex HTTP client to fetch form, validate (open, allowed keys), then:
   - `api.responses.saveResponse` to insert the response
   - For each URL in `form.settings.webhooks`, POST JSON payload (formId, formTitle, responseId, submittedAt, answers) and call `api.responses.logWebhookDelivery`
4. **Convex** stores the response; webhook execution and logging happen in the API, not in Convex actions (for API-originated submissions).

Alternative: **Console / client** can use Convex `api.responses.submit`, which inserts the response and schedules Convex’s `triggerWebhooks` action (webhooks then run in Convex).

### API endpoints (Hono, port 4000)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health / info |
| GET | `/health` | Health check |
| GET | `/form.js` | Script for headless forms (cache 1h) |
| POST | `/f/:formId` | Submit by form ID or slug; body `{ values: { [id]: string \| string[] } }`; 302 redirect if `redirectUrl` set |
| POST | `/form-submission/:formId` | Same as above, explicit path |
| POST | `/html-action/:formId` | `application/x-www-form-urlencoded`; input names = block ids; Formspree-style |

All submission routes return JSON on error (4xx/5xx) and on success unless redirect.

### Convex functions

- **forms**: `create`, `get`, `getBySlug`, `update`, `listByUser`
- **responses**: `listByForm`, `submit` (insert + schedule webhooks), `saveResponse` (insert only), `listWebhookLogsByForm`, `logWebhookDelivery` (public, used by API)
- **Internal**: `getWebhookPayload`, `insertWebhookLog`, `triggerWebhooks` (action)

### Environment variables

| App | Variable | Purpose |
|-----|----------|---------|
| Console | `VITE_CLERK_PUBLISHABLE_KEY` | Clerk |
| Console | `VITE_CONVEX_URL` | Convex deployment |
| Console | `VITE_FORM_APP_URL` | Form app base URL |
| Console | `VITE_HEADLESS_FORM_ACTION_URL` | API base for embed/curl |
| API | `CONVEX_URL` | Convex HTTP client |
| Form | `NEXT_PUBLIC_CONVEX_URL` | Convex for form page |
| Form | `NEXT_PUBLIC_FORM_API_URL` | API base for submit (e.g. `/f/:id`) |
| Landing | `NEXT_PUBLIC_CONSOLE_APP_URL` | Link to console |

### Docker

- **API**: `Dockerfile.api` — Bun, monorepo install, `bun run src/index.ts` in `apps/api`. Expose 4000.
- **Console**: `Dockerfile.console` — Build (Bun + Vite) → serve with nginx (SPA fallback). Expose 80.
- **Form / Landing**: `Dockerfile.form`, `Dockerfile.landing` — Next.js `output: "standalone"`, Node Alpine, expose 3000.

`docker-compose.yml` defines `naiveform-api` (and commented console/form/landing). Use `.env.docker` for env.

### Console routes (TanStack Router)

- `/` — Dashboard (list forms)
- `/sign-in` — Clerk sign-in
- `/forms/new` — New form (optional template)
- `/forms/:formId/` — Editor (drag-and-drop blocks, preview, headless HTML, API curl)
- `/forms/:formId/settings` — Form settings
- `/forms/:formId/responses` — Response list, CSV export
- `/forms/:formId/webhooks` — Webhook URLs and delivery logs
- `/forms/:formId/share` — Share link and embed
- `/templates` — Form templates

### Shared packages

- **@repo/convex**: Generated API, `api.forms.*`, `api.responses.*`, React provider, `Id<>`, dataModel
- **@repo/design-system**: UI components (e.g. Button), `cn`, Tailwind/globals
- **@repo/types**: `SubmitFormSuccess`, `SubmitFormError`, `SubmitFormValidationError`, `INPUT_QUESTION_TYPES`

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Bun (recommended) or npm/yarn/pnpm

### Installation

```bash
git clone https://github.com/yourusername/naiveform.git
cd naiveform
bun install
```

### Environment

Create `.env` (or copy from examples) in each app. Minimum:

- **apps/console**: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CONVEX_URL`
- **apps/api**: `CONVEX_URL`
- **apps/form**: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_FORM_API_URL`

### Run

```bash
# All apps (Convex, console, form, landing, api per turbo config)
bun dev
```

- Console: typically `http://localhost:5173`
- Form: typically `http://localhost:3000` (or port from form app)
- API: `PORT=4000` (see apps/api scripts)

### Scripts

```bash
bun dev          # Dev all
bun build        # Build all
bun lint         # Lint
bun format       # Prettier
bun check-types  # TypeScript
```

Use Turborepo filters to run per app, e.g. `turbo dev --filter=console`.

---

## 🤝 Contributing

Contributions are welcome. Please open an issue or PR.

## 📝 License

[MIT License](LICENSE)

## 🙏 Acknowledgments

- [Convex](https://convex.dev), [Clerk](https://clerk.com), [shadcn/ui](https://ui.shadcn.com)

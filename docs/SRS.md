# Software Requirements Specification (SRS)

## NaiveForm

**Version:** 1.0  
**Date:** February 22, 2025

---

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for **NaiveForm**, a modern form-builder platform inspired by Google Forms. It is intended for developers, product owners, and stakeholders to define scope, behavior, and constraints of the system.

### 1.2 Scope

NaiveForm allows authenticated users to create, configure, and manage forms (surveys, questionnaires, feedback forms). Respondents submit answers via a public form-filling experience or via API/headless integration. The system collects responses, supports export and webhooks, and provides real-time sync via a Convex backend.

**In scope:**

- Form builder (console) for creating and editing forms
- Public form-filling experience (by form ID or slug)
- Submission API and headless/embed support
- Response storage, listing, and CSV export
- Form settings (one response per person, close date, confirmation, redirect, webhooks)
- Authentication (Clerk) and form ownership
- Landing/marketing site

**Out of scope (for this SRS):**

- Team/collaboration and organizations
- Trash/soft delete and advanced analytics (completion rate, drop-off)
- Payment or premium tiers (mentioned only as future possibility)

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| **Form** | A configurable container of questions/blocks and settings, owned by a user. |
| **Block** | A single unit in a form: either an input (question) or content-only (image, paragraph, YouTube). |
| **Question** | Input block that collects an answer (short text, long text, multiple choice, etc.). |
| **Response** | One submission of a form: a set of answers keyed by question/block id. |
| **Console** | The form-builder SPA where creators manage forms. |
| **Form app** | The public Next.js app where respondents fill and submit forms. |
| **API** | The Hono/Bun service that handles form submission and webhook delivery. |

### 1.4 References

- [README](../README.md) — Project overview, tech stack, structure
- [PAGE_PLAN.md](PAGE_PLAN.md) — Console and public app page/route plan

---

## 2. Stakeholders and Users

### 2.1 Stakeholders

- **Product owner** — Defines features and priorities
- **Developers** — Implement and maintain the system
- **End users** — Form creators and respondents

### 2.2 User Roles

| Role | Description | Primary app |
|------|-------------|-------------|
| **Form creator** | Signed-in user who creates, edits, and manages forms and views responses. | Console |
| **Respondent** | Anyone who opens a form link and submits answers (anonymous or identified only by form settings). | Form app / API |
| **Integrator** | System or developer submitting via API or headless HTML for automation. | API |

---

## 3. System Overview

### 3.1 Product Description

NaiveForm is a web-based form builder with:

- **Console (builder):** Drag-and-drop form editor, form settings, response list/export, share/embed, webhooks, templates.
- **Form (respondent):** Public form page by ID or slug; validation, submit, confirmation or redirect.
- **API:** Submit by form ID/slug (JSON or form-urlencoded), optional redirect, webhook delivery and logging.
- **Landing:** Marketing site with links to console and product info.

### 3.2 Architecture Summary

- **Monorepo:** Turborepo, Bun, TypeScript.
- **Apps:** `console` (Vite/React), `form` (Next.js), `landing` (Next.js), `api` (Hono/Bun).
- **Backend:** Convex (queries, mutations, actions); Clerk for auth.
- **Deployment:** Docker support for API, console, form, landing; env-driven configuration.

---

## 4. Functional Requirements

### 4.1 Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-1 | The system shall use Clerk for authentication (sign-in, sign-up, session). | Must |
| AUTH-2 | Console routes (dashboard, form editor, settings, responses, share, webhooks) shall be available only to authenticated users. | Must |
| AUTH-3 | Form creation and updates shall be associated with the authenticated user’s Clerk `userId`. | Must |

### 4.2 Form Builder (Console)

| ID | Requirement | Priority |
|----|-------------|----------|
| FB-1 | The system shall provide a dashboard listing all forms owned by the current user, with search/filter and “Create form” action. | Must |
| FB-2 | The user shall be able to create a new form (blank or from template) with title and optional description, then be redirected to the form editor. | Must |
| FB-3 | The form editor shall support adding, editing, removing, and reordering questions/blocks via a drag-and-drop interface. | Must |
| FB-4 | The system shall support the following **input block types:** short text, paragraph (long text), multiple choice, checkboxes, dropdown, date, star rating. Short text may be configured as text, email, phone, or number. | Must |
| FB-5 | The system shall support **content blocks** (display only): image, paragraph text, YouTube embed. | Must |
| FB-6 | Each question shall have: unique id, type, title, required flag; type-specific fields (e.g. options for multiple choice/checkboxes/dropdown, `ratingMax` for star rating). | Must |
| FB-7 | The user shall be able to duplicate a form. | Must |
| FB-8 | The user shall have access to a real-time preview of the form as respondents will see it. | Must |
| FB-9 | The user shall be able to set a custom slug for the form for shareable URLs (e.g. `/f/my-survey`). | Must |
| FB-10 | The system shall provide templates (e.g. feedback, registration) that prefill a new form. | Should |

### 4.3 Form Settings

| ID | Requirement | Priority |
|----|-------------|----------|
| FS-1 | The user shall be able to set **limit one response per person** (when supported by identification mechanism). | Must |
| FS-2 | The user shall be able to set a **close date** after which the form does not accept submissions. | Must |
| FS-3 | The user shall be able to set a **confirmation message** shown after successful submit. | Must |
| FS-4 | The user shall be able to set a **redirect URL** to send respondents after submit (API returns 302 when set). | Must |
| FS-5 | The user shall be able to add **webhook URLs**; the system shall POST a JSON payload (formId, formTitle, responseId, submittedAt, answers) to each URL on new response and log delivery (success/failure, status code, error). | Must |

### 4.4 Response Collection and Display

| ID | Requirement | Priority |
|----|-------------|----------|
| RC-1 | The system shall store each submission as a response with `formId` and `answers` (map of block id to value: string, string[], or number). | Must |
| RC-2 | The console shall provide a responses view listing all responses for a form (e.g. table). | Must |
| RC-3 | The user shall be able to export responses to CSV. | Must |
| RC-4 | The console shall provide a webhooks page showing configured URLs and delivery logs (success/failure, status code, error message). | Must |

### 4.5 Public Form Filling (Form App)

| ID | Requirement | Priority |
|----|-------------|----------|
| PF-1 | The system shall serve a public form page by form ID or slug (e.g. `/[formId]` or `/f/:slug` as implemented). | Must |
| PF-2 | Required questions shall be validated before submit; errors shall be shown inline. | Must |
| PF-3 | On successful submit, the system shall show the confirmation message or redirect to the configured URL. | Must |
| PF-4 | If the form is closed (manual or past close date), the system shall not accept submissions and shall show an appropriate message. | Must |
| PF-5 | The form page shall support embedding (e.g. embed route or iframe) and headless usage. | Should |

### 4.6 Submission API

| ID | Requirement | Priority |
|----|-------------|----------|
| API-1 | The system shall expose `POST /f/:formId` (and/or `POST /form-submission/:formId`) accepting JSON body `{ values: { [blockId]: string \| string[] } }` and shall validate form is open and keys match form blocks. | Must |
| API-2 | On success, the API shall return 200 with JSON `{ message, responseId }` unless a redirect URL is set, in which case it shall return 302. | Must |
| API-3 | On validation or business logic error, the API shall return appropriate 4xx with JSON error payload. | Must |
| API-4 | The system shall support `POST /html-action/:formId` with `application/x-www-form-urlencoded` (Formspree-style; input names = block ids). | Must |
| API-5 | The API shall provide a script endpoint (e.g. `GET /form.js`) for headless form integration (cacheable). | Should |
| API-6 | After storing a response, the API shall trigger webhook delivery to all configured URLs and log results. | Must |

### 4.7 Share and Embed

| ID | Requirement | Priority |
|----|-------------|----------|
| SH-1 | The user shall be able to obtain a shareable link to the form (form app URL by ID or slug). | Must |
| SH-2 | The console shall provide embed code (e.g. iframe or script) for the form. | Should |

### 4.8 Landing and Navigation

| ID | Requirement | Priority |
|----|-------------|----------|
| LN-1 | A landing app shall present the product (features, value proposition) and direct users to sign-in or console. | Must |
| LN-2 | Links between landing, console, and form app shall be configurable via environment variables. | Must |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | Form editor and dashboard shall feel responsive; list and form data shall be loaded in a reasonable time (e.g. &lt; 2s for typical payloads). | Should |
| NFR-2 | Form submission (API and Form app) shall complete within a few seconds under normal load; webhook delivery may be asynchronous. | Should |

### 5.2 Availability and Deployment

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-3 | The system shall be deployable via Docker (API, console, form, landing) and environment-based configuration. | Should |
| NFR-4 | API shall expose a health check endpoint (e.g. `GET /health`) for orchestration. | Should |

### 5.3 Security and Privacy

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-5 | Only the form owner (matching `userId`) shall be able to edit form definition, settings, and view/export responses. | Must |
| NFR-6 | Form submission endpoints shall not require authentication; rate limiting and abuse mitigation are recommended for production. | Should |
| NFR-7 | Webhook URLs and secrets shall be stored securely; logs shall not expose full request/response bodies in plain text in documentation. | Should |

### 5.4 Usability

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-8 | The form builder shall be intuitive for users familiar with form builders (e.g. Google Forms). | Should |
| NFR-9 | The respondent form shall be accessible and usable on common desktop and mobile browsers. | Should |

### 5.5 Maintainability

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-10 | The codebase shall use TypeScript with shared types where applicable (`@repo/types`, Convex schema). | Should |
| NFR-11 | Backend logic shall be testable; API and Convex functions shall have clear contracts. | Should |

---

## 6. Data Model (Summary)

### 6.1 Forms

- **forms** (Convex table): `title`, `description`, `userId` (Clerk), `slug`, `isClosed`, `archived`, `updatedAt`, `headerImageId`/`headerImageUrl` (optional).  
- **questions** (array): each item has `id`, `type`, `title`, `required`, and type-specific fields (`options`, `inputType`, `ratingMax`, etc.).  
- **settings** (optional): `limitOneResponsePerPerson`, `confirmationMessage`, `closeAt`, `redirectUrl`, `webhooks[]`.  
- Indexes: by user, by slug, by user + updated.

### 6.2 Responses

- **responses**: `formId`, `answers` (record: block id → string | string[] | number).  
- Index: by form.

### 6.3 Webhook Logs

- **webhookLogs**: `formId`, `responseId`, `url`, `success`, `statusCode`, `errorMessage`.  
- Index: by form.

---

## 7. External Interfaces

### 7.1 Submission API (Hono, port 4000)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health / info |
| GET | `/health` | Health check |
| GET | `/form.js` | Script for headless forms |
| POST | `/f/:formId` | Submit by form ID or slug; JSON body `values`; 302 if redirectUrl set |
| POST | `/form-submission/:formId` | Same as above |
| POST | `/html-action/:formId` | Form-urlencoded; input names = block ids |

### 7.2 Convex

- **forms:** create, get, getBySlug, update, listByUser.  
- **responses:** listByForm, submit (insert + schedule webhooks), saveResponse (insert only), listWebhookLogsByForm, logWebhookDelivery.  
- **Internal:** getWebhookPayload, insertWebhookLog, triggerWebhooks (action).

### 7.3 Third-Party Services

- **Clerk:** Authentication and user identity.  
- **Convex:** Backend database, real-time sync, serverless functions.

---

## 8. Constraints and Assumptions

### 8.1 Constraints

- Console and Form app depend on Convex and Clerk being available and correctly configured.
- API must have `CONVEX_URL` to call Convex HTTP API for form fetch and response save.
- Form creator must have a Clerk account; respondents do not need accounts unless “one response per person” relies on an identifier (e.g. email) collected in the form.

### 8.2 Assumptions

- One form owner per form (single `userId`); no shared editing or team permissions in v1.
- Webhooks are best-effort; retries and idempotency are not fully specified in this SRS.
- Slug uniqueness is enforced per user or globally as implemented in Convex (e.g. unique index on `slug`).
- “Limit one response per person” may rely on client-side or future server-side mechanism (e.g. cookie, email); exact mechanism is implementation-defined.

---

## 9. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-22 | — | Initial SRS from README and codebase. |

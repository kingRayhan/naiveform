# Naive Form — Page Plan

A structured list of pages for a Google Forms–style form builder. Assumes two apps: **Console** (builder, for signed-in users) and **Web** (public form filling).

---

## Console app (form builder)

**Base path:** `/` (or `/dashboard`)

| # | Route | Page | Purpose |
|---|--------|------|--------|
| 1 | `/` or `/dashboard` | **Dashboard** | Home after login. List of user’s forms (cards or table), search/filter, “Create form” CTA, recent activity. |
| 2 | `/forms/new` | **New form** | Create a blank form (title + optional description), then redirect to the form editor. |
| 3 | `/forms/:formId` | **Form editor** | Main builder: add/edit/remove/reorder questions, set question types (short text, long text, multiple choice, checkboxes, dropdown, date, etc.), edit form title/description. |
| 4 | `/forms/:formId/settings` | **Form settings** | Form-level options: collect emails, limit one response per person, confirmation message, close form date, theme/branding. |
| 5 | `/forms/:formId/preview` | **Preview** | Read-only preview of the form as respondents will see it (optional; can also be a mode inside the editor). |
| 6 | `/forms/:formId/responses` | **Responses** | List/summary of submissions: count, table view, per-question summary (e.g. bar chart for multiple choice). Export (CSV/Excel). |
| 7 | `/forms/:formId/responses/:responseId` | **Single response** (optional) | View one submission in detail. |
| 8 | `/forms/:formId/share` | **Share** | Get form link, embed code, optional “Add collaborators” if you support teams. |
| 9 | `/templates` | **Templates** (optional) | Browse starter templates (feedback, registration, quiz, etc.) and create a form from one. |
| 10 | `/settings` or `/account` | **Account / settings** | Profile, notification preferences, connected accounts (Clerk handles auth; this is app-level settings). |

---

## Web app (public form filling)

**Base path:** e.g. `https://form.naiveform.com/` or `https://naiveform.com/f/`

| # | Route | Page | Purpose |
|---|--------|------|--------|
| 1 | `/f/:formId` or `/f/:slug` | **Form fill** | Public form: title, description, list of questions. Submit button; optional “Required” validation and inline errors. |
| 2 | `/f/:formId/thanks` or `?submitted=1` | **Thank you / confirmation** | Message after successful submit (e.g. “Thanks, your response was recorded”). Optional “Submit another response” link. |
| 3 | `/f/:formId/closed` | **Form closed** (optional) | Shown when form is closed or max responses reached. |

---

## Suggested URL summary

```
Console (builder)
  /                     → Dashboard
  /forms/new            → New form
  /forms/:formId        → Form editor
  /forms/:formId/settings
  /forms/:formId/preview
  /forms/:formId/responses
  /forms/:formId/share
  /templates            (optional)
  /settings             (optional)

Web (public)
  /f/:formId            → Form fill
  /f/:formId/thanks     → Confirmation
  /f/:formId/closed     → Form closed (optional)
```

---

## Optional / later

- **Trash** — `/forms/trash` for deleted forms (soft delete).
- **Analytics** — `/forms/:formId/analytics` for charts, completion rate, drop-off.
- **Collaboration** — Team members and permissions (could live under Form settings or Share).
- **Organizations** — If you use Clerk orgs: org-scoped forms and members.

---

## Flow summary

1. **Create:** Dashboard → New form → Form editor.  
2. **Edit:** Dashboard → Form card → Form editor (or Settings / Responses / Share).  
3. **Collect:** Share link → Respondent opens Web app → Form fill → Thank you.  
4. **Review:** Form editor or Dashboard → Responses.

If you want, next step can be defining routes and placeholder components in `apps/console` (e.g. with React Router) based on this plan.

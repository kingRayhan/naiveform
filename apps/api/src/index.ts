import { ConvexHttpClient } from "convex/browser";
import { Hono } from "hono";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";

const app = new Hono();

app.get("/", (c) => c.json({ ok: true, message: "Naiveform API" }));
app.get("/health", (c) => c.json({ status: "ok" }));

/**
 * Headless form submission (Formspree-style).
 * POST /f/:formIdOrSlug with application/x-www-form-urlencoded or multipart/form-data.
 * Field names should match question titles (or question ids).
 */
app.post("/f/:formIdOrSlug", async (c) => {
  const formIdOrSlug = c.req.param("formIdOrSlug")?.trim();
  if (!formIdOrSlug) {
    return c.text("Missing form id or slug", 400);
  }

  const CONVEX_URL = process.env.CONVEX_URL;
  if (!CONVEX_URL) {
    return c.text("Server misconfiguration: CONVEX_URL not set", 500);
  }

  let entries: [string, string][];
  const contentType = c.req.header("content-type") ?? "";
  try {
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      !contentType.includes("multipart")
    ) {
      const text = await c.req.text();
      if (!text) return c.text("Request body is empty", 400);
      entries = parseUrlEncoded(text);
    } else {
      const formData = await c.req.parseBody();
      entries = [];
      for (const [k, v] of Object.entries(formData)) {
        if (typeof v === "string") entries.push([k, v]);
      }
    }
  } catch {
    return c.text("Invalid form body", 400);
  }

  const raw: Record<string, string | string[]> = {};
  for (const [name, value] of entries) {
    if (name.startsWith("_") || name === "submit") continue;
    const existing = raw[name];
    if (existing === undefined) {
      raw[name] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      raw[name] = [existing, value];
    }
  }

  const client = new ConvexHttpClient(CONVEX_URL);
  let form = await client.query(api.forms.getBySlug, { slug: formIdOrSlug });
  if (form === null) {
    try {
      form = await client.query(api.forms.get, {
        formId: formIdOrSlug as Id<"forms">,
      });
    } catch {
      form = null;
    }
  }
  if (!form) return c.text("Form not found", 404);
  if (form.isClosed) return c.text("Form is closed", 410);
  const closeAt = form.settings?.closeAt;
  if (closeAt != null && Date.now() > closeAt) {
    return c.text("Form has closed", 410);
  }

  const titleToId = new Map(form.questions.map((q) => [q.title, q.id]));
  const idSet = new Set(form.questions.map((q) => q.id));
  const answers: Record<string, string | string[] | number> = {};
  for (const [name, value] of Object.entries(raw)) {
    const qId = idSet.has(name) ? name : titleToId.get(name) ?? name;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      answers[qId] = new Date(value).getTime();
    } else if (
      typeof value === "string" &&
      form.questions.some((q) => q.id === qId && q.type === "star_rating")
    ) {
      const n = parseInt(value, 10);
      answers[qId] = Number.isNaN(n) ? value : n;
    } else {
      answers[qId] = value;
    }
  }

  try {
    await client.mutation(api.responses.submit, {
      formId: form._id,
      answers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Submission failed";
    return c.text(message, 422);
  }

  const redirectUrl = form.settings?.redirectUrl?.trim();
  if (redirectUrl) {
    return c.redirect(redirectUrl, 302);
  }

  const accept = c.req.header("accept") ?? "";
  if (accept.includes("application/json")) {
    return c.json({ ok: true }, 201);
  }

  const message =
    form.settings?.confirmationMessage?.trim() ||
    "Thank you for your submission.";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Thank you</title></head><body><p>${escapeHtml(message)}</p></body></html>`;
  return c.html(html, 200);
});

function parseUrlEncoded(text: string): [string, string][] {
  const out: [string, string][] = [];
  const pairs = text.split("&");
  for (const pair of pairs) {
    const i = pair.indexOf("=");
    if (i === -1) continue;
    const name = decodeURIComponent(pair.slice(0, i).replace(/\+/g, " "));
    const value = decodeURIComponent(pair.slice(i + 1).replace(/\+/g, " "));
    out.push([name, value]);
  }
  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default app;

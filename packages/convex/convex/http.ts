import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Headless form submission (Formspree-style).
 * POST /f/:formIdOrSlug with application/x-www-form-urlencoded or multipart/form-data.
 * Field names in the form should match question titles (or question ids) from your form.
 */
const http = httpRouter();

http.route({
  pathPrefix: "/f/",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const formIdOrSlug = url.pathname.replace(/^\/f\/?/, "").trim();
    if (!formIdOrSlug) {
      return new Response("Missing form id or slug", { status: 400 });
    }

    let entries: [string, string][];
    const contentType = request.headers.get("content-type") ?? "";
    try {
      if (contentType.includes("application/x-www-form-urlencoded") || !contentType.includes("multipart")) {
        const text = await request.text();
        if (!text) {
          return new Response("Request body is empty", { status: 400 });
        }
        entries = parseUrlEncoded(text);
      } else {
        const formData = await request.formData();
        entries = [];
        formData.forEach((v, k) => {
          if (typeof v === "string") entries.push([k, v]);
        });
      }
    } catch {
      return new Response("Invalid form body", { status: 400 });
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

    const formBySlug = await ctx.runQuery(api.forms.getBySlug, {
      slug: formIdOrSlug,
    });
    let form = formBySlug;
    if (form === null) {
      try {
        form = await ctx.runQuery(api.forms.get, {
          formId: formIdOrSlug as import("./_generated/dataModel").Id<"forms">,
        });
      } catch {
        form = null;
      }
    }
    if (!form) {
      return new Response("Form not found", { status: 404 });
    }
    if (form.isClosed) {
      return new Response("Form is closed", { status: 410 });
    }
    const closeAt = form.settings?.closeAt;
    if (closeAt != null && Date.now() > closeAt) {
      return new Response("Form has closed", { status: 410 });
    }

    const titleToId = new Map(form.questions.map((q) => [q.title, q.id]));
    const idSet = new Set(form.questions.map((q) => q.id));
    const answers: Record<string, string | string[] | number> = {};
    for (const [name, value] of Object.entries(raw)) {
      const qId = idSet.has(name) ? name : titleToId.get(name) ?? name;
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        answers[qId] = new Date(value).getTime();
      } else if (typeof value === "string" && form.questions.some((q) => q.id === qId && q.type === "star_rating")) {
        const n = parseInt(value, 10);
        answers[qId] = Number.isNaN(n) ? value : n;
      } else {
        answers[qId] = value;
      }
    }

    try {
      await ctx.runMutation(api.responses.submit, {
        formId: form._id,
        answers,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      return new Response(message, { status: 422 });
    }

    const redirectUrl = form.settings?.redirectUrl?.trim();
    if (redirectUrl) {
      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl },
      });
    }

    const accept = request.headers.get("accept") ?? "";
    if (accept.includes("application/json")) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    const message = form.settings?.confirmationMessage?.trim() || "Thank you for your submission.";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Thank you</title></head><body><p>${escapeHtml(message)}</p></body></html>`;
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }),
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

export default http;

import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { getClient } from "../clients";
import { escapeHtml } from "../utils";

export type SubmitFormResult = {
  responseId: string;
  redirectUrl?: string;
};

/**
 * Parse application/x-www-form-urlencoded body (headless HTML form).
 * Input names must match form question ids.
 */
export async function parseFormUrlencoded(
  req: { text: () => Promise<string> }
): Promise<Record<string, string | string[]>> {
  const text = await req.text();
  const params = new URLSearchParams(text);
  const values: Record<string, string | string[]> = {};
  for (const [key, value] of params.entries()) {
    const existing = values[key];
    if (existing === undefined) values[key] = value;
    else if (Array.isArray(existing)) existing.push(value);
    else values[key] = [existing, value];
  }
  return values;
}

/**
 * Validate form state and submitted keys, then save response.
 * Throws Error with message: "Form not found" | "Form is closed" | "Form has expired" | "Form is archived" | "Invalid or unknown field(s): ..."
 */
export async function submitFormResponse(
  formId: string,
  values: Record<string, string | string[]>
): Promise<SubmitFormResult> {
  const convexClient = getClient();
  const form = await convexClient.query(api.forms.get, {
    formId: formId as Id<"forms">,
  });

  if (!form) throw new Error("Form not found");
  if (form.isClosed) throw new Error("Form is closed");
  if (form.settings?.closeAt != null && Date.now() > form.settings.closeAt)
    throw new Error("Form has expired");
  if (form.archived) throw new Error("Form is archived");

  const allowedKeys = new Set((form.questions ?? []).map((q) => q.id));
  const invalidKeys = Object.keys(values).filter((k) => !allowedKeys.has(k));
  if (invalidKeys.length > 0)
    throw new Error(`Invalid or unknown field(s): ${invalidKeys.join(", ")}`);

  const answers: Record<string, string> = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      escapeHtml(key),
      Array.isArray(value)
        ? value.map((v) => escapeHtml(v)).join(", ")
        : escapeHtml(value),
    ])
  );

  const responseId = await convexClient.mutation(api.responses.saveResponse, {
    answers,
    formId: formId as Id<"forms">,
  });

  await triggerWebhooksFromApi(convexClient, {
    form,
    formId: formId as Id<"forms">,
    responseId,
    answers,
  });

  return {
    responseId,
    redirectUrl: form.settings?.redirectUrl,
  };
}

/** Build webhook payload and POST to each URL; log results via Convex. */
async function triggerWebhooksFromApi(
  convexClient: ReturnType<typeof getClient>,
  ctx: {
    form: Awaited<ReturnType<typeof convexClient.query<typeof api.forms.get>>>;
    formId: Id<"forms">;
    responseId: string;
    answers: Record<string, string>;
  }
): Promise<void> {
  const form = ctx.form;
  if (!form) return;
  const webhooks = form.settings?.webhooks?.filter(
    (url): url is string => typeof url === "string" && url.trim().length > 0
  );
  if (!webhooks?.length) return;

  const questionsById = new Map((form.questions ?? []).map((q) => [q.id, q]));
  const answersByFieldName: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(ctx.answers)) {
    const q = questionsById.get(key);
    answersByFieldName[q?.title ?? key] = value;
  }
  const payload = {
    formId: form._id,
    formTitle: form.title,
    responseId: ctx.responseId,
    submittedAt: Date.now(),
    answers: answersByFieldName,
  };
  const body = JSON.stringify(payload);

  for (const url of webhooks) {
    const trimmedUrl = url.trim();
    try {
      const res = await fetch(trimmedUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      await convexClient.mutation(api.responses.logWebhookDelivery, {
        formId: ctx.formId,
        responseId: ctx.responseId as Id<"responses">,
        url: trimmedUrl,
        success: res.ok,
        statusCode: res.status,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      await convexClient.mutation(api.responses.logWebhookDelivery, {
        formId: ctx.formId,
        responseId: ctx.responseId as Id<"responses">,
        url: trimmedUrl,
        success: false,
        errorMessage,
      });
    }
  }
}

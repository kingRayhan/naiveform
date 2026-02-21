import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { getErrorMessage } from "@repo/convex/error";
import type {
  SubmitFormError,
  SubmitFormSuccess,
  SubmitFormValidationError,
} from "@repo/types";
import { ConvexError } from "convex/values";
import type { MiddlewareHandler } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import z, { ZodError } from "zod";
import { getClient } from "./clients";
import { escapeHtml } from "./utils";

const app = new Hono();

app.use(cors() as unknown as MiddlewareHandler);

app.get("/", (c) => c.json({ ok: true, message: "Naiveform API" }));
app.get("/health", (c) => c.json({ status: "ok" }));

const formBodySchema = z.object({
  values: z.record(z.string(), z.string().or(z.array(z.string()))),
});

app.post("/f/:formId", async (c) => {
  try {
    const formId = c.req.param("formId");
    const convexClient = getClient();

    const body = await z.parseAsync(formBodySchema, await c.req.json());
    const values = body.values as Record<string, string | string[]>;

    const form = await convexClient.query(api.forms.get, {
      formId: formId as Id<"forms">,
    });

    // ------------------------------------------------------------
    // Handle edge cases
    // ------------------------------------------------------------

    // 1. Form not found
    if (!form) {
      return c.json({ error: "Form not found" } satisfies SubmitFormError, 404);
    }

    // 2. Form is closed
    if (form.isClosed) {
      return c.json({ error: "Form is closed" } satisfies SubmitFormError, 410);
    }

    // 3. Form expired
    if (form.settings?.closeAt != null && Date.now() > form.settings.closeAt) {
      return c.json(
        { error: "Form has expired" } satisfies SubmitFormError,
        410
      );
    }

    // 4. Form is archived
    if (form.archived) {
      return c.json(
        { error: "Form is archived" } satisfies SubmitFormError,
        410
      );
    }

    // 5. Only allow keys that are form question ids
    const allowedKeys = new Set((form.questions ?? []).map((q) => q.id));
    const submittedKeys = Object.keys(values);
    const invalidKeys = submittedKeys.filter((key) => !allowedKeys.has(key));
    if (invalidKeys.length > 0) {
      return c.json(
        {
          error: `Invalid or unknown field(s): ${invalidKeys.join(", ")}`,
        } satisfies SubmitFormError,
        400
      );
    }

    // Submit response - convert arrays to comma-separated strings for saveResponse
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

    if (form.settings?.redirectUrl) {
      return c.redirect(form.settings.redirectUrl);
    }

    return c.json({
      message: "Response saved successfully",
      responseId: responseId,
    } satisfies SubmitFormSuccess);
  } catch (error) {
    if (error instanceof ConvexError) {
      return c.json(
        { error: getErrorMessage(error) } satisfies SubmitFormError,
        500
      );
    }

    if (error instanceof ZodError) {
      return c.json(
        { errors: error.issues } satisfies SubmitFormValidationError,
        400
      );
    }

    if (error instanceof Error) {
      return c.json({ error: error.message } satisfies SubmitFormError, 500);
    }

    return c.json(
      { error: "Failed to save response" } satisfies SubmitFormError,
      500
    );
  }
});

export default app;

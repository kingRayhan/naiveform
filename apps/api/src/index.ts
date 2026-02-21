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
import { parseFormUrlencoded, submitFormResponse } from "./services/formSubmit";

const app = new Hono();

app.use(cors() as unknown as MiddlewareHandler);

app.get("/", (c) => c.json({ ok: true, message: "Naiveform API" }));
app.get("/health", (c) => c.json({ status: "ok" }));

const formBodySchema = z.object({
  values: z.record(z.string(), z.string().or(z.array(z.string()))),
});

function submitErrorToResponse(
  c: {
    json: (
      body: SubmitFormError | SubmitFormValidationError,
      status: number
    ) => Response;
  },
  error: unknown
): Response {
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
    const msg = error.message;
    if (msg === "Form not found")
      return c.json({ error: msg } satisfies SubmitFormError, 404);
    if (
      msg === "Form is closed" ||
      msg === "Form has expired" ||
      msg === "Form is archived"
    )
      return c.json({ error: msg } satisfies SubmitFormError, 410);
    if (msg.startsWith("Invalid or unknown field"))
      return c.json({ error: msg } satisfies SubmitFormError, 400);
    return c.json({ error: msg } satisfies SubmitFormError, 500);
  }
  return c.json(
    { error: "Failed to save response" } satisfies SubmitFormError,
    500
  );
}

app.post("/f/:formId", async (c) => {
  try {
    const formId = c.req.param("formId");
    const body = await z.parseAsync(formBodySchema, await c.req.json());
    const values = body.values as Record<string, string | string[]>;
    const result = await submitFormResponse(formId, values);
    if (result.redirectUrl) return c.redirect(result.redirectUrl);
    return c.json({
      message: "Response saved successfully",
      responseId: result.responseId,
    } satisfies SubmitFormSuccess);
  } catch (error) {
    return submitErrorToResponse(c, error);
  }
});

/** Headless HTML form endpoint (Formspree-style). POST with application/x-www-form-urlencoded; input names = form question ids. */
app.post("/html-action/:formId", async (c) => {
  try {
    const formId = c.req.param("formId");
    const contentType = c.req.header("Content-Type") ?? "";
    if (!contentType.includes("application/x-www-form-urlencoded")) {
      return c.json(
        {
          error:
            'Content-Type must be application/x-www-form-urlencoded. Use a plain HTML form with method="post".',
        } satisfies SubmitFormError,
        415
      );
    }
    const values = await parseFormUrlencoded(c.req);
    const result = await submitFormResponse(formId, values);
    if (result.redirectUrl) return c.redirect(result.redirectUrl);
    return c.json({
      message: "Response saved successfully",
      responseId: result.responseId,
    } satisfies SubmitFormSuccess);
  } catch (error) {
    return submitErrorToResponse(c, error);
  }
});

export default app;

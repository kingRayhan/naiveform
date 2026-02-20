import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
// import type { Id } from "@repo/convex/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ ok: true, message: "Naiveform API" }));
app.get("/health", (c) => c.json({ status: "ok" }));

// const formBodySchema = z.object({
//   values: z.record(z.string(), z.string().or(z.array(z.string()))),
// });

app.post("/f/:formId", async (c) => {
  try {
    const formId = c.req.param("formId");
    const client = new ConvexHttpClient(process.env.CONVEX_URL!);
    const form = await client.query(api.forms.get, {
      formId: formId as Id<"forms">,
    });
    const body = await c.req.json();
    return c.json({
      form,
      body,
      formId,
      client,
      comvexUrl: process.env.CONVEX_URL,
    });
  } catch {
    return c.json({ error: "Failed to save response" }, 500);
  }
});

// app.post("/f/:formId", async (c) => {
//   try {
//     const formId = c.req.param("formId");

//     const body = await z.parseAsync(formBodySchema, await c.req.json());
//     const values = body.values as Record<string, string | string[]>;

//     const form = await convexClient.query(api.forms.get, {
//       formId: formId as Id<"forms">,
//     });

//     // ------------------------------------------------------------
//     // Handle edge cases
//     // ------------------------------------------------------------

//     // 1. Form not found
//     if (!form) return c.json({ error: "Form not found" }, 404);

//     // 2. Form is closed
//     if (form.isClosed) return c.json({ error: "Form is closed" }, 410);

//     // 3. Form expired
//     if (form.settings?.closeAt != null && Date.now() > form.settings.closeAt)
//       return c.json({ error: "Form has expired" }, 410);

//     // 4. Form is archived
//     if (form.archived) return c.json({ error: "Form is archived" }, 410);

//     // Submit response - convert arrays to comma-separated strings for saveResponse
//     const answers: Record<string, string> = Object.fromEntries(
//       Object.entries(values).map(([key, value]) => [
//         escapeHtml(key),
//         Array.isArray(value)
//           ? value.map((v) => escapeHtml(v)).join(", ")
//           : escapeHtml(value),
//       ])
//     );

//     const responseId = await convexClient.mutation(api.responses.saveResponse, {
//       answers,
//       formId: formId as Id<"forms">,
//     });

//     return c.json({
//       message: "Response saved successfully",
//       responseId: responseId,
//     });
//   } catch (error) {
//     if (error instanceof ConvexError) {
//       return c.json({ error: getErrorMessage(error) }, 500);
//     }

//     if (error instanceof ZodError) {
//       return c.json({ errors: error.issues }, 400);
//     }

//     if (error instanceof Error) {
//       return c.json({ error: error.message }, 500);
//     }

//     return c.json({ error: "Failed to save response" }, 500);
//   }
// });

export default app;

import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { api, internal } from "./_generated/api";

export const listByForm = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("responses")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .order("desc")
      .collect();
  },
});

export const submit = mutation({
  args: {
    formId: v.id("forms"),
    answers: v.record(
      v.string(),
      v.union(v.string(), v.array(v.string()), v.number())
    ),
    recaptchaToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.formId);
    if (!form) throw new ConvexError("Form not found.");

    if (form.isClosed) throw new ConvexError("This form is closed.");

    const closeAt = form.settings?.closeAt;
    if (closeAt != null && Date.now() > closeAt) {
      throw new ConvexError("This form has closed.");
    }

    // Verify reCAPTCHA if site key is configured
    const recaptchaSiteKey = form.settings?.recaptchaSiteKey;
    const recaptchaSecretKey = form.settings?.recaptchaSecretKey;
    if (recaptchaSiteKey) {
      if (!args.recaptchaToken) {
        throw new ConvexError("reCAPTCHA verification failed. Please try again.");
      }
      if (!recaptchaSecretKey) {
        throw new ConvexError("reCAPTCHA secret key is not configured.");
      }
      try {
        const verifyResponse = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(recaptchaSecretKey)}&response=${encodeURIComponent(args.recaptchaToken)}`,
          { method: "POST" }
        );
        const verifyData = (await verifyResponse.json()) as {
          success: boolean;
          score?: number;
        };
        // For v3, require success and score >= 0.5 (adjust threshold as needed)
        if (!verifyData.success || (verifyData.score ?? 1) < 0.5) {
          throw new ConvexError("reCAPTCHA verification failed. Please try again.");
        }
      } catch (error) {
        if (error instanceof ConvexError) throw error;
        throw new ConvexError("reCAPTCHA verification failed. Please try again.");
      }
    }

    const questionsById = new Map(form.questions.map((q) => [q.id, q]));
    const answersByFieldName: Record<string, string | string[] | number> = {};
    for (const [qId, value] of Object.entries(args.answers)) {
      const q = questionsById.get(qId);
      const fieldName = q?.title ?? qId;
      answersByFieldName[fieldName] = value;
    }

    const responseId = await ctx.db.insert("responses", {
      formId: args.formId,
      answers: answersByFieldName,
    });

    const webhooks = form.settings?.webhooks?.filter(
      (url): url is string => typeof url === "string" && url.trim().length > 0
    );
    if (webhooks?.length) {
      await ctx.scheduler.runAfter(0, internal.responses.triggerWebhooks, {
        responseId,
        formId: args.formId,
      });
    }

    return responseId;
  },
});

export const getWebhookPayload = internalQuery({
  args: {
    responseId: v.id("responses"),
    formId: v.id("forms"),
  },
  handler: async (ctx, args) => {
    const response = await ctx.db.get(args.responseId);
    const form = await ctx.db.get(args.formId);
    if (!response || !form || response.formId !== args.formId) return null;
    const questionsById = new Map(form.questions.map((q) => [q.id, q]));
    const answersByFieldName: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(response.answers)) {
      const q = questionsById.get(key);
      const fieldName = q ? q.title : key;
      answersByFieldName[fieldName] = value;
    }
    return {
      formId: form._id,
      formTitle: form.title,
      responseId: response._id,
      submittedAt: response._creationTime,
      answers: answersByFieldName,
    };
  },
});

export const triggerWebhooks = internalAction({
  args: {
    responseId: v.id("responses"),
    formId: v.id("forms"),
  },
  handler: async (ctx, args) => {
    const payload = await ctx.runQuery(internal.responses.getWebhookPayload, {
      responseId: args.responseId,
      formId: args.formId,
    });
    if (!payload) return;
    const form = await ctx.runQuery(api.forms.get, { formId: args.formId });
    const webhooks = form?.settings?.webhooks?.filter(
      (url): url is string => typeof url === "string" && url.trim().length > 0
    );
    if (!webhooks?.length) return;
    const body = JSON.stringify(payload);
    for (const url of webhooks) {
      try {
        const request = new Request(url.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        await fetch(request);
      } catch {
        // ignore per-URL failures
      }
    }
  },
});

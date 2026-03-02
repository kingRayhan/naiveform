import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const formSettingsValidator = {
  limitOneResponsePerPerson: v.optional(v.boolean()),
  confirmationMessage: v.optional(v.string()),
  closeAt: v.optional(v.number()), // timestamp
  redirectUrl: v.optional(v.string()),
  webhooks: v.optional(v.array(v.string())),
  notificationEmails: v.optional(v.array(v.string())), // emails to receive new response notifications
  recaptchaSiteKey: v.optional(v.string()),
  recaptchaSecretKey: v.optional(v.string()),
};

export default defineSchema({
  users: defineTable({
    id: v.optional(v.string()),
    authId: v.string(), // Clerk (or other auth provider) user id
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_id", ["authId"])
    .index("by_custom_id", ["id"]),

  forms: defineTable({
    id: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    headerImageId: v.optional(v.id("_storage")),
    headerImageUrl: v.optional(v.string()),
    userId: v.string(), // User's custom id (from users.id) for ownership
    blocks: v.optional(v.array(v.any())), // Block shape from @repo/types (id, kind, type, ...)
    settings: v.optional(v.object(formSettingsValidator)),
    slug: v.optional(v.string()), // for /f/:slug URLs
    isClosed: v.optional(v.boolean()),
    archived: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .index("by_custom_id", ["id"]),

  responses: defineTable({
    id: v.optional(v.string()),
    formId: v.id("forms"),
    answers: v.record(
      v.string(),
      v.union(v.string(), v.array(v.string()), v.number())
    ), // input block id -> value
  })
    .index("by_form", ["formId"])
    .index("by_custom_id", ["id"]),

  webhookLogs: defineTable({
    id: v.optional(v.string()),
    formId: v.id("forms"),
    responseId: v.id("responses"),
    url: v.string(),
    success: v.boolean(),
    statusCode: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_form", ["formId"])
    .index("by_custom_id", ["id"]),
});

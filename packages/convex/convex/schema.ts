import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const questionValidator = {
  id: v.string(),
  type: v.union(
    v.literal("short_text"),
    v.literal("long_text"),
    v.literal("multiple_choice"),
    v.literal("checkboxes"),
    v.literal("dropdown"),
    v.literal("date"),
    v.literal("star_rating")
  ),
  title: v.string(),
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
  inputType: v.optional(
    v.union(
      v.literal("text"),
      v.literal("email"),
      v.literal("phone"),
      v.literal("number")
    )
  ),
  ratingMax: v.optional(v.number()),
};

const formSettingsValidator = {
  limitOneResponsePerPerson: v.optional(v.boolean()),
  confirmationMessage: v.optional(v.string()),
  closeAt: v.optional(v.number()), // timestamp
  redirectUrl: v.optional(v.string()),
};

export default defineSchema({
  forms: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    headerImageId: v.optional(v.id("_storage")),
    headerImageUrl: v.optional(v.string()),
    userId: v.string(), // Clerk user id
    questions: v.array(v.object(questionValidator)),
    settings: v.optional(v.object(formSettingsValidator)),
    slug: v.optional(v.string()), // for /f/:slug URLs
    isClosed: v.optional(v.boolean()),
    archived: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"])
    .index("by_user_updated", ["userId", "updatedAt"]),

  responses: defineTable({
    formId: v.id("forms"),
    answers: v.record(
      v.string(),
      v.union(v.string(), v.array(v.string()), v.number())
    ), // questionId -> value
  }).index("by_form", ["formId"]),
});

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
  closeAt: v.optional(v.number()),
  redirectUrl: v.optional(v.string()),
};

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    questions: v.optional(v.array(v.object(questionValidator))),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.slug?.trim()) {
      const existing = await ctx.db
        .query("forms")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug!.trim()))
        .first();
      if (existing) throw new ConvexError("This slug is already in use.");
    }
    const now = Date.now();
    return await ctx.db.insert("forms", {
      title: args.title,
      description: args.description,
      userId: args.userId,
      questions: args.questions ?? [],
      slug: args.slug?.trim() || undefined,
      updatedAt: now,
    });
  },
});

export const get = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.formId);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    if (!args.slug.trim()) return null;
    return await ctx.db
      .query("forms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug.trim()))
      .first();
  },
});

export const update = mutation({
  args: {
    formId: v.id("forms"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    questions: v.optional(v.array(v.object(questionValidator))),
    slug: v.optional(v.string()),
    isClosed: v.optional(v.boolean()),
    archived: v.optional(v.boolean()),
    settings: v.optional(v.object(formSettingsValidator)),
  },
  handler: async (ctx, args) => {
    const { formId, ...updates } = args;
    const form = await ctx.db.get(formId);
    if (!form) throw new ConvexError("Form not found.");
    const newSlug = updates.slug !== undefined ? updates.slug.trim() || undefined : undefined;
    if (newSlug && newSlug !== (form.slug ?? "")) {
      const existing = await ctx.db
        .query("forms")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .first();
      if (existing && existing._id !== formId) {
        throw new ConvexError("This slug is already in use.");
      }
    }
    const now = Date.now();
    const patch: Record<string, unknown> = {
      ...updates,
      ...(updates.slug !== undefined && { slug: newSlug }),
      updatedAt: now,
    };
    await ctx.db.patch(formId, patch);
    return formId;
  },
});

export const listByUser = query({
  args: {
    userId: v.string(),
    showArchivedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const forms = await ctx.db
      .query("forms")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    if (args.showArchivedOnly) return forms.filter((f) => !!f.archived);
    return forms.filter((f) => !f.archived);
  },
});

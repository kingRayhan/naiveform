import { ConvexError, v } from "convex/values";
import { mutation } from "./functions";
import { query } from "./_generated/server";

const formSettingsValidator = {
  limitOneResponsePerPerson: v.optional(v.boolean()),
  confirmationMessage: v.optional(v.string()),
  closeAt: v.optional(v.number()),
  redirectUrl: v.optional(v.string()),
  webhooks: v.optional(v.array(v.string())),
  notificationEmails: v.optional(v.array(v.string())),
  recaptchaSiteKey: v.optional(v.string()),
  recaptchaSecretKey: v.optional(v.string()),
};

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    blocks: v.optional(v.array(v.any())),
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

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    // Use user's custom id for ownership (portable across DBs)
    const ownerId = user?.id ?? args.userId;

    const now = Date.now();
    const _id = await ctx.db.insert("forms", {
      title: args.title,
      description: args.description,
      userId: ownerId,
      blocks: args.blocks ?? [],
      slug: args.slug?.trim() || undefined,
      updatedAt: now,
      settings: {
        notificationEmails: [user?.email ?? ""],
      },
    });
    const form = await ctx.db.get(_id);
    return form?.id ?? _id;
  },
});

export const get = query({
  args: { formId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forms")
      .withIndex("by_custom_id", (q) => q.eq("id", args.formId))
      .first();
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
    formId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    blocks: v.optional(v.array(v.any())),
    slug: v.optional(v.string()),
    isClosed: v.optional(v.boolean()),
    archived: v.optional(v.boolean()),
    settings: v.optional(v.object(formSettingsValidator)),
  },
  handler: async (ctx, args) => {
    const { formId, ...updates } = args;
    const form = await ctx.db
      .query("forms")
      .withIndex("by_custom_id", (q) => q.eq("id", formId))
      .first();
    if (!form) throw new ConvexError("Form not found.");
    const newSlug =
      updates.slug !== undefined ? updates.slug.trim() || undefined : undefined;
    if (newSlug && newSlug !== (form.slug ?? "")) {
      const existing = await ctx.db
        .query("forms")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .first();
      if (existing && existing._id !== form._id) {
        throw new ConvexError("This slug is already in use.");
      }
    }
    const now = Date.now();
    const patch: Record<string, unknown> = {
      ...updates,
      ...(updates.slug !== undefined && { slug: newSlug }),
      updatedAt: now,
    };
    await ctx.db.patch(form._id, patch);
    return form.id ?? formId;
  },
});

export const listByUser = query({
  args: {
    userId: v.string(), // Clerk user id; resolved to custom id for query
    showArchivedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Resolve Clerk id to user's custom id for ownership lookup
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    const ownerId = user?.id ?? args.userId;

    const forms = await ctx.db
      .query("forms")
      .withIndex("by_user", (q) => q.eq("userId", ownerId))
      .order("desc")
      .collect();
    if (args.showArchivedOnly) return forms.filter((f) => !!f.archived);
    return forms.filter((f) => !f.archived);
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const questionValidator = {
  id: v.string(),
  type: v.union(
    v.literal("short_text"),
    v.literal("long_text"),
    v.literal("multiple_choice"),
    v.literal("checkboxes"),
    v.literal("dropdown"),
    v.literal("date")
  ),
  title: v.string(),
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
};

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("forms", {
      title: args.title,
      description: args.description,
      userId: args.userId,
      questions: [],
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

export const update = mutation({
  args: {
    formId: v.id("forms"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    questions: v.optional(v.array(v.object(questionValidator))),
  },
  handler: async (ctx, args) => {
    const { formId, ...updates } = args;
    const form = await ctx.db.get(formId);
    if (!form) throw new Error("Form not found");
    const now = Date.now();
    await ctx.db.patch(formId, {
      ...updates,
      updatedAt: now,
    });
    return formId;
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forms")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

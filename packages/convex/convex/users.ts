import { query } from "./_generated/server";
import { v } from "convex/values";
import { mutation } from "./functions";

/**
 * Payload from Clerk webhook (user.created / user.updated).
 * API calls this to sync Clerk users into Convex.
 */
const clerkUserPayload = {
  id: v.string(),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  username: v.optional(v.string()),
  image_url: v.optional(v.string()),
  created_at: v.optional(v.number()),
  updated_at: v.optional(v.number()),
  email_addresses: v.optional(
    v.array(
      v.object({
        id: v.string(),
        email_address: v.string(),
      })
    )
  ),
  primary_email_address_id: v.optional(v.string()),
};

export const upsertFromClerk = mutation({
  args: { payload: v.object(clerkUserPayload) },
  handler: async (ctx, args) => {
    const p = args.payload;
    const primaryEmailId = p.primary_email_address_id;
    const emailRecord = p.email_addresses?.find((e) => e.id === primaryEmailId);
    const email = emailRecord?.email_address ?? undefined;
    const now = Date.now();
    const createdAt = p.created_at ?? now;
    const updatedAt = p.updated_at ?? now;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", p.id))
      .first();

    const doc = {
      userId: p.id,
      email,
      firstName: p.first_name,
      lastName: p.last_name,
      imageUrl: p.image_url,
      username: p.username,
      createdAt,
      updatedAt,
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }
    return await ctx.db.insert("users", doc);
  },
});

export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
  },
});

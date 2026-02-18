import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const submit = mutation({
  args: {
    formId: v.id("forms"),
    answers: v.record(
      v.string(),
      v.union(v.string(), v.array(v.string()), v.number())
    ),
  },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.formId);
    if (!form) throw new ConvexError("Form not found.");

    if (form.isClosed) throw new ConvexError("This form is closed.");

    const closeAt = form.settings?.closeAt;
    if (closeAt != null && Date.now() > closeAt) {
      throw new ConvexError("This form has closed.");
    }

    return await ctx.db.insert("responses", {
      formId: args.formId,
      answers: args.answers,
    });
  },
});

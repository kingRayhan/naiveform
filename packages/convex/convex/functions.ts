import {
  mutation as rawMutation,
  internalMutation as rawInternalMutation,
} from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";

// start using Triggers, with table types from schema.ts
const triggers = new Triggers<DataModel>();

// Set custom id (UUID) on insert for DB portability
triggers.register("forms", async (ctx, change) => {
  if (change.operation === "insert") {
    await ctx.db.patch(change.id, { id: crypto.randomUUID() });
  }
});

triggers.register("responses", async (ctx, change) => {
  if (change.operation === "insert") {
    await ctx.db.patch(change.id, { id: crypto.randomUUID() });
  }
});

triggers.register("webhookLogs", async (ctx, change) => {
  if (change.operation === "insert") {
    await ctx.db.patch(change.id, { id: crypto.randomUUID() });
  }
});

triggers.register("users", async (ctx, change) => {
  if (change.operation === "insert") {
    await ctx.db.patch(change.id, { id: crypto.randomUUID() });
  }
});

// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB)
);

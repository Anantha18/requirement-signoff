import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const record = internalMutation({
  args: {
    email: v.string(),
    status: v.union(v.literal("accepted"), v.literal("failed")),
    providerMessageId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("emailSendAttempts", { ...args, attemptedAt: Date.now() });
    return null;
  },
});

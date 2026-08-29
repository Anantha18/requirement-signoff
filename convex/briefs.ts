import { v } from "convex/values";
import { mutation } from "./_generated/server";
import {
  budgetBandValidator,
  callModeValidator,
  cameraCoverageValidator,
  contentTypeValidator,
  displayCountValidator,
  microphoneTypeValidator,
  platformValidator,
} from "./schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const create = mutation({
  args: {
    email: v.string(),
    capacity: v.number(),
    platform: platformValidator,
    callMode: callModeValidator,
    displayCount: displayCountValidator,
    contentType: contentTypeValidator,
    cameraCoverage: cameraCoverageValidator,
    microphoneType: microphoneTypeValidator,
    budgetBand: budgetBandValidator,
    unresolvedDecisions: v.array(v.string()),
    briefText: v.string(),
  },
  returns: v.id("briefs"),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    if (!emailPattern.test(email)) {
      throw new Error("Enter a valid email address");
    }
    if (!Number.isInteger(args.capacity) || args.capacity < 1 || args.capacity > 50) {
      throw new Error("Room capacity must be a whole number from 1 to 50");
    }
    if (args.unresolvedDecisions.length > 8) {
      throw new Error("A brief can contain at most eight unresolved decisions");
    }
    if (args.briefText.trim().length === 0) {
      throw new Error("The requirement brief cannot be empty");
    }

    const briefId = await ctx.db.insert("briefs", {
      ...args,
      email,
      briefText: args.briefText.trim(),
      status: "draft",
    });

    await ctx.db.insert("firstUseEvents", {
      briefId,
      email,
      completedAt: Date.now(),
    });

    return briefId;
  },
});

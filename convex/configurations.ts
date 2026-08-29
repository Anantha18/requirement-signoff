import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { configureRoom } from "./configurator";
import { bomItemValidator, roomModeValidator, roomTierValidator } from "./schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const create = mutation({
  args: {
    lengthFt: v.number(),
    widthFt: v.number(),
    seats: v.number(),
    mode: roomModeValidator,
    email: v.string(),
  },
  returns: v.object({
    configurationId: v.id("roomConfigurations"),
    tier: roomTierValidator,
    areaSqFt: v.number(),
    items: v.array(bomItemValidator),
    totalLow: v.number(),
    totalHigh: v.number(),
  }),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!emailPattern.test(email)) throw new Error("Enter a valid email address");
    if (args.lengthFt < 6 || args.lengthFt > 60 || args.widthFt < 6 || args.widthFt > 60) {
      throw new Error("Room dimensions must be between 6 and 60 feet");
    }
    if (!Number.isInteger(args.seats) || args.seats < 1 || args.seats > 32) {
      throw new Error("Seats must be a whole number from 1 to 32");
    }

    const result = configureRoom(args);
    const configurationId = await ctx.db.insert("roomConfigurations", {
      ...args,
      email,
      ...result,
    });
    await ctx.db.insert("firstUseEvents", { configurationId, email, completedAt: Date.now() });
    return { configurationId, ...result };
  },
});

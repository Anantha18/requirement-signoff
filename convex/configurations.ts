import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { configureRoom } from "./configurator";
import {
  bomItemValidator,
  configuratorPlatformValidator,
  deploymentValidator,
  roomModeValidator,
  roomTierValidator,
  supportAnswersValidator,
  supportLevelValidator,
} from "./schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const create = mutation({
  args: {
    lengthFt: v.number(),
    widthFt: v.number(),
    seats: v.number(),
    mode: roomModeValidator,
    email: v.string(),
    companyName: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
    platform: v.optional(configuratorPlatformValidator),
    deployment: v.optional(deploymentValidator),
    selectedAccessories: v.optional(v.array(v.string())),
    additionalDevices: v.optional(v.array(v.string())),
    supportAnswers: v.optional(supportAnswersValidator),
    supportLevel: v.optional(supportLevelValidator),
  },
  returns: v.object({
    configurationId: v.id("roomConfigurations"),
    tier: roomTierValidator,
    areaSqFt: v.number(),
    displaySizeInches: v.number(),
    items: v.array(bomItemValidator),
    totalLow: v.number(),
    totalHigh: v.number(),
  }),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const companyName = args.companyName?.trim() || undefined;
    const contactNumber = args.contactNumber?.trim() || undefined;
    if (!emailPattern.test(email)) throw new Error("Enter a valid email address");
    if (args.lengthFt < 6 || args.lengthFt > 60 || args.widthFt < 6 || args.widthFt > 60) {
      throw new Error("Room dimensions must be between 6 and 60 feet");
    }
    if (!Number.isInteger(args.seats) || args.seats < 1 || args.seats > 32) {
      throw new Error("Seats must be a whole number from 1 to 32");
    }
    if (companyName && companyName.length > 120) throw new Error("Company name is too long");
    if (contactNumber && !/^[+()\d\s-]{7,20}$/.test(contactNumber)) throw new Error("Enter a valid contact number");
    if ((args.selectedAccessories?.length ?? 0) > 10 || (args.additionalDevices?.length ?? 0) > 10) {
      throw new Error("Too many optional items selected");
    }

    const result = configureRoom(args);
    const configurationId = await ctx.db.insert("roomConfigurations", {
      ...args,
      email,
      companyName,
      contactNumber,
      ...result,
    });
    await ctx.db.insert("firstUseEvents", { configurationId, email, completedAt: Date.now() });
    return { configurationId, ...result };
  },
});

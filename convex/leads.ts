import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { action, internalQuery, mutation } from "./_generated/server";
import { configureRoom } from "./configurator";
import { optionalDevices } from "./optionalDevices";
import {
  configuratorPlatformValidator,
  deploymentValidator,
  roomModeValidator,
  supportAnswersValidator,
  supportLevelValidator,
} from "./schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createArgs = {
  email: v.string(),
  companyName: v.optional(v.string()),
  contactNumber: v.optional(v.string()),
  lengthFt: v.number(),
  widthFt: v.number(),
  seats: v.number(),
  mode: roomModeValidator,
  platform: configuratorPlatformValidator,
  deployment: deploymentValidator,
  selectedAccessories: v.array(v.string()),
  additionalDevices: v.array(v.string()),
  supportAnswers: supportAnswersValidator,
  supportLevel: supportLevelValidator,
};

export const create = mutation({
  args: createArgs,
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
    if (args.selectedAccessories.length > 10 || args.additionalDevices.length > 10) {
      throw new Error("Too many optional items selected");
    }

    const result = configureRoom(args);
    const selectedDevices = optionalDevices.filter((device) => args.additionalDevices.includes(device.name));
    const bom = [
      ...result.items.map((item) => ({ ...item, optional: false })),
      ...selectedDevices.map((device) => ({
        name: device.name,
        category: "Additional device",
        quantity: 1,
        unitLow: device.low,
        unitHigh: device.high,
        low: device.low,
        high: device.high,
        optional: true,
      })),
    ];
    const totalLow = result.totalLow + selectedDevices.reduce((total, device) => total + (device.low ?? 0), 0);
    const totalHigh = result.totalHigh + selectedDevices.reduce((total, device) => total + (device.high ?? 0), 0);
    const createdAt = Date.now();
    const leadId = await ctx.db.insert("leads", {
      email,
      configuration: {
        lengthFt: args.lengthFt,
        widthFt: args.widthFt,
        seats: args.seats,
        mode: args.mode,
        companyName,
        contactNumber,
        platform: args.platform,
        deployment: args.deployment,
        selectedAccessories: args.selectedAccessories,
        additionalDevices: args.additionalDevices,
        supportAnswers: args.supportAnswers,
      },
      bom,
      totalLow,
      totalHigh,
      supportLevel: args.supportLevel,
      createdAt,
    });

    return { leadId, email };
  },
});

export const listAllInternal = internalQuery({
  args: {},
  handler: async (ctx) => ctx.db.query("leads").withIndex("by_createdAt").order("desc").collect(),
});

export const listProtected = action({
  args: { password: v.string() },
  handler: async (ctx, args): Promise<Doc<"leads">[]> => {
    const configuredPassword = process.env.LEADS_PASSWORD;
    if (!configuredPassword) throw new Error("Lead access is not configured");
    if (args.password !== configuredPassword) throw new Error("Incorrect password");
    return ctx.runQuery(internal.leads.listAllInternal, {});
  },
});

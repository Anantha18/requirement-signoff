import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";
import { buildBomEmail, sendViaResend, validateRecipient } from "./bomEmail";
import { configureRoom } from "./configurator";
import {
  configuratorPlatformValidator,
  deploymentValidator,
  roomModeValidator,
  supportAnswersValidator,
  supportLevelValidator,
} from "./schema";

export const sendBom = action({
  args: {
    email: v.string(),
    lengthFt: v.number(),
    widthFt: v.number(),
    seats: v.number(),
    mode: roomModeValidator,
    companyName: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
    platform: configuratorPlatformValidator,
    deployment: deploymentValidator,
    selectedAccessories: v.array(v.string()),
    additionalDevices: v.array(v.string()),
    supportAnswers: supportAnswersValidator,
    supportLevel: supportLevelValidator,
  },
  returns: v.object({ providerMessageId: v.string(), configurationId: v.id("roomConfigurations") }),
  handler: async (ctx, args): Promise<{ providerMessageId: string; configurationId: Id<"roomConfigurations"> }> => {
    const email = validateRecipient(args.email);
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !from) {
      await ctx.runMutation(internal.emailLogs.record, { email, status: "failed", errorMessage: "Resend environment variables are missing" });
      throw new Error("Email delivery is not configured yet. Add the Resend settings and try again.");
    }

    const result = configureRoom(args);
    const message = buildBomEmail({
      result,
      platform: args.platform,
      deployment: args.deployment,
      additionalDevices: args.additionalDevices,
      supportLevel: args.supportLevel,
    });

    try {
      const providerMessageId = await sendViaResend({ apiKey, from, to: email, ...message });
      const saved: { configurationId: Id<"roomConfigurations"> } = await ctx.runMutation(api.configurations.create, { ...args, email });
      await ctx.runMutation(internal.emailLogs.record, { email, status: "accepted", providerMessageId });
      console.log(JSON.stringify({ event: "bom_email_accepted", providerMessageId }));
      return { providerMessageId, configurationId: saved.configurationId };
    } catch (caught) {
      const errorMessage = caught instanceof Error ? caught.message : "Email provider rejected the message";
      await ctx.runMutation(internal.emailLogs.record, { email, status: "failed", errorMessage: errorMessage.slice(0, 200) });
      console.error(JSON.stringify({ event: "bom_email_failed", errorMessage: errorMessage.slice(0, 200) }));
      throw new Error(errorMessage);
    }
  },
});

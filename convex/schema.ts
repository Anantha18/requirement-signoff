import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const platformValidator = v.union(
  v.literal("google_meet"),
  v.literal("microsoft_teams"),
  v.literal("zoom"),
  v.literal("multiple"),
  v.literal("unsure"),
);

export const callModeValidator = v.union(
  v.literal("room_system"),
  v.literal("laptop_byod"),
  v.literal("both"),
  v.literal("unsure"),
);

export const displayCountValidator = v.union(
  v.literal("one"),
  v.literal("two"),
  v.literal("unsure"),
);

export const contentTypeValidator = v.union(
  v.literal("presentations"),
  v.literal("video"),
  v.literal("detailed_content"),
  v.literal("unsure"),
);

export const cameraCoverageValidator = v.union(
  v.literal("whole_room"),
  v.literal("speaker"),
  v.literal("room_and_speaker"),
  v.literal("unsure"),
);

export const microphoneTypeValidator = v.union(
  v.literal("tabletop"),
  v.literal("ceiling"),
  v.literal("unsure"),
);

export const budgetBandValidator = v.union(
  v.literal("under_3_lakh"),
  v.literal("3_to_5_lakh"),
  v.literal("5_to_10_lakh"),
  v.literal("above_10_lakh"),
  v.literal("not_disclosed"),
);

export const briefStatusValidator = v.union(
  v.literal("draft"),
  v.literal("approved"),
  v.literal("changes_requested"),
);

const briefFields = {
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
  status: briefStatusValidator,
  changeRequest: v.optional(v.string()),
  approvedAt: v.optional(v.number()),
};

export default defineSchema({
  briefs: defineTable(briefFields)
    .index("by_email", ["email"])
    .index("by_status", ["status"]),
  firstUseEvents: defineTable({
    briefId: v.id("briefs"),
    email: v.string(),
    completedAt: v.number(),
  })
    .index("by_briefId", ["briefId"])
    .index("by_email", ["email"]),
});

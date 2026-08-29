/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

const completeBrief = {
  email: "client@example.com",
  capacity: 20,
  platform: "google_meet" as const,
  callMode: "room_system" as const,
  displayCount: "two" as const,
  contentType: "presentations" as const,
  cameraCoverage: "room_and_speaker" as const,
  microphoneType: "ceiling" as const,
  budgetBand: "above_10_lakh" as const,
  unresolvedDecisions: [],
  briefText: "A 20-person Google Meet room with two displays.",
};

describe("brief creation", () => {
  it("saves a draft and records first use in one mutation", async () => {
    const t = convexTest(schema, modules);

    const briefId = await t.mutation(api.briefs.create, completeBrief);

    const result = await t.run(async (ctx) => {
      const brief = await ctx.db.get("briefs", briefId);
      const firstUse = await ctx.db
        .query("firstUseEvents")
        .withIndex("by_briefId", (q) => q.eq("briefId", briefId))
        .unique();
      return { brief, firstUse };
    });

    expect(result.brief).toMatchObject({
      ...completeBrief,
      status: "draft",
    });
    expect(result.firstUse).toMatchObject({
      briefId,
      email: completeBrief.email,
    });
    expect(result.firstUse?.completedAt).toEqual(expect.any(Number));
  });

  it("rejects an invalid email without saving either record", async () => {
    const t = convexTest(schema, modules);

    await expect(
      t.mutation(api.briefs.create, {
        ...completeBrief,
        email: "not-an-email",
      }),
    ).rejects.toThrow("Enter a valid email address");

    const counts = await t.run(async (ctx) => ({
      briefs: (await ctx.db.query("briefs").take(1)).length,
      firstUses: (await ctx.db.query("firstUseEvents").take(1)).length,
    }));

    expect(counts).toEqual({ briefs: 0, firstUses: 0 });
  });
});

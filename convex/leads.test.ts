/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import { afterEach, describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");
const originalPassword = process.env.LEADS_PASSWORD;

const completeLead = {
  email: "Buyer@Example.com",
  companyName: "Example Company",
  contactNumber: "+91 98765 43210",
  lengthFt: 20,
  widthFt: 14,
  seats: 10,
  mode: "native" as const,
  platform: "microsoft_teams" as const,
  deployment: "not_sure" as const,
  selectedAccessories: ["Mounting, cabling and installation kit"],
  additionalDevices: ["Room scheduling device"],
  supportAnswers: {
    qualifiedSupport: "yes" as const,
    operationalSupport: "self_managed" as const,
    troubleshooting: "customer" as const,
    supportHours: "business" as const,
    replacementTime: "48_hours" as const,
  },
  supportLevel: "low" as const,
};

afterEach(() => {
  if (originalPassword === undefined) delete process.env.LEADS_PASSWORD;
  else process.env.LEADS_PASSWORD = originalPassword;
});

describe("lead capture", () => {
  it("stores the complete configuration, displayed BOM and priced budget", async () => {
    const t = convexTest(schema, modules);
    const result = await t.mutation(api.leads.create, completeLead);
    const saved = await t.run((ctx) => ctx.db.get(result.leadId)) as Doc<"leads"> | null;

    expect(saved).toMatchObject({
      email: "buyer@example.com",
      configuration: {
        companyName: "Example Company",
        lengthFt: 20,
        widthFt: 14,
        seats: 10,
        deployment: "not_sure",
      },
      totalLow: 535_000,
      totalHigh: 1_005_000,
      supportLevel: "low",
    });
    expect(saved?.bom).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Room scheduling device", quantity: 1, low: 90_000, high: 120_000, optional: true }),
    ]));
    expect(saved?.createdAt).toEqual(expect.any(Number));
  });

  it("rejects malformed email before inserting", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(api.leads.create, { ...completeLead, email: "bad-email" })).rejects.toThrow("Enter a valid email address");
  });

  it("requires LEADS_PASSWORD and returns newest leads first", async () => {
    process.env.LEADS_PASSWORD = "test-password";
    const t = convexTest(schema, modules);
    await t.mutation(api.leads.create, completeLead);
    await new Promise((resolve) => setTimeout(resolve, 2));
    await t.mutation(api.leads.create, { ...completeLead, email: "newest@example.com" });

    await expect(t.action(api.leads.listProtected, { password: "wrong" })).rejects.toThrow("Incorrect password");
    const rows = await t.action(api.leads.listProtected, { password: "test-password" });
    expect(rows.map((row) => row.email)).toEqual(["newest@example.com", "buyer@example.com"]);
  });
});

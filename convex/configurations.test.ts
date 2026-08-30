/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("room configuration email request", () => {
  it("saves the email, room inputs and generated BOM together", async () => {
    const t = convexTest(schema, modules);
    const response = await t.mutation(api.configurations.create, {
      lengthFt: 20,
      widthFt: 14,
      seats: 10,
      mode: "native",
      companyName: "Example Company",
      contactNumber: "+91 98765 43210",
      email: "buyer@example.com",
    });

    const saved = await t.run((ctx) => ctx.db.get("roomConfigurations", response.configurationId));

    expect(saved).toMatchObject({
      email: "buyer@example.com",
      companyName: "Example Company",
      contactNumber: "+91 98765 43210",
      lengthFt: 20,
      widthFt: 14,
      seats: 10,
      mode: "native",
      displaySizeInches: 80,
      totalLow: 475_000,
      totalHigh: 955_000,
    });
    expect(saved?.items).toEqual(response.items);
  });
});

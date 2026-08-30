import { describe, expect, it } from "vitest";
import { configureRoom } from "./configurator";

describe("configureRoom", () => {
  it("creates a compact BYOD kit for a four-seat room", () => {
    const result = configureRoom({
      lengthFt: 12,
      widthFt: 10,
      seats: 4,
      mode: "byod",
    });

    expect(result.tier).toBe("small");
    expect(result.areaSqFt).toBe(120);
    expect(result.displaySizeInches).toBe(50);
    expect(result.items[0].name).toBe("50-inch commercial display");
    expect(result.items.map((item) => item.category)).toEqual([
      "Display",
      "Video",
      "Connectivity",
      "Infrastructure",
    ]);
    expect(result.totalLow).toBe(
      result.items.reduce((total, item) => total + item.low, 0),
    );
    expect(result.totalHigh).toBe(
      result.items.reduce((total, item) => total + item.high, 0),
    );
  });

  it("creates a native medium-room kit with a controller", () => {
    const result = configureRoom({
      lengthFt: 20,
      widthFt: 14,
      seats: 10,
      mode: "native",
    });

    expect(result.tier).toBe("medium");
    expect(result.displaySizeInches).toBe(80);
    expect(result.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Native room compute and camera kit" }),
        expect.objectContaining({ name: "Touch room controller" }),
      ]),
    );
    expect(result.items.some((item) => item.name === "Expansion microphone")).toBe(false);
  });

  it("adds the expansion microphone when a medium room is longer than 20 feet", () => {
    const result = configureRoom({ lengthFt: 21, widthFt: 14, seats: 10, mode: "native" });

    expect(result.tier).toBe("medium");
    expect(result.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Expansion microphone" }),
    ]));
  });

  it("uses the larger tier when seats exceed the room-area tier", () => {
    const result = configureRoom({
      lengthFt: 18,
      widthFt: 14,
      seats: 20,
      mode: "native",
    });

    expect(result.tier).toBe("large");
    expect(result.displaySizeInches).toBe(70);
    expect(
      result.items.find((item) => item.name === "Ceiling microphone array")
        ?.quantity,
    ).toBe(2);
    expect(result.totalHigh).toBeGreaterThan(result.totalLow);
  });
});

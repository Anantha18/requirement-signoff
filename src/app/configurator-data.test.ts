import { describe, expect, it } from "vitest";
import { configureRoom } from "../../convex/configurator";
import { coreEquipment, recommendSupport, requiredAccessories } from "./configurator-data";

describe("configurator view model", () => {
  const mediumNative = configureRoom({ lengthFt: 20, widthFt: 14, seats: 10, mode: "native" });

  it("uses only existing BOM rows for core equipment and accessories", () => {
    expect(coreEquipment(mediumNative).find((row) => row.role === "Camera")?.item?.name).toBe("Native room compute and camera kit");
    expect(coreEquipment(mediumNative).find((row) => row.role === "Speakers")?.item).toBeUndefined();
    expect(requiredAccessories(mediumNative).map((item) => item.name)).toEqual(["Mounting, cabling and installation kit"]);
  });

  it("recommends higher coverage for unsupported 24x7 rooms with fast replacement", () => {
    expect(recommendSupport({
      qualifiedSupport: "no",
      operationalSupport: "managed",
      troubleshooting: "provider",
      supportHours: "24x7",
      replacementTime: "4_hours",
    }).level).toBe("high");
  });

  it("recommends low coverage for a self-supported room", () => {
    expect(recommendSupport({
      qualifiedSupport: "yes",
      operationalSupport: "self_managed",
      troubleshooting: "customer",
      supportHours: "business",
      replacementTime: "48_hours",
    }).level).toBe("low");
  });
});

import { describe, expect, it, vi } from "vitest";
import { configureRoom } from "./configurator";
import { buildBomEmail, sendViaResend, validateRecipient } from "./bomEmail";

describe("BOM email", () => {
  it("includes the complete priced BOM, optional devices and support in HTML and text", () => {
    const result = configureRoom({ lengthFt: 20, widthFt: 14, seats: 10, mode: "native" });
    const email = buildBomEmail({ result, platform: "Microsoft Teams", deployment: "Appliance-based", additionalDevices: ["Room scheduling device"], supportLevel: "High" });
    expect(email.html).toContain("Native room compute and camera kit");
    expect(email.html).toContain("₹5,35,000 – ₹10,05,000");
    expect(email.html).toContain("₹90,000 – ₹1,20,000");
    expect(email.html).toContain("Room scheduling device");
    expect(email.text).toContain("High coverage");
  });

  it("accepts a successful Resend provider response", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "email_123" }), { status: 200 }));
    await expect(sendViaResend({ apiKey: "secret", from: "AV <bom@example.com>", to: "buyer@example.com", subject: "BOM", html: "<p>BOM</p>", text: "BOM" }, fetcher)).resolves.toBe("email_123");
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("rejects an invalid recipient before sending", () => {
    expect(() => validateRecipient("not-an-email")).toThrow("Enter a valid email address");
  });
});

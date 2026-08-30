import type { RoomConfiguration } from "./configurator";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRecipient(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!emailPattern.test(normalized)) throw new Error("Enter a valid email address");
  return normalized;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
}

const money = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(value)}`;

export function buildBomEmail(args: {
  result: RoomConfiguration;
  platform: string;
  deployment: string;
  additionalDevices: string[];
  supportLevel: string;
}) {
  const rows = args.result.items.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.category)}</td><td>${item.quantity}</td><td>${money(item.low)} – ${money(item.high)}</td></tr>`).join("");
  const textRows = args.result.items.map((item) => `${item.name} | ${item.category} | Qty ${item.quantity} | ${money(item.low)} – ${money(item.high)}`).join("\n");
  const optionalHtml = args.additionalDevices.length ? args.additionalDevices.map((item) => `<li>${escapeHtml(item)} — price and compatibility: To be confirmed</li>`).join("") : "<li>None selected</li>";
  const optionalText = args.additionalDevices.length ? args.additionalDevices.map((item) => `- ${item} — price and compatibility: To be confirmed`).join("\n") : "- None selected";

  return {
    subject: `Indicative AV room BOM — ${args.result.areaSqFt} sq ft`,
    html: `<h1>Your indicative AV room BOM</h1><p><strong>Platform:</strong> ${escapeHtml(args.platform)}<br><strong>Deployment:</strong> ${escapeHtml(args.deployment)}<br><strong>Recommended display:</strong> ${args.result.displaySizeInches} inches</p><table border="1" cellpadding="8" cellspacing="0"><thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Indicative range</th></tr></thead><tbody>${rows}</tbody></table><p><strong>Indicative budget:</strong> ${money(args.result.totalLow)} – ${money(args.result.totalHigh)}</p><h2>Optional devices</h2><ul>${optionalHtml}</ul><h2>Support</h2><p>${escapeHtml(args.supportLevel)} coverage — commercial tier, inclusions and price: To be confirmed.</p><p><em>Indicative only. Prices exclude tax and can vary by brand, availability, room conditions and installation.</em></p>`,
    text: `YOUR INDICATIVE AV ROOM BOM\n\nPlatform: ${args.platform}\nDeployment: ${args.deployment}\nRecommended display: ${args.result.displaySizeInches} inches\n\n${textRows}\n\nIndicative budget: ${money(args.result.totalLow)} – ${money(args.result.totalHigh)}\n\nOPTIONAL DEVICES\n${optionalText}\n\nSUPPORT\n${args.supportLevel} coverage — commercial tier, inclusions and price: To be confirmed.\n\nIndicative only. Prices exclude tax and can vary by brand, availability, room conditions and installation.`,
  };
}

export async function sendViaResend(args: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}, fetcher: typeof fetch = fetch): Promise<string> {
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${args.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: args.from, to: [args.to], subject: args.subject, html: args.html, text: args.text }),
  });
  const body = await response.json() as { id?: string; message?: string };
  if (!response.ok || !body.id) throw new Error(body.message || "Email provider rejected the message");
  return body.id;
}

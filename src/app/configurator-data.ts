import type { BomItem, RoomConfiguration } from "../../convex/configurator";
export { optionalDevices, type OptionalDeviceId } from "../../convex/optionalDevices";

export type Platform = "microsoft_teams" | "zoom" | "google_meet" | "byod";
export type Deployment = "appliance" | "pc" | "byod" | "not_sure";
export type SupportLevel = "low" | "medium" | "high";
export type SupportAnswers = {
  qualifiedSupport: "yes" | "no";
  operationalSupport: "self_managed" | "business_hours" | "managed";
  troubleshooting: "customer" | "partner" | "provider";
  supportHours: "business" | "extended" | "24x7";
  replacementTime: "next_business_day" | "48_hours" | "4_hours";
};

export const supportQuestions = [
  { key: "qualifiedSupport", title: "Does the customer have qualified AV or IT support?", options: [["yes", "Yes"], ["no", "No"]] },
  { key: "operationalSupport", title: "What ongoing operational support is needed?", options: [["self_managed", "Customer-managed"], ["business_hours", "Help during business hours"], ["managed", "Fully managed support"]] },
  { key: "troubleshooting", title: "Who will handle troubleshooting?", options: [["customer", "Customer team"], ["partner", "AV partner"]] },
  { key: "supportHours", title: "What support hours are required?", options: [["business", "Business hours"], ["extended", "Extended hours"], ["24x7", "24 × 7"]] },
  { key: "replacementTime", title: "How quickly must faulty equipment be replaced?", options: [["48_hours", "Within 48 hours"], ["next_business_day", "Next business day"], ["4_hours", "Within 4 hours"]] },
] as const;

function findItem(items: BomItem[], patterns: RegExp[]): BomItem | undefined {
  return items.find((item) => patterns.some((pattern) => pattern.test(item.name)));
}

export function coreEquipment(result: RoomConfiguration) {
  const items = result.items;
  return [
    { role: "Display", item: findItem(items, [/display/i]) },
    { role: "Camera", item: findItem(items, [/camera/i, /video bar/i]) },
    { role: "Microphone", item: findItem(items, [/microphone/i, /video bar/i]) },
    { role: "Speakers", item: findItem(items, [/loudspeaker/i, /video bar/i]) },
    { role: "Controller", item: findItem(items, [/controller/i]) },
  ];
}

export function requiredAccessories(result: RoomConfiguration): BomItem[] {
  return result.items.filter((item) => item.category === "Infrastructure" || item.category === "Connectivity");
}

export function recommendSupport(answers: SupportAnswers): { level: SupportLevel; reason: string } {
  let score = 0;
  if (answers.qualifiedSupport === "no") score += 2;
  if (answers.operationalSupport === "business_hours") score += 1;
  if (answers.operationalSupport === "managed") score += 2;
  if (answers.troubleshooting === "partner") score += 1;
  if (answers.troubleshooting === "provider") score += 2;
  if (answers.supportHours === "extended") score += 1;
  if (answers.supportHours === "24x7") score += 3;
  if (answers.replacementTime === "next_business_day") score += 1;
  if (answers.replacementTime === "4_hours") score += 3;

  if (score >= 7) return { level: "high", reason: "The room needs fast response or substantial outside support." };
  if (score >= 3) return { level: "medium", reason: "The customer has some support coverage but still needs dependable escalation." };
  return { level: "low", reason: "The customer can handle routine support and accepts standard response times." };
}

export const supportLevelCopy: Record<SupportLevel, { label: string; description: string }> = {
  low: { label: "Low coverage", description: "Commercial support tier, inclusions and price: To be confirmed" },
  medium: { label: "Medium coverage", description: "Commercial support tier, inclusions and price: To be confirmed" },
  high: { label: "High coverage", description: "Commercial support tier, inclusions and price: To be confirmed" },
};

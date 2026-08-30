import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const baseUrl = process.env.WIZARD_URL ?? "http://localhost:3001";

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function clickChoice(page, label) {
  await page.getByText(label, { exact: true }).click();
}

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(5_000);
await page.goto(baseUrl, { waitUntil: "networkidle" });
console.log("room");
check(await page.getByRole("button", { name: "Back" }).isDisabled(), "Back must be disabled on step 1");
check(await page.getByText("Example: a 10-seat room", { exact: false }).isVisible(), "Worked example missing on step 1");
await page.getByRole("button", { name: "Next", exact: true }).click();
console.log("platform");
check(await page.getByRole("button", { name: "Next", exact: true }).isDisabled(), "Platform must be required");
check(await page.getByText("Example: a 10-seat room", { exact: false }).count() === 0, "Worked example should hide after step 1");
await clickChoice(page, "Microsoft Teams");
await page.getByRole("button", { name: "Next", exact: true }).click();
console.log("deployment");
check(await page.getByRole("button", { name: "Next", exact: true }).isDisabled(), "Deployment must be required");
await clickChoice(page, "Not sure");
await page.getByRole("button", { name: "Next", exact: true }).click();
console.log("core");
check(await page.getByText("Expansion microphone", { exact: true }).count() === 0, "Expansion microphone must be hidden at 20 ft");
await page.getByRole("button", { name: "Next", exact: true }).click();
console.log("accessories");
check((await page.locator("body").innerText()).includes("scaled for a medium room"), "Mounting-kit scale note missing");
await page.getByRole("button", { name: "Next", exact: true }).click();
console.log("additional");
await page.getByText("Room scheduling device", { exact: false }).click();
check((await page.locator("body").innerText()).includes("Compatible with the recommended system."), "Scheduling compatibility text missing");
await page.getByRole("button", { name: "Next", exact: true }).click();
console.log("support");
check(await page.locator("fieldset").count() === 5, "All five support questions must share one screen");
check(await page.getByRole("button", { name: /Build recommendation/ }).isDisabled(), "Support answers must be required");
for (const answer of ["Yes", "Customer-managed", "Customer team", "Business hours", "Within 48 hours"]) await clickChoice(page, answer);
await page.getByRole("button", { name: /Build recommendation/ }).click();
await page.getByText("Get this complete recommendation by email", { exact: true }).waitFor();
console.log("final");
const finalText = await page.locator("body").innerText();
check(finalText.includes("to be decided on site visit"), "Not-sure deployment text missing");
check(finalText.includes("₹5,35,000 – ₹10,05,000"), "Scheduling device not included in total");
const email = page.locator('input[name="email"]');
const send = page.getByRole("button", { name: "Email me this BOM" });
check(await send.isDisabled(), "Empty email must keep Send disabled");
check((await page.locator("body").innerText()).includes("Enter an email address."), "Empty-email message missing");
await email.fill("bad-email");
check(await send.isDisabled(), "Malformed email must keep Send disabled");
check((await page.locator("body").innerText()).includes("Enter a valid email address"), "Malformed-email message missing");
await email.fill("buyer@example.com");
check(!(await send.isDisabled()), "Valid email should enable Send");
await send.click();
try {
  await page.getByText("Got it. We'll email your BOM to buyer@example.com shortly.", { exact: true }).waitFor({ timeout: 15_000 });
} catch (error) {
  console.error("Lead form after save:", await page.locator("form").last().innerText());
  throw error;
}

const leadsPassword = process.env.LEADS_TEST_PASSWORD;
check(Boolean(leadsPassword), "LEADS_TEST_PASSWORD is required for the protected-page walk");
const leadsPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await leadsPage.goto(`${baseUrl}/leads`, { waitUntil: "networkidle" });
const passwordInput = leadsPage.getByLabel("Password", { exact: true });
await passwordInput.fill("wrong-password");
await leadsPage.getByRole("button", { name: "View leads" }).click();
await leadsPage.getByText("That password is incorrect.", { exact: true }).waitFor();
await passwordInput.fill(leadsPassword);
await leadsPage.getByRole("button", { name: "View leads" }).click();
await leadsPage.getByText("buyer@example.com", { exact: true }).first().waitFor();
const savedLead = leadsPage.locator("details", { hasText: "buyer@example.com" }).first();
await savedLead.locator("summary").click();
check((await savedLead.innerText()).includes("Room scheduling device"), "Expanded lead is missing the scheduling device");
check((await savedLead.innerText()).includes("₹5,35,000 – ₹10,05,000"), "Lead summary has the wrong budget");

const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
await phone.goto(`${baseUrl}/leads`, { waitUntil: "networkidle" });
const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 0, `390px page overflows horizontally by ${overflow}px`);

console.log(JSON.stringify({
  desktop: "completed all 8 steps",
  finalBudget: "₹5,35,000 – ₹10,05,000",
  deployment: "to be decided on site visit",
  emailValidation: "empty, malformed, and valid states passed",
  leadSave: "saved and visible behind the password gate",
  phone390: "no horizontal scrolling",
}));

await browser.close();

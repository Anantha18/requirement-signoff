# Room BOM Configurator Implementation Plan

> **For agentic workers:** Execute this plan inline, task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the M0 shell with one page that accepts room dimensions, seats, Native/BYOD and email, then saves and displays an indicative INR bill of materials.

**Architecture:** A pure deterministic configurator classifies rooms from area and seats and returns generic equipment categories with low/high INR ranges. A Convex mutation runs that function, stores the completed configuration and writes first-use evidence in the same transaction. One client-side Next.js page calls the mutation and renders the returned BOM without navigation.

**Tech Stack:** Next.js 16, React 19, TypeScript, Convex 1.45, CSS Modules, Vitest and convex-test.

**Spec:** `IDEA_SCOPE.md`, amended by the builder's 29 Aug request for a one-page BOM configurator.

## Global Constraints

- One page and one form; results remain on the same page.
- Inputs: room length and width in feet, seats, Native/BYOD radio and required email.
- Output columns: item, category, quantity and indicative INR range, followed by total low/high band.
- Recommendations are generic categories, not vendor endorsements or purchase quotations.
- Email plus successful BOM generation is the first-use event.
- Convex and Vercel remain required; payments, XTEN and arbitrary document upload remain excluded.

---

### Task 1: Deterministic room configuration

**Files:** Create `convex/configurator.ts` and `convex/configurator.test.ts`.

**Interfaces:** Consumes `{ lengthFt, widthFt, seats, mode }`; produces `{ tier, areaSqFt, items, totalLow, totalHigh }` with item name, category, quantity, unit low/high and row low/high.

- [ ] Write failing tests for a 4-seat BYOD room, 10-seat Native room and 20-seat Native room.
- [ ] Run the focused test and confirm missing-module failure.
- [ ] Implement tiering using the stricter of area and seat count, fixed generic catalog rows and calculated totals.
- [ ] Rerun the focused tests and confirm all three pass.

### Task 2: Persistence and first-use evidence

**Files:** Modify `convex/schema.ts`; create `convex/configurations.ts` and `convex/configurations.test.ts`.

**Interfaces:** Consumes validated form values; produces the saved configuration ID and complete calculated result.

- [ ] Write a failing convex-test for one configuration plus one linked first-use record.
- [ ] Add `roomConfigurations` and an optional configuration link on `firstUseEvents` without breaking old brief records.
- [ ] Add `configurations.create`; reject invalid email, dimensions outside 6–60 feet and seats outside 1–32.
- [ ] Run all tests and push the functions to Convex development.

### Task 3: One-page form and result

**Files:** Create `src/app/convex-client-provider.tsx`; modify `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/page.module.css` and `src/app/globals.css`.

**Interfaces:** Consumes `api.configurations.create`; produces an accessible form plus responsive BOM and total band.

- [ ] Wrap the app in one stable Convex provider.
- [ ] Build native number, email and radio inputs with visible labels and errors.
- [ ] Call the mutation and render pending, error and success states on the same page.
- [ ] Format INR using `Intl.NumberFormat("en-IN")` and retain the AV-console visual system.

### Task 4: Verify, deploy and record

**Files:** Modify `IDEA_SCOPE.md`, `CHANGELOG.md` and `.interface-design/system.md`.

- [ ] Run `npm test`, `npm run lint` and `npm run build`.
- [ ] Deploy Convex production and Vercel production.
- [ ] Complete a fresh live configuration and verify its saved Convex record.
- [ ] Check desktop and phone screenshots for overflow and table readability.
- [ ] Commit, push and record what a user can now do.

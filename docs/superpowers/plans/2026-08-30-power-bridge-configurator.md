# Power Bridge Configurator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing AV estimator into an accessible eight-step configurator with Power Bridge visual language and real server-side BOM email delivery.

**Architecture:** Preserve `configureRoom` as the only priced recommendation engine. Add a pure wizard-data layer for unpriced choices and support coverage, a React wizard that preserves answers, optional Convex fields for the expanded record, and a Convex action that calls Resend before showing success.

**Tech Stack:** Next.js 16, React 19, TypeScript, Convex, Resend HTTP API, Vercel

**Spec:** User request dated 30 August 2026 and `IDEA_SCOPE.md`

## Global Constraints

- Never change existing BOM product names, quantities, rules or price ranges.
- Unknown products, compatibility, support packages and prices render as “To be confirmed”.
- No browser-side email secrets or false success states.
- Phone layout must fit 390px without horizontal scrolling.
- Every stage ends with tests, lint and build checks.

---

### Task 1: Add a tested recommendation view-model

**Files:** Create `src/app/configurator-data.ts`; create `src/app/configurator-data.test.ts`.

- [ ] Define platform, deployment, optional-device and five support-answer types.
- [ ] Map existing BOM items to core-equipment roles without adding items.
- [ ] Derive required accessories only from existing Infrastructure and Connectivity rows.
- [ ] Recommend low, medium or high coverage from support answers while labelling the commercial tier and price “To be confirmed”.
- [ ] Test all mappings and run tests, lint and build.

### Task 2: Build the responsive eight-step configurator

**Files:** Create `src/app/configurator.tsx`; replace `src/app/page.tsx`; replace `src/app/page.module.css`; update `src/app/globals.css` and `src/app/layout.tsx`.

- [ ] Add eight labelled progress points and persistent Back/Next state.
- [ ] Add Room, Platform, Deployment, Core equipment, Accessories, Additional devices, Support and Final screens.
- [ ] Ask support questions one at a time and allow a different coverage level.
- [ ] Add an accessible loading transition before Final.
- [ ] Keep the existing worked sample, calculation and final indicative budget.
- [ ] Apply Power Bridge colours, fonts, spacing, cards, buttons and visible focus states.
- [ ] Run tests, lint, build and desktop/390px screenshots.

### Task 3: Persist expanded choices without breaking old records

**Files:** Modify `convex/schema.ts`, `convex/configurations.ts`, `convex/configurations.test.ts`.

- [ ] Add optional platform, deployment, accessories, optional devices, support answers and coverage fields.
- [ ] Validate bounded arrays and values, then save them with the existing room and BOM record.
- [ ] Confirm older records remain valid and test the expanded save.
- [ ] Run Convex development deployment, tests, lint and build.

### Task 4: Send the complete BOM through Resend

**Files:** Create `convex/bomEmail.ts`, `convex/bomEmail.test.ts`, `convex/emails.ts`, `convex/emailLogs.ts`; modify `convex/schema.ts`.

- [ ] Build readable HTML and plain-text email bodies from priced BOM, optional items and support coverage.
- [ ] Add an injectable Resend client and test an accepted response plus invalid email.
- [ ] Send only from the Convex action using `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
- [ ] Log accepted or failed provider responses without secrets.
- [ ] Save the configuration only after Resend accepts the message.
- [ ] Return provider-backed success or a clear setup/provider failure.
- [ ] Run all checks and deploy Convex.

### Task 5: Verify and deploy

**Files:** Update `CHANGELOG.md`, `IDEA_SCOPE.md`, `.interface-design/system.md`.

- [ ] Test a complete Teams/appliance/high-coverage journey on desktop.
- [ ] Test a BYOD journey at 390px and confirm no horizontal overflow.
- [ ] Test invalid email; test provider success with the mocked Resend response.
- [ ] If live Resend variables are absent, confirm the live UI reports setup failure rather than success.
- [ ] Deploy Vercel, update `av-room-configurator.vercel.app`, verify HTTP 200 and push to GitHub.

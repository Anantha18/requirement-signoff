# Lead Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save completed AV configurations as leads and provide a password-protected lead viewer.

**Architecture:** A Convex mutation validates and recomputes the BOM before inserting a complete `leads` row. A separate Convex action checks `LEADS_PASSWORD` before returning leads newest first; the browser never stores the configured password. The existing Resend action and helper remain unchanged and unused by the configurator.

**Tech Stack:** Next.js 16, React 19, Convex, TypeScript, Vitest, CSS Modules.

**Spec:** User request dated 2026-08-30 in this conversation.

## Global Constraints

- Keep the current email validation.
- Show success only after Convex confirms the insert.
- Never hardcode or persist `LEADS_PASSWORD`.
- Leave all Resend code in place but unused.
- Preserve the BOM logic and current visual system.

---

### Task 1: Lead data and server functions

**Files:**
- Modify: `convex/schema.ts`
- Create: `convex/leads.ts`
- Create: `convex/leads.test.ts`

**Interfaces:**
- Consumes: current configuration validators, `configureRoom`, optional-device pricing.
- Produces: `api.leads.create` and `api.leads.listProtected`.

- [ ] Add a `leads` table containing normalized email, complete configuration, BOM items, total low/high, support level and `createdAt`, indexed by `createdAt`.
- [ ] Test that `create` validates email, recomputes the BOM, includes priced optional devices and stores one complete row.
- [ ] Test that `listProtected` rejects a wrong or missing password and returns newest-first data with the right password.
- [ ] Implement the mutation and protected action until the tests pass.

### Task 2: Replace email sending with lead capture

**Files:**
- Modify: `src/app/configurator.tsx`
- Test: `scripts/wizard-smoke.mjs`

**Interfaces:**
- Consumes: `api.leads.create`.
- Produces: the exact success message containing the normalized submitted address.

- [ ] Replace `useAction(api.emails.sendBom)` with `useMutation(api.leads.create)`.
- [ ] Keep empty and malformed email validation, disable duplicate submissions, and show a clear save failure.
- [ ] Show `Got it. We'll email your BOM to <address> shortly.` only after the mutation resolves.
- [ ] Update the local browser walk to confirm a successful save against the local Convex deployment.

### Task 3: Protected lead viewer

**Files:**
- Create: `src/app/leads/page.tsx`
- Create: `src/app/leads/leads-viewer.tsx`
- Create: `src/app/leads/leads.module.css`

**Interfaces:**
- Consumes: `api.leads.listProtected(password)`.
- Produces: `/leads` password state, newest-first summary rows, expandable full BOM rows, loading/empty/error states.

- [ ] Build a password form with an accessible label, loading state and visible error.
- [ ] Render email, date, room dimensions/seats and total budget for every lead.
- [ ] Use native `<details>` elements to expand the full BOM with quantity and price columns.
- [ ] Confirm the table/card layout does not scroll horizontally at 390px.

### Task 4: Verification and handoff

**Files:**
- Modify: `CHANGELOG.md`

- [ ] Run `npm run lint`, `npm test` and `npm run build`.
- [ ] Run the app locally and test lead creation, wrong password, correct password, newest-first ordering and expanded BOM at desktop and 390px.
- [ ] Confirm `convex/emails.ts` and `convex/bomEmail.ts` still exist and are no longer imported by the configurator.
- [ ] Report the exact command needed to set `LEADS_PASSWORD` in Convex production; do not deploy.

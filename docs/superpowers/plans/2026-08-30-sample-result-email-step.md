# Sample Result and Email Step Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a real worked BOM before the form, let visitors calculate without email, and save the completed configuration only when they request the list by email.

**Architecture:** Keep `configureRoom` as the only BOM calculator. The page computes the fixed example and visitor preview locally; the existing Convex mutation recomputes and saves the same inputs when email is submitted.

**Tech Stack:** Next.js 16, React 19, TypeScript, Convex, CSS Modules, Vercel

**Spec:** User request dated 30 August 2026 and `IDEA_SCOPE.md`

## Global Constraints

- Do not change BOM logic.
- Example inputs are 20 × 14 ft, 10 seats, Native.
- Email is not required to calculate a BOM.
- Convex saves email, room inputs and generated BOM after the Send action.
- Deploy the verified result to Vercel.

---

### Task 1: Separate preview from saving

**Files:**
- Modify: `src/app/page.tsx`
- Test: `convex/configurator.test.ts`

**Interfaces:**
- Consumes: `configureRoom({ lengthFt, widthFt, seats, mode })`
- Produces: local room-input state and `RoomConfiguration` preview

- [ ] Confirm the existing 20 × 14 ft Native test returns the expected BOM.
- [ ] Change the room form to call `configureRoom` without calling Convex.
- [ ] Store the submitted room and contact inputs for the later Send action.
- [ ] Run `npm test` and confirm all tests pass.

### Task 2: Add the worked example and email action

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.module.css`

**Interfaces:**
- Consumes: `configureRoom` and `api.configurations.create`
- Produces: example BOM table and post-result email form

- [ ] Compute the example once from the existing function.
- [ ] Render its exact item rows and total above Room details.
- [ ] Remove email from Room details.
- [ ] Render “Email me this list” and Send after the visitor result.
- [ ] Call Convex with the saved room inputs only from the email form.
- [ ] Show sending, success and error states.

### Task 3: Rename, verify and publish

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `CHANGELOG.md`
- Modify: `IDEA_SCOPE.md`

**Interfaces:**
- Produces: deployed public page at `https://av-room-configurator.vercel.app`

- [ ] Replace the header name with `<VIDEO CONFERENCING - DECODED & SIMPLIFIED>`.
- [ ] Run tests, lint and production build.
- [ ] Inspect desktop and phone screenshots.
- [ ] Deploy Convex only if its functions changed; deploy Vercel.
- [ ] Point the custom alias to the new deployment and verify HTTP 200.
- [ ] Save one clearly labelled production test and push the commit to GitHub.

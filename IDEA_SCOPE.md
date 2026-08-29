# IDEA_SCOPE.md

> This document is the control plane for the build. You wrote it; your coding agent reads it before every session. If a proposed change does not improve the active milestone's acceptance test or the rubric strategy, it goes in the parking lot.

## 0. scope status

| Field | Value |
|---|---|
| Event | GrowthX Build Week · Season 03 |
| Builder | Anantha Subramanian, solo, plus Codex |
| Build starts | Sat 29 Aug 2026, 11:00 AM IST |
| Submission deadline | Sat 5 Sep 2026, 11:00 AM IST |
| Demo | Sat 5 Sep 2026, 3:00 PM IST |
| Current milestone | M1 |
| Live URL | https://requirement-signoff.vercel.app |
| Public repo | https://github.com/Anantha18/requirement-signoff |
| Last updated | Sat 29 Aug 2026 |

### status language

- **Specified:** described here but not implemented.
- **Implemented:** code exists.
- **Working locally:** the golden path runs in the development environment.
- **Live:** the golden path runs at the Vercel URL, logged out, on a phone.
- **Verified:** acceptance tests have passed on the live URL.
- **Demo-ready:** reset, fallback, timing and the numbers screenshot have been rehearsed.

## 1. idea lock

| Decision | Locked answer |
|---|---|
| One-sentence product | A guided AV discovery tool that turns client answers into an approved meeting-room requirement brief. |
| The one person | An IT or facilities manager procuring one meeting room. |
| The one moment | Before asking an AV vendor for a final design and quote. |
| Current workaround | Verbal discussions plus a site-survey document, followed by clarification calls. |
| Core action (user does X → gets Y) | The client answers relevant room questions → receives and approves a clear scope brief. |
| The one outcome the product must deliver | An approved requirement brief that an AV consultant can use to begin BOM selection. |
| Hard input or hard case | The client gives conflicting answers or does not know the budget. |
| Primary track | Revenue |
| Riskiest assumption | Clients will complete a short guided discovery without Anantha conducting the interview. |
| The 30-minute no-code test for it | Send an eight-question WhatsApp prototype to one of Clients A–C and check whether they finish without a call. |
| First three users (names, where they are) | Confidential Clients A, B and C; reachable by WhatsApp, email and phone. |
| Tuesday channel (where those users already gather) | Anantha's LinkedIn network and industry community. |
| Personal artifact a user would screenshot | A Room Readiness summary showing agreed requirements and unresolved decisions. It is useful evidence, not a claimed viral loop. |
| Saturday numbers I expect to report | 3 real first uses, 3 client conversations, live product quality L3, $0 revenue and 0 waitlist entries. |
| Library lineage (card or proven build, if any) | None. |

### why this idea

#### the pain I feel

Anantha repeatedly spends time identifying AV needs before selecting a BOM. Requirements arrive through a site-survey document and verbal conversations, while budget is sometimes disclosed only verbally. Missing or disputed requirements create clarification calls and BOM revisions. Anantha has direct AV discovery and BOM-selection experience and can reach three clients on Monday.

#### decisive proof

A stranger opens the live URL, answers no more than eight questions for one meeting room, sees conflicts or missing decisions clearly, and produces a requirement brief that they approve. At the Saturday demo, a fresh input reaches an approved brief in under two minutes. Convex shows three real first-use records, while separate interview notes show three conversations confirming the pain.

## 2. user and job

### user

- Who (name, age, situation): A confidential IT or facilities manager responsible for procuring one meeting room; age is irrelevant and will not be collected.
- Context: They need to communicate usable requirements before an AV vendor creates the design and quote.
- Frequency: Whenever a new room is built, upgraded or standardised.
- Existing behaviour: Verbal calls, email or WhatsApp messages and a site-survey document.
- Existing cost, delay, risk or frustration: Repeated clarification, missed requirements, BOM revisions and budget mismatch.

### job to be done

> When preparing to request an AV design and quote for one meeting room, they need to agree and approve the requirements, so that the consultant can select a BOM without restarting discovery.

### definition of completion

The job is complete only when:

1. All eight discovery answers are saved, with unknown answers explicitly marked.
2. Conflicts and unresolved decisions are visible in the generated brief.
3. The client approves the brief or requests a change, and that state is stored in Convex.

Advice, a transcript, an extraction, search results or a chat response alone do not count unless they are themselves the final usable output.

## 3. product contract

### golden path

1. The client opens a public link and enters their email.
2. They answer up to eight questions about one meeting room: capacity, meeting platform, call mode, display use, camera coverage, audio needs, content sharing and budget status. The display question explains that a second display can keep remote participants visible while content is shared. The microphone question explains that ceiling audio may increase equipment and installation cost.
3. Deterministic rules show only relevant follow-ups and flag conflicting or unknown answers.
4. The product creates a plain-language requirement brief from the saved answers.
5. The client approves the brief or requests a change; Convex stores the action and timestamp.

### inputs

| Input | Format/source | Hard characteristics | Validation |
|---|---|---|---|
| Email | Typed by client | May be mistyped | Valid email format; required before first-use is counted |
| Room requirements | Eight-question web form | Unknown or conflicting answers are allowed | Required choice for every question, including “I don't know” |
| Budget status | Fixed bands plus “not disclosed” | Exact budget may be unavailable | Never force a made-up number; store the selected band or unknown state |
| Change request | Optional plain text | May be vague | Require at least 10 characters when “request changes” is selected |

### outputs and state changes

| Output/state change | Consumer | Required format | Proof of completion |
|---|---|---|---|
| Requirement brief | Client and AV consultant | Mobile-readable web page with copy button | Brief URL loads after closing and reopening |
| Unresolved-decisions list | Client | Each item states what decision is missing and why it matters | Hard-case test shows unknown budget without inventing it |
| Approval state | AV consultant | `draft`, `approved` or `changes_requested` with timestamp | Convex record and visible confirmation screen |
| First-use event | Builder/reviewer | One Convex row per real user who generates a brief | Convex table count and screenshot |

### what the product must remember

- within one session: answers, current question, validation errors and brief preview.
- across sessions (Convex tables): email, answers, generated brief, status, created time, approved/change-requested time and first-use event.
- what it must deliberately forget: no call recordings, no secret pricing, no BOM data and no unnecessary personal details.

### human review boundary

- What can be automated: question routing, conflict checks, brief assembly and status recording.
- What requires confirmation: final approval or request for changes.
- What must be escalated: contradictory platform/call-mode choices, unknown budget and unsupported room requirements.
- How uncertainty is exposed: label it “Decision needed”; never infer or hide it.

## 4. what makes it different

### the obvious version

A long digital site-survey form or open-ended chatbot that collects every possible AV detail and returns generic prose.

### the non-obvious choice

Ask only questions that change downstream BOM selection. Show what each unresolved answer affects. Use deterministic AV rules for truth; optional AI may improve wording but cannot add facts.

### the moment they screenshot

The Room Readiness summary shows agreed scope, approval status and the few decisions still blocking a reliable quote. It is useful to share internally, but reach will come from direct invites rather than a viral loop.

### ideas deliberately rejected

| Rejected mechanic | Reason |
|---|---|
| Generate a complete BOM | Compatibility and catalogue accuracy are too risky for 20 hours |
| Parse arbitrary site-survey files | Document variation could block the complete flow |
| Connect to XTEN | External integration is unverified and not needed for the job |
| AI conducts an unrestricted interview | Hard to control, test and keep factual |
| Multiple room types | Expands questions, rules and test cases before the first flow works |

## 5. dependencies

### verified capability matrix

| Required capability | Product/API/model | Exact endpoint/access | Limits | Verified how |
|---|---|---|---|---|
| Public hosting | Vercel | Vercel project connected to the public GitHub repo | Account and deployment access must be confirmed in M0 | Event-required stack; live deployment is the M0 proof |
| Database and server functions | Convex | Convex deployment configured through project environment variables | Account and deployment access must be confirmed in M0 | Event-required stack; write/read test is the M0 proof |
| Source control | GitHub | Public repository used by Vercel | Repository must open in a private window | Event-required stack; private-window check is the proof |
| Structured brief assembly | Application rules | Server function assembles stored answers into fixed sections | Supports only the eight locked questions and one room | No external dependency; three golden cases verify it |
| Optional wording improvement | OpenAI Responses API with Structured Outputs; model not selected | Server-side API access only; never expose key in browser | API key, model availability, cost and rate limits are unverified | Official OpenAI documentation confirms JSON-schema structured outputs: https://developers.openai.com/api/docs/guides/structured-outputs |
| Visitor analytics | PostHog | Project snippet on live URL; reviewer receives read-only access | Account/access must be confirmed Sunday | Live visit and read-only-link check |

### unsupported assumptions

- OpenAI API access and a suitable current model are unverified. AI rewriting is excluded from M1 unless M0 confirms the key, model, response shape and latency in one test.
- XTEN integration, arbitrary document parsing, telephony, voice, scraping and equipment recommendations cannot enter the critical path.
- “Why now” stays at L2 unless an official dated source proves a stronger recent unlock.

### secrets and access

Required credentials belong only in Convex or Vercel environment variables. Expected names are `OPENAI_API_KEY` if optional rewriting is enabled and the normal deployment credentials handled by Convex and Vercel. Never place secret values in this document or the public repo.

## 6. rubric strategy

Pick **one primary track**: Virality, Revenue or AI Agent as a Service. You are scored on that track's rubric (version 2.2.0, in full in the rubric source). Every row is scored L1 to L5 independently; points per row = (L − 1) × weight. Wins in the other two tracks count as bonus at 0.5x weight, capped at 50 points, with the same evidence requirement. Shipping is the floor: a product that is not live scores nothing. Record a separate current level, target and proof for every row. The same piece of evidence does not raise two rows.

### primary track

| Decision | Answer |
|---|---|
| Primary track | Revenue |
| Why this track fits the idea and my advantage | Anantha has direct operator experience and three reachable clients. The product completes a commercial discovery job, while payment and mass reach are not realistic this week. |
| The one thing the track needs (a personal artifact people share / a named user who pays this week / a real task on a real surface unattended) | A named confidential user who completes the product and confirms the pain. Payment is explicitly outside this build, so no revenue claim will be made. |

### the track's rows

**Revenue (176 base + overflow)**

| Row | Weight | Max base | Current level | Target level | Target points (L−1)×weight | Observable proof | Work required | Milestone |
|---|---:|---:|---|---|---:|---|---|---|
| Signups | 20x | 80 | L1: 0 | L2: 1–50 | 20 | Three non-builder emails plus first-use events in Convex | Public email entry, brief generation and first-use write | M2 |
| Live product quality | 8x | 32 | L1: broken/not built | L3: working product, does what it claims | 16 | Fresh user completes and approves a brief on phone without help | Complete golden path, persistence, validation and clear mobile layout | M1–M4 |
| Revenue generated (USD) | 4x | 16 | L1: $0 | L1: $0 | 0 | Honest $0 statement | No payment work | M5 |
| Waitlist | 4x | 16 | L1: 0 | L1: 0 | 0 | Honest 0 statement | No waitlist work | M5 |
| Pain point severity | 2x | 8 | L1: no event-week conversations | L4: named user, 3+ conversations confirming pain, quotes | 6 | Notes for Clients A–C with anonymous approved quotes | Three Monday sessions and consent to quote anonymously | M2 |
| SOM (bottoms-up math) | 2x | 8 | L1: no math | L3: users × ACV correct, under ₹10 crore | 4 | Written narrow user count × realistic annual product price | Get beachhead count source and price evidence; show units | M4 |
| Right to win | 2x | 8 | L3: some domain exposure | L4: direct operator experience, clear insight | 6 | Discovery rules visibly map questions to BOM-relevant decisions | Encode and explain eight AV selection rules | M1 |
| Why now | 1x | 4 | L1: no claim | L2: riding general trends | 1 | Honest statement; no stronger unsupported timing claim | Keep optional AI out of the core claim | M5 |
| Moat and defensibility | 1x | 4 | L1: copyable in a weekend | L2: thin, first-mover only | 1 | Honest statement that rules show expertise but do not yet compound | No moat feature work | M5 |
| **Revenue total** | | **176** | | **Target: 54 points** | **54** | | | |

### bonus-eligible rows from the other tracks (0.5x, 50-point cap, same evidence)

| Source track | Row | Original weight | Bonus weight | Max bonus | Will I claim it? | Proof |
|---|---|---:|---:|---:|---|---|
| Virality | Signups | 25x | 12.5x | 50 | No | Revenue signup evidence will not be counted twice |
| Virality | Visitors | 10x | 5x | 20 | Only if 51+ verified unique visitors arise independently | PostHog read-only analytics |
| Virality | Reactions + comments | 2x | 1x | 4 | Only if 15+ genuine reactions arise | LinkedIn/community analytics screenshot |
| AI Agent as a Service | Real output shipping | 20x | 10x | 40 | No | Approval remains human-confirmed and is not autonomous agent output |
| AI Agent as a Service | Observability | 7x | 3.5x | 14 | No | A product analytics page is not agent observability |

### level anchors (short form; the full ladders are in the rubric source)

- **Signups (Revenue)** (email + first-use event): L2 1–50 · L3 51+ · L4 251+ · L5 751+, then +20 per 100.
- **Live product quality:** L1 broken · L2 rough MVP, happy path only · L3 does what it claims · L4 polished, noticeably better than alternatives · L5 a user cannot tell it was built in a week.
- **Revenue generated** (product revenue only, not services): L2 up to $100 · L3 $100+ · L4 $500+ · L5 $2,000+, then +15 per $500.
- **Waitlist:** L2 1+ · L3 151+ · L4 751+ · L5 3,000+, then +4 per 500.
- **Pain point severity:** L2 vague persona · L3 named user, 1–2 conversations · L4 named user, 3+ conversations, quotes · L5 5+ conversations and a “can I pay for this now” moment.
- **SOM:** L2 math attempted but wrong · L3 users × ACV correct, under ₹10 cr · L4 ₹10 cr to ₹1,000 cr · L5 over ₹1,000 cr with a defensible beachhead.
- **Right to win:** L2 generic interest · L3 some domain exposure · L4 direct operator experience, clear insight · L5 deep founder-market fit visible in the build.
- **Why now:** L2 riding general trends · L3 clear tailwind in 2 years · L4 specific unlock in 12 months · L5 window opened under 6 months ago, visible in the product.
- **Moat and defensibility:** L2 thin, first-mover only · L3 workflow lock-in, integrations, taste · L4 data flywheel, network effects · L5 compounding moat.

### evidence caps and anti-spoof

L4 or L5 needs verifiable evidence or the row caps at L3. No evidence, no bonus. No visitor claim will be made without read-only PostHog access. Test accounts do not count as signups.

### where the points are

The two rows to build for are signups (20x) and live product quality (8x). The signup ceiling is L2 with three reachable users, so effort goes first to a complete, credible flow and then to getting all three clients through it.

### competence floor

Pain evidence, SOM math, right to win and honest market claims must be documented, but they do not receive feature time before the golden path works live.

### rubric traps

Do not build a dashboard nobody uses, count test accounts, call a generated draft “approved,” claim visitors without read-only analytics, count one event as two rows, add multiple agents, or describe optional AI wording as the product's core value.

## 7. gtm plan

### where the users already are

| Channel (group, feed, thread, office floor) | Who is there | How I reach them (post, DM, invite) | When (day) |
|---|---|---|---|
| WhatsApp/email/phone | Confidential Clients A, B and C | Individual invite to complete one real room brief while observed | Monday |
| LinkedIn network | IT, facilities and AV contacts | Personal launch post plus direct messages | Tuesday |
| Industry community | AV practitioners and buyers | Post the live link and ask for one-room trials | Tuesday |

### distribution posts, in my own words

- Monday, after the first three users: “I tested a shorter way to lock meeting-room requirements before starting a BOM. Three client sessions showed me exactly where the questions were unclear. I fixed the biggest blocker tonight.”
- Tuesday, the launch post: “I spend too much time turning calls and site-survey notes into requirements that are clear enough for AV design. I built a small tool that asks only the questions that affect the BOM, flags decisions still missing and creates an approval-ready brief. Try it for one meeting room: [live URL].”
- Wednesday to Friday, one update each evening (what changed, one number): “Tonight I fixed [one observed blocker]. [verified number] people have now completed a room brief. If you plan meeting rooms, try one and tell me where you stop: [live URL].”
- Saturday, the shipped post: “I shipped Requirement Sign-off for AV projects. A client can answer eight questions, see unresolved decisions and approve a reusable meeting-room brief. This week: [verified first uses], [verified interviews], and [verified completion result]. Live product: [URL]. Public repo: [URL].”

Anantha must edit each post so it sounds natural before publishing; the facts and numbers must remain verifiable.

### targets, per band of my track's rows

| Row | Track | Floor I will hit (band) | Stretch (band) | How I will know (source) |
|---|---|---|---|---|
| Signups | Revenue | L2: 1–50, with 3 intended | Remain L2; aim for 10 completions | Convex first-use table screenshot |
| Live product quality | Revenue | L3: working product, does what it claims | L4 only if strangers find it polished and noticeably better | Live phone tests and completion notes |
| Revenue generated | Revenue | L1: $0 | L1: $0 | Honest submission statement |
| Waitlist | Revenue | L1: 0 | L1: 0 | Honest submission statement |
| Pain point severity | Revenue | L4: 3+ conversations and quotes | L5 only if 5+ conversations and a spontaneous request to pay | Interview notes and approved anonymous quotes |
| SOM | Revenue | L3: correct users × ACV, under ₹10 cr | L4 only if sourced math honestly reaches ₹10 cr+ | Written calculation and source links |
| Right to win | Revenue | L4: direct experience and clear insight | L4 | Visible discovery rules and manual comparison |
| Why now | Revenue | L2: general trend | L3 only with a verified two-year tailwind | Official dated source |
| Moat and defensibility | Revenue | L2: thin | L2 | Honest written assessment |
| Visitors to product | Virality bonus | No claim below 51 verified visitors | L2: 51–250 | PostHog read-only access |
| Reactions and comments | Virality bonus | No claim below 15 | L2: 15–50 | Platform analytics screenshots |

### analytics setup (do this on Sunday, not Saturday)

- Analytics tool installed on the live URL: PostHog.
- Read-only access created and the link saved: verify with a private-window reviewer account on Sunday.
- Signup or first-use event writes to Convex: count only after email plus generated brief.
- Payment link, if any: none; payments are outside this build.

### the numbers I will report on Saturday

- Signups: Convex count of unique real emails with a first-use event; screenshot and table view.
- Live product quality: two consecutive live runs plus three user completion notes.
- Revenue: $0; no payment claim.
- Waitlist: 0; no waitlist claim.
- Pain severity: three dated conversation notes and approved anonymous quotes.
- SOM: sourced target-user count × realistic annual product price, with units shown.
- Right to win: eight rules and one example showing why each answer affects BOM selection.
- Why now: L2 unless a stronger official dated source is added.
- Moat: L2, honestly stated.
- Bonus visitors or reactions: claim only if the minimum band is met with separate evidence.

## 8. the milestone ladder

Every milestone has a purpose, what is required, an acceptance test, and an “if I am behind, cut to this” fallback. Dates are fixed by the event.

### M0 — feasibility and setup (Sat 29 Aug, before 2:00 PM)

**Purpose:** kill the unknown critical dependency and the riskiest assumption early.

Required:
- Setup page complete: GitHub, Vercel, Convex accounts; Codex logged in; skills installed.
- Send the eight-question WhatsApp prototype to one client and record whether they complete it without a call.
- Manually turn the answers into the exact brief format; identify confusing questions.
- If optional OpenAI rewriting is considered, send one representative answer object through the Responses API, verify schema, latency and model access; failure removes AI from the week.
- Repository created, empty app deployed to Vercel, URL opens.

Acceptance test:

> The empty app is live at a public URL, the repo exists, and the riskiest assumption has a written pass/fail result from a real client.

Stop condition:

> If a client will not complete eight WhatsApp questions without an interview, switch M1 to a consultant-led phone flow where Anantha enters answers while the client confirms each one. If GitHub, Convex or Vercel cannot work by 4:00 PM Saturday, ask the Build Week channel before losing another hour.

### M1 — one ugly complete flow (Sat 29 Aug evening → Sun 30 Aug)

**Purpose:** the smallest end-to-end version of the core action, working without explanation. Milestone 02 of the week.

**Rubric intent:** Revenue live product quality L2–L3 and right-to-win L4 through visible AV rules.

Required:
- one meeting-room flow with eight locked questions;
- deterministic branching and conflict/unknown checks;
- one final brief with agreed scope and unresolved decisions;
- approve or request-changes action;
- email, answers, brief, state and first-use event stored in Convex;
- deployed to Vercel and pushed to GitHub.

Explicitly excluded: polished design, multiple room types, arbitrary document upload, XTEN, BOM generation, payments, a builder dashboard and optional AI if its M0 check failed.

Acceptance test:

> Someone who has never seen the product answers the eight questions, generates a brief and approves it at the live URL on their phone without Anantha talking.

If I am behind, cut to: one page containing eight fixed questions, a deterministic text summary and one approve button; hardcode all branching and omit AI and PDF export.

### M2 — first users (Mon 31 Aug, evening)

**Purpose:** milestone 03. Three people who have the problem use it while Anantha watches.

Required:
- Clients A, B and C invited before the evening starts;
- each generates a brief, creating a first-use row in Convex;
- one note per user records where they stopped or hesitated;
- ask permission to use one anonymous quote from each;
- name the single biggest blocker.

Acceptance test:

> Three Convex first-use rows that are not Anantha, three dated notes and one sentence naming the biggest blocker.

If I am behind, cut to: one client on a screen-shared call completing the live flow, then schedule the other two for Tuesday before distribution.

### M3 — distribute (Tue 1 Sep, evening)

**Purpose:** milestone 04. Share where AV buyers and practitioners already spend time and track responses.

Required:
- PostHog live with verified read-only access;
- launch post edited into Anantha's own words and published on LinkedIn and the industry community;
- direct invites sent to relevant contacts, with count recorded;
- visitors and first uses checked and screenshotted that night.

Acceptance test:

> Both posts are live, direct invites are sent, and the day's PostHog visitors and Convex first uses are written down with screenshots.

If I am behind, cut to: twenty relevant direct messages with the live link; skip the public post but keep tracking.

### M4 — build, user calls, build again (Wed 2 → Fri 4 Sep, evenings)

**Purpose:** milestone 05. Fix observed blockers, not personal polish preferences.

Required each evening:
- one user conversation;
- one highest-impact blocker fixed, tested and deployed;
- one update posted with one verified number;
- Revenue table re-scored without double-counting evidence;
- one line added to `CHANGELOG.md`: what a user can now do that they could not before.

Rubric intent: protect signups L2, move live product quality securely to L3, collect pain evidence for L4, and document correct SOM math without stealing build time.

Acceptance test:

> Three deploys across three evenings, each with a CHANGELOG line, and the live golden path still passes after every deploy.

If I am behind, cut to: fix only the blocker stopping the most users; make no new feature and do not add AI, export formats or another room type.

### M5 — verify and submit (Fri 4 Sep night → Sat 5 Sep, 11:00 AM)

**Purpose:** milestone 06. No new features.

Required:
- core action works logged out on a phone;
- data survives closing and reopening;
- public repo opens in a private window;
- Convex, PostHog, post analytics and interview evidence captured;
- every Revenue row self-scored honestly, with $0 revenue and 0 waitlist stated;
- one honest product paragraph, live URL and repo URL prepared;
- submitted before 11:00 AM IST.

Acceptance test:

> Two consecutive runs of the demo script on the live URL, one on someone else's device, followed by successful submission before 11:00 AM.

If I am behind, cut to: submit the verified M1 flow, three real-use records and honest current numbers; do not repair cosmetic issues after Friday night.

### M6 — demo (Sat 5 Sep, 3:00 PM)

Show what shipped and reproduce the numbers live. Do not pitch future BOM generation.

## 9. demo contract (Saturday 3:00 PM)

### one-sentence setup

AV consultants lose time when verbal client needs and site-survey details are not agreed before BOM selection, so this tool produces an approved requirement brief first.

### the proof

| Time | What happens | What the reviewer sees | Rubric row it supports |
|---:|---|---|---|
| 0–15s | Name the confidential IT/facilities user and current clarification workflow | One sentence about repeated clarification and BOM revision | Pain point severity |
| 15–60s | Complete the eight questions on a fresh hard input | Conflicts and unknown budget stay visible; a usable brief appears | Live product quality; right to win |
| 60–90s | Approve the brief, reopen it, then show Convex | Persistent approved state and real first-use count | Signups |
| 90–120s | Show one observed blocker and the deployed change | Dated user note, CHANGELOG line and current live behaviour | Pain point severity; live product quality |

### live input

A 10-seat meeting room using Microsoft Teams Rooms, dual display, local and remote content sharing, front-of-room camera coverage, ceiling audio preferred and budget not disclosed.

### fallback input

A 6-seat BYOD room using Zoom from laptops, single display, USB camera, tabletop audio and a ₹3–5 lakh budget band.

### the number I lead with

Three real clients completed a requirement brief; use the verified count if it differs.

### claims I can prove

- A client can complete and approve one meeting-room requirement brief.
- Unknown and conflicting answers remain visible.
- Real first-use events are stored in Convex.
- Three client conversations occurred only if dated notes exist.

### claims I must not make

- The product generates or validates a BOM.
- The product integrates with XTEN.
- The product has paying customers, a moat or autonomous agents.
- Any L4/L5 claim without its separate verifiable evidence.

## 10. test plan

### golden cases

| Case | Why representative | Expected final output | Status |
|---|---|---|---|
| 1. 10-seat Microsoft Teams Room, dual display, budget unknown | Enterprise room with an unresolved commercial input | Complete brief plus “budget decision needed”; can be approved | Specified |
| 2. 6-seat BYOD Zoom room, single display, known budget band | Smaller SMB/mid-market room with clear constraints | Complete brief with no invented room-system requirement | Specified |
| 3. Client selects room system and laptop-only BYOD as exclusive modes | Representative conflicting input | Conflict appears before approval; recovery link returns to the relevant answer | Specified |

### failure cases

| Failure | Expected behaviour | User recovery | Tested? |
|---|---|---|---|
| Ambiguous input | Store “I don't know” and show the affected decision in the brief | Edit the specific answer before or after generating | No |
| Unsupported input | Explain that v1 covers one standard meeting room only | Continue with supported assumptions or stop without losing saved answers | No |
| API timeout or failure | Deterministic brief still generates; optional wording improvement is skipped | Retry wording only; approval remains available | No |
| Empty result | No blank brief is saved; show a clear error | Return to answers and regenerate | No |

## 11. risk register

| Risk | Probability | Damage | Earliest test | Mitigation | Fallback |
|---|---|---|---|---|---|
| Clients will not self-complete | High | No first uses | 30-minute WhatsApp test on Saturday | Eight questions maximum; explain why each matters | Consultant-led phone flow with client confirmation |
| Questions miss a BOM-changing requirement | Medium | Brief is not usable | Manual comparison with sample survey | Anantha reviews every locked question and expected effect | Add only the missing blocking question; keep eight by replacing a weaker one |
| AI invents facts | Medium | Trust damage | One hard input in M0 | Deterministic facts; AI wording optional and schema-constrained | Disable AI and use fixed template |
| Coding or visual design consumes Sunday | High | Product not live | Empty deployment in M0 | One page, native controls, no custom design system | Fixed form, summary and approve button only |
| Client data becomes public | Low | Serious trust damage | Inspect public routes before M2 | Unlisted random brief IDs; collect minimal information | Demo with consented synthetic content; never expose client names |
| Distribution brings few users | High | Signup ceiling remains L2 | Tuesday count | Direct messages before public posting | Optimise for three verified users and strong pain evidence |

### pre-mortem

It is Saturday 11:00 AM and the product is not submitted, or is submitted with no users, because:

1. The discovery flow became longer than eight questions and was never completed; prevent this with a locked question count and one-room scope.
2. Optional AI or visual polish blocked the deterministic flow; remove both immediately if M1 is not live by Sunday afternoon.
3. Clients A–C were not scheduled before Monday; send invitations during M0 and use a guided phone fallback if self-service fails.

## 12. non-goals

Explicitly outside this week's build:

1. BOM generation, product recommendations, compatibility checking or tentative price calculations.
2. XTEN, telephony, voice, scraping, arbitrary document upload, payments or waitlist collection.
3. Multiple room types, multi-room projects, a builder dashboard, user roles or a general-purpose AI interviewer.

Any change to these requires a written scope decision in section 15.

## 13. parking lot

| Idea | Potential value | Why not now | Revisit after |
|---|---|---|---|
| BOM generation from approved brief | Completes the next consultant task | Accuracy and catalogue risk | Saturday demo |
| XTEN export or integration | Removes re-entry work | Access and API unverified | Saturday demo |
| Upload the existing site-survey document | Reduces form entry | Parsing variation threatens M1 | Ten successful live briefs |
| Additional room types | Expands usefulness | Multiplies rules and tests | Ten successful live briefs |
| PDF export | Familiar client artifact | Browser page and copy action complete the v1 job | M4 only if users cannot share the page |
| AI adaptive interviewer | More conversational discovery | Harder to control and evaluate | After fixed-flow completion data |
| Payment | Tests willingness to pay | Builder explicitly excluded payment this week | After Build Week |

## 14. current state

### active milestone

M1 — one ugly complete flow.

### implemented

- Next.js 16 application shell with the Requirement Sign-off visual direction.
- Convex project with development and production deployments.
- Vercel production project with Convex production URLs configured.

### working locally

- The M0 shell passes ESLint, TypeScript and the production build.

### live

- Public shell: https://requirement-signoff.vercel.app
- Public repository: https://github.com/Anantha18/requirement-signoff
- Convex production deployment is ready.

### verified

- Idea lock approved.
- Three confidential clients are reachable by phone, WhatsApp or email.
- Sample site-survey document and tentative pricing catalogue exist.
- The riskiest-assumption test passed: one client completed all eight WhatsApp questions without a call in approximately 2–5 minutes.
- The test exposed two comprehension issues: the client needed the reason for two displays and needed warning that ceiling microphones can materially affect cost.
- The anonymous answers were converted into a manual brief, and Anantha confirmed it contains enough information to begin BOM selection. Evidence is saved in `M0_TEST_RESULT.md`.
- Official OpenAI documentation confirms Structured Outputs can follow a JSON schema; API key and model access remain unverified.
- The live URL returned HTTP 200 with the correct product title.
- The public GitHub repository returned HTTP 200.
- Convex production deployed successfully and Vercel has both public Convex URLs.

### current blocker

The eight-question product flow, brief persistence and approval actions are not implemented yet.

### next single action

Define the Convex schema for briefs and first-use events, starting with a failing schema/function test.

## 15. decision log

| Time | Decision | Evidence/reason | Scope impact |
|---|---|---|---|
| Sat 29 Aug 2026 | Choose Requirement Sign-off | Best risk-adjusted fit for 20 hours, direct AV discovery pain and three reachable users | Reject BOM generation and integrations |
| Sat 29 Aug 2026 | Choose Revenue as primary track | Direct users and product-quality proof fit better than mass reach or autonomous agent output | Build for signups L2 and live quality L3 |
| Sat 29 Aug 2026 | Exclude payments | Builder requested payment stay outside the build | Revenue row remains L1 |
| Sat 29 Aug 2026 | Use deterministic branching | Prevent invented requirements and protect Sunday delivery | AI wording is optional, never critical |
| Sat 29 Aug 2026 | Approve the idea lock | Builder explicitly approved Phase 6 lock | Scope generation authorised |
| Sat 29 Aug 2026 | Keep the self-serve interaction | One client completed all eight questions without a call in 2–5 minutes | Riskiest assumption passed; no consultant-led fallback needed for M1 |
| Sat 29 Aug 2026 | Explain display and microphone trade-offs in the questions | Client did not know why two displays are useful and noted that microphone choice changes cost | Q4 explains participant/content use; Q7 warns about installation-cost impact |
| Sat 29 Aug 2026 | Accept the eight-question discovery set for M1 | Anantha confirmed the client's answers are enough to begin BOM selection | Manual brief completed; proceed to empty-app setup |
| Sat 29 Aug 2026 | Complete M0 and start M1 | Live URL, public repo and Convex production were verified; the no-code test passed | Active milestone moves to the complete eight-question flow |

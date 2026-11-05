# SCR-006 — About Us implementation record

Last verified: 2026-11-05. Owner: frontend team; acceptance pending.

## Scope and design
Industrial editorial: navy/orange, Sora headings, existing body typography and 24/32/48/96px rhythm retained for Stitch consistency. Sparse hover motion; pulse respects reduced motion. DFII 14 (4+5+5+4-4). Existing marketing sections and data preserved. No new dependencies.

## Capability parity
| Capability | Result | Evidence |
| --- | --- | --- |
| Corporate story, principles, milestones, leadership | Preserved | Six about-us feature components |
| Public access | Preserved | Existing /company/about route has no auth guard |
| Landing shell | Updated | AboutUsPage composes LandingLayout, single main |
| Join network / strategic partnership | Fixed | /company/contact |
| Impact figures | Fixed | #bao-cao resolves to existing four metrics; no downloadable report is claimed |
| Home and contact navigation | Preserved/fixed | About navbar links to / and /company/contact |
| API/cache/form/global state | Not applicable | Static marketing content; no request or form |
| Empty/API error/success toast | Not applicable | No dynamic dataset or mutation |

Screen sections remain feature-specific; LandingLayout is the existing reusable structural shell. No entity models or generic primitives needed.

## Verification
- npm run typecheck: passed.
- npm run lint: passed, no warnings.
- npm run build: passed.
- npm run test: existing 25 files / 193 tests passed; payment tests emitted network AggregateError stderr, so global zero-runtime-error acceptance remains open.
- New AboutUsPage test: 1 passed; checks single main/h1, contact destinations, impact anchor and home link.
- Browser visual comparison, external asset availability, keyboard and viewport checks: not performed; pending acceptance.
- Referenced docs/ui-redesign-discovery/detail-screens/SCR-006-about-us.md was not found. Available discovery: ../stitch_smartparkinghub_visual_dna_analysis/scr_006_about_us.md. No original Stitch HTML was located during this scoped repair; visual fidelity is not certified.

# Booking schedule pre-PR review

- Reviewed on 2026-11-17 against origin/main `d4975fb`, pulled before committing.
- Approved scope: booking schedule, duration/arrival usability and removal of request-rate waiting. Parking-detail photos/gallery/pricing presentation is excluded and preserved separately in the workspace.

## Findings resolved

| Severity | Finding | Resolution and evidence |
| --- | --- | --- |
| P2 | Clicking the currently selected duration cleared an explicitly selected physical slot. | The active preset no longer publishes an unchanged duration. A regression failed before the fix and passed afterwards; changing duration still clears the slot. |
| P2 | Default overnight fixtures returned the first day's timeline for subsequent dates, producing duplicate React keys and hiding date-contract defects in tests. | Fixtures now honor the request date. Added a fixed late-evening regression and verified no duplicate-key diagnostics in the final complete test run. |
| P2 | Existing unpaid-hold E2E scenarios did not provide the new timeline/availability contracts, preventing the reservation from reaching the intended backend-restriction assertions. | Added the shared schedule fixture; vehicle-limit and cooldown tests again exercise their intended rejection and explicit retry paths. |

No unresolved P1/P2 defect was identified after these corrections. Final verification is local; it does not replace backend acceptance or production monitoring.

## Reviewed behavior

- The shared form owns vehicle/start/end/duration/slot values through the existing React Hook Form/Zod flow; server cache remains in TanStack Query.
- Full/buffer/past arrival choices use the raw selected-day timeline, expose native disabled state and readable labels, and are skipped during keyboard selection. Capacity refresh does not silently rewrite the user's chosen hour.
- A free arrival block does not imply a free complete stay: successful full-window availability and compatible physical-slot selection still gate submission.
- Overnight display uses exact Vietnam dates and excludes checkout from the occupied interval. Continued pages retain the selected slot filter and do not force-scroll on background refresh.
- Quick duration controls retain the two-hour default; custom whole hours plus half hours support longer stays and reject empty/invalid inputs.
- RATE_LIMIT responses from an older backend never create local countdown locks, success states or automatic bookings; explicit retry retains the original requestId. Other hold restrictions and payment authority are preserved.
- Existing loading/error/retry states, modal Escape/focus behavior, confirmed QR visibility and PayOS/wallet flow were inspected.
- No new dependency, endpoint or permission was invented. Photo/gallery-specific API typing and detail-page changes are outside this PR.

## Verification

| Check | Result |
| --- | --- |
| `npm run test -- --maxWorkers=4 --reporter=dot` | 98 files, 902 tests passed |
| `npm run lint` | Passed |
| `npm run build` including all TypeScript project references | Passed |
| Complete CI Playwright list under Vite dev | 67 scenarios passed |
| Matching backend whole-suite run | 841 passed, 13 environment-gated skips; schedule concurrency/preservation separately passed 15 MySQL cases |

The initial expanded browser run used production preview; four QR/local-demo scenarios required the Vite dev environment used by CI, and four unpaid-hold cases revealed the missing schedule fixture described above. The browser suite was rerun under Vite dev after correcting that fixture. The final result is recorded in the PR description rather than treating the initial failures as application successes. Existing unrelated layout tests emit mocked-network stderr while passing.

## Release dependency

The matching backend change introduces `/timeline` and full-window `/availability`, Parking V9 and Booking V12. Release Parking, then Booking, then this frontend. UI verification uses mocked HTTP; no payment was sent and no production service was changed. CI now includes the new schedule and legacy-rate-error browser cases.

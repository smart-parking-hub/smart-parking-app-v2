# PayOS return/cancel recovery implementation

Owner: SPH frontend. `last_verified`: 2026-11-15.

Approved plan: `D:/DuAnOjt/plans/payos-return-recovery-ux-2026-11-15.md`.

## Outcome and cause

The actual `/payment/cancel` router used the old demo-heavy page while earlier cancellation E2E tests replaced main.tsx with a harness pointing at a different component. The old API swallowed errors and returned demo-repay-checkout. This report supersedes any claim that those harness tests verified the actual cancel route.

All root and driver/dashboard cancel/success aliases now compose the same PaymentResultPage; `/payment/return` uses it as well. The old PaymentCancelPage export is a compatibility wrapper. The legacy adapter uses canonical booking-flow requests and propagates failures; the demo ticket merge, fake countdown, false success and fallback checkout URL are removed from runtime.

## Capability parity

| Previous capability | Current behavior | Classification |
| --- | --- | --- |
| Read pending ticket | Authenticated server booking, with visible loading/error/denied states | Preserved; no demo replacement |
| Repay deposit | Server-approved retry/resume; POST canonical payments API; real URL only | Changed per approved plan |
| Cancel/release booking | Separate disclosure and confirmation, only an eligible pending deposit; API failures stay visible | Preserved with explicit confirmation |
| Demo confirm button | Absent from consumer result; existing development tool remains on booking screen/backend-gated | Approved removal from result |
| Hold timer | Actual expiresAt in UTC+7, never reset; final-payment screen has none | Corrected |
| Berth blueprint, next vehicle, fake session/hotline | Removed from runtime because unsupported by real booking data | Approved removal of demo content |
| Back to bookings/search | Explicit safe links; bookings?bookingId opens the server-owned ticket even outside current page | Preserved/improved |
| Support | Existing disputes route; no invented phone number | Preserved |

## UI and placement

PaymentResultPage and paymentRecovery belong to booking-flow (payment business logic); no new shared component or dependency. Uses existing Dialog, buttons/tokens and time formatting. One centered column, real lot/plate/schedule/code/amount, one primary action. Pending/paid/lag/expired/cancelled/refunded/review/error/missing states differ. Cancel URL flags cannot override server success. Copy is secondary; booking cancellation requires confirmation. No iframe on local hosts. Hosted checkout revalidates the server link on click and does not reuse a restored BFCache panel. Payment result chrome keeps the driver header and hides footer/Copilot to avoid covering actions.

Server state uses TanStack Query. Return sync runs before reading the booking; focus/pageshow revalidates. A paid payment with delayed booking update gets bounded polling and no extra payment/QR. Retry/resume require new server capability flags; older backend responses safely show a status check instead. Deposit expiry disables retry and requests current server state. A sync error can still show independently fetched booking data without granting payment permission.

## Verification

- Regression tests first reproduced six backend recovery/identity failures before the service fix.
- Frontend targeted component/adapter/state tests, actual production-router Chrome E2E, full frontend unit suite, lint, typecheck and production build: see command logs under `D:/DuAnOjt/.artifacts/payos-recovery-*` for exact final outcomes.
- Browser tests mock HTTP provider/API boundaries only; they do not replace application bootstrap or routes. Covers deposit/final cancellation/retry/reload, all five route aliases, server success despite cancel query flags, pending, expired, review, forbidden, sync failure, missing ID. Mobile/desktop screenshots and horizontal overflow checks included.
- Backend and MySQL migration/concurrency details: `smart-parking-service-microservice/docs/api-contracts/payos-payment-recovery.md`.

Limitations: actual banking transfers/webhook delivery and production rollout are not exercised. Existing RegisterPage hook-dependency lint warning is unrelated and retained. Concurrent bank/withdrawal/merchant dashboard/detail changes in the shared workspace are outside this task.

## Final observed results

| Check | Result |
| --- | --- |
| Full frontend Vitest suite | 85 files, 752 tests PASS (`payos-recovery-all-frontend-complete.log`) |
| Actual application-router Chrome journeys | 24 PASS; 390/768/1440px, Back, preserved login destination, cancel/retry/success and QR journey (`payos-recovery-verified-e2e.log`) |
| Production build | PASS; final typecheck included by `tsc -b` |
| Scoped ESLint | 0 errors, 0 warnings; global lint retains 1 existing RegisterPage warning |
| Payment service suite | 162 cases, 159 PASS, 3 conditional skips |
| Explicit MySQL 8.4 test run | 6 PASS, including two-request races, timeout persistence and additive migration preservation |

The browser API/provider boundaries are fixtures, not evidence of a live bank transfer. Screenshots under `.artifacts/payos-recovery/verified-routes` were visually reviewed; header no longer covers the result and Copilot no longer overlaps its primary action.

## Local runtime boundary

Frontend source is available on the existing local Vite checkout. Updating the payment container failed and automatically rolled back to its previous image; the previous service is UP. The existing local database has applied V6/V7 whereas current source resolves V12–V18. Its schema also lacks the V12–V15 dispute objects. The source/schema-history copy audit confirmed that simply relabelling V7 as V17 additionally causes a checksum mismatch. The application's migration history was unchanged.

Thus backend retry capability is implemented and tested, but is **not activated on that retained old local database**. Older DTOs omit capability flags, so the frontend safely offers status checking instead of promising retry. A separately reviewed history transition, backed up and verified with actual financial invariants, is required before replacing this local backend. No checksum repair, history-row deletion, duplicate DDL, or validation bypass was performed. See `D:/DuAnOjt/plans/payos-local-rollout-blocker-2026-11-15.md`.


## Later activation update — 2026-11-15

The initial local-runtime boundary above is resolved by an opt-in compatibility lineage, not a history rewrite or checksum repair. Old V6/V7 bytes/history are preserved, canonical V17/V18 and pending dispute migrations run normally in the compatible chain, and duplicate V16 DDL is represented by existing V6. Full-copy financial/history hashes and strict validation passed before local upgrade. The payment container is now UP at V18; retry is active. See [quick-payment follow-up](./quick-payment-polish-2026-11-15.md) and backend `docs/api-contracts/payos-local-lineage.md`.

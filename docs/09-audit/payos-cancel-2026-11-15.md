# PayOS cancellation and local-network redirects

Owner: Codex / SPH. Last verified: 2026-11-15.

## Outcome

On localhost, loopback and private IPv4/local hostnames, payment opens as a hosted PayOS page in the same tab. The panel displays **Mở PayOS để thanh toán**, **Quay lại vé** and server-status checking. Cancelling PayOS returns to `/payment/cancel`, checks the server and displays the existing ticket. It neither cancels the booking nor creates an additional payment automatically.

Public deployments retain embedded checkout. SDK cancel/exit and terminal server states remove that iframe and show a compact summary. Unknown navigation closes the frame without declaring payment cancelled or paid. Late callbacks from a removed frame are ignored. Same-origin embedded returns validate the exact frame window, origin and booking ID before requesting verification.

## Cause and evidence

Chrome's trace reproduced `net::ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS` when a public PayOS iframe redirected to localhost. Such a blocked navigation may emit no useful load/error callback. Waiting for a backend FAILED result also leaves the grey frame visible while an older/deferred server returns PENDING. Hosted same-tab navigation avoids this iframe restriction rather than weakening browser security.

The shared test server at port 5174 was found serving earlier code from another checkout. Final browser validation used a dedicated Vite server at port 5193 rooted in this checkout. The user-facing server at localhost:3000 was started and its source was verified to contain the hosted fix. Vite now ignores generated trace/report HTML to avoid spurious development reloads during testing.

## Source and preserved behavior

- Frontend: `PayOsPaymentPanel`, new `PayOsCheckoutFrame`, `PaymentResultPage`, `payosCheckout.requiresHostedPayOS`.
- Tests: payment component/URL tests; local cancellation and hosted-payment browser tests; booking harness and successful deposit/lifecycle fixtures updated for same-tab checkout.
- Backend: `PaymentServiceImpl.syncPayOSPayment` and new `PayOsCancellationSyncTest`.
- Docs: booking PayOS module note, screen inventory, parity matrix and backend `docs/api-contracts/payos-cancellation-sync.md`.
- All new business UI remains in booking-flow using existing primitives/tokens. No new dependency, endpoint or schema; no changed roles, amount validation, deposit deadline, fees or ledger policy.

Backend sync maps only an authoritative matching provider CANCELLED order with zero received money from PENDING to existing FAILED. A positive amount requires reconciliation. Missing paid amount, mismatched order and existing review/refund states are not downgraded. No cancellation branch emits booking cancellation, slot release, wallet credit or payment-completed events. Existing create-link safeguards continue to reject cancelled/mismatched cached links.

## Verification

| Check | Result |
|---|---|
| Regression before implementation | 3 frontend cancellation tests and 2 backend provider-cancellation tests failed |
| Final payment/return/host-selection component suites | 56 passed |
| Chrome local cancellation: deposit/final, 390/1440px | 4 passed |
| Chrome hosted confirmation: deposit/final, 390/1440px | 4 passed |
| Chrome driver booking → hosted PayOS → server sync → check-in QR | 1 passed |
| JDK 21 payment-service suite | 146 passed, 2 configured skips |
| Production build / TypeScript | Passed |
| ESLint | 0 errors; 1 existing RegisterPage.tsx:198 hook dependency warning |

Earlier full frontend run passed 718 tests before the final hosted-mode change; the final affected suites and browser journeys were rerun as above. Some overlapping runs hit machine memory limits, so final checks were run separately. Browser/API/provider fixtures transfer no money.

Screenshots: `.artifacts/playwright/payos-local-deposit-390.png`, `payos-local-deposit-1440.png`. Final E2E log: `payos-local-final.log` (dedicated port 5193). Build log: `payos-final-build.log`.

## Runtime and limitations

The frontend fix is served locally at http://localhost:3000; reload existing tabs before retesting. The payment backend needs a rebuilt artifact to receive cancellation status mapping; frontend hosted-mode recovery does not depend on that deployment. Live bank transfer and webhook operation were not triggered. No follow-up commit, push, PR update, merge or container deployment was performed.

Concurrent bank/withdrawal/admin/merchant-detail changes were preserved. Rollback: restore only these task files / prior app artifact; no database rollback.

References: [PayOS SDK callbacks](https://payos.vn/docs/sdks/front-end/script-js/) and [return/cancel URL](https://payos.vn/docs/du-lieu-tra-ve/return-url/).

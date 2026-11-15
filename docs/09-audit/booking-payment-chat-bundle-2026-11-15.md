# Complete booking/payment chat delivery

Owner: SPH booking/payments. Last verified: 2026-11-15. User explicitly requested all remaining work from this chat in the existing frontend PR #83, with a linked backend PR because the repositories are separate.

## Included

- Payment-history redesign already committed in #83.
- Safe PayOS cancel/return/back flow on all existing route aliases; server sync determines the result. Local-network environments use hosted checkout to avoid blocked iframe redirects.
- A cancelled checkout can request a fresh server-verified payment attempt. Provider/amount/ownership/expiry checks prevent blindly reopening an old QR, duplicate charges or interpreting URL flags as success.
- Compact quick-book payment summary with real deposit, original deadline, lot/plate/schedule and full-code copy; tariff/secondary actions remain accessible through disclosures.
- Booking navigation opens the selected ticket after payment. Existing cancellation and QR eligibility remain server controlled.
- Reservation form displays backend vehicle/account limits, fixed cooldown/rate retry times and temporary payment-verification errors without creating another booking/payment automatically.
- Automated regression coverage and the existing CI browser selection now include the new journeys.

The original login success/map selection/booking-list/gate/admin-notification fixes from this chat were already delivered by merged PR #81; they are in main and are not duplicated in this diff. Backend business-time fixes from closed, unmerged PR #49 are included in the backend companion.

## Isolated review and scope

The bundle was assembled from an explicit file manifest, in an isolated checkout. Bank-profile/admin-withdrawal work, merchant payout/dashboard/detail redesigns, map interaction work, and their shared audit entries were excluded as changes from other chats. The shared core lifecycle test had a merchant-detail assertion from that separate work; its original main assertions were retained here.

Review updated three stale browser expectations for the compact flow: the selected ticket already shows the real QR/confirmed-deposit notice, and the booking-list action is behind `Tác vụ khác` and opens the correct selected-booking URL. No payment authority or acceptance condition was bypassed. No credentials, environment files, generated build output, local database snapshots or real bank-transfer fixtures are committed.

## Verification

| Check | Observed result |
| --- | --- |
| Full frontend Vitest suite | 85 files, 758 tests passed |
| Typecheck / production build | Passed |
| Whole-repo lint | No errors; existing RegisterPage hooks warning retained |
| Browser journeys | 41 scenarios passed in the full 44-case run; the three stale cases passed after correction (44 distinct cases verified) |
| Backend booking/payment suites | 280 passed, 6 environment-gated skips |
| Explicit isolated MySQL checks | 16 passed: booking quota/cooldown/concurrency and V9 migration, payment retry/concurrency and V18 allocator upgrade |

Browser API/provider responses are mocked; no bank transfer is made. Earlier live-local activation/migration-copy evidence remains documented in the component task reports. The backend CI now explicitly runs the new MySQL checks in disposable schemas, and archived local migration resources are pinned to LF for byte-preserving checkout.

## Operation and review boundaries

Deploy the backend companion before this frontend bundle. Booking V9 and Payment V18 are additive; preserve shared internal service-token configuration. Canonical Payment migrations remain the default; retained local V6/V7 databases require the documented opt-in compatibility location. Do not repair/rewrite migration history, reuse cancelled payment URLs or reset hold deadlines. Pricing/refund/ledger rules and API authorization remain intact.

See `docs/05-modules/bookings/payos-checkout.md`, `docs/05-modules/bookings/unpaid-hold-policy.md`, and the backend recovery/hold contracts for state mapping, configuration, rollback and limitations. This delivery creates/updates PRs; it does not merge or deploy production.

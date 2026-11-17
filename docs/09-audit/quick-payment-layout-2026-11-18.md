# Quick booking payment layout

- Task ID: quick-payment-layout-2026-11-18
- Owner: SPH frontend. `last_verified`: 2026-11-18.
- Summary: Simplify the supplied payment dialog while preserving information and payment behavior; widen it slightly per user follow-up.
- Status: Requested layout implemented. The duplicate noncompact ticket regression found during pre-push review is fixed in this branch; final verification is recorded in `fe-ticket-before-after-20261118.md`.

## Files changed

- Presentation: `QuickBookingPaymentSummary.tsx`, `BookingStatusPanel.tsx`, `WalletDepositPayment.tsx`, `inline-quick-book.css`.
- Browser verification: `e2e/quick-hold-redesign.spec.ts`.
- Documentation: booking module notes, screen inventory, parity matrix and this report.
- No files deleted; pre-existing workspace changes retained.

## Behavior and capability parity

| Existing capability | New presentation | Result |
|---|---|---|
| Status and copyable order reference | One top row | Preserved |
| Lot, address and vehicle | Left information block; address wraps fully | Preserved, readability improved |
| Expected arrival/departure | Adjacent to lot on wide containers; stacked below on narrow containers; separate time/date lines | Preserved, including seconds and UTC+7 |
| Server deposit, expected fee and payment deadline | Warm tinted amount block | Preserved |
| PayOS payment and embedded/hosted recovery | Primary action after amounts | Preserved |
| Wallet balance, pay and wallet navigation | Secondary compact row below PayOS | Preserved |
| Wallet pending/unknown/failed/review and insufficient balance | Existing blocking logic and notices | Preserved |
| Expired booking | Existing expiry notice and disabled payment eligibility | Preserved |
| Check-in code and QR eligibility | Explanation below payment options; ticket still requires server-confirmed status | Preserved |
| Overtime and peak multipliers | Price disclosure, initially collapsed | Preserved |
| Demo, cancellation consent and booking navigation | Other-actions disclosure, initially collapsed | Preserved |
| Dialog focus trap, Escape and focus restore | Existing dialog behavior | Preserved |

The dialog is at most 680px, previously 560px. Its content uses a container query for horizontal lot/schedule layout, and the wallet uses its own container query. Narrow viewports remain one column without horizontal overflow. Existing typography, icons and brand tokens are reused; no dependencies, routes or global tokens added.

## API / permissions

- Verified frontend `bookingSchema`, booking/payment API functions and wallet read/write contracts.
- Verified backend `BookingController` driver role annotations, `BookingDto.advanceDeposit`/`expiresAt` and `PaymentController` payment/sync driver role annotations.
- No API payloads, permission gates, financial calculations, query/mutation behavior or backend code changed.
- Browser checks use intercepted API responses and perform no real transfers. Live backend transactions were not exercised.

## Component placement

- Reservation information and composition remain in `features/booking-flow`.
- Optional compact wallet presentation remains owned by `features/driver-wallet`, accessed through its existing public export.
- Modal sizing remains in parking-search's existing stylesheet. No business UI moved into shared primitives.

## Verification

| Check | Command / environment | Result |
|---|---|---|
| TypeScript | `npm run typecheck` | Passed |
| ESLint | `npm run lint` | Passed, 0 errors/warnings |
| Relevant components | Vitest: PayOsPaymentPanel, ReservationFlow, BookingQrCheckin, InlineQuickBookPanel, DriverWallet | 78 passed |
| Full unit/component suite | `npm run test` | 867 passed, 1 failed, 95 files |
| Browser journey | `npx playwright test e2e/quick-hold-redesign.spec.ts e2e/wallet-booking-success.spec.ts` | 6 passed at 390/650/1440px |
| Final layout and funded wallet | `npx playwright test e2e/quick-hold-redesign.spec.ts` | 3 passed; exact 680px desktop width asserted |
| Production | `npm run build` | Passed; log: `.artifacts/quick-payment-layout-build.log` |
| Whitespace | `git diff --check` | Passed |

Browser coverage includes keyboard focus/Escape, booking creation and navigation, full long address, collapsed disclosures, horizontal overflow, funded/insufficient wallets, wallet payment → confirmed QR, PNG download and one wallet POST. Browser tests recorded no page errors.

## Visual evidence

- `.artifacts/playwright/quick-hold-payment-1440.png`: wide layout and funded wallet.
- `.artifacts/playwright/quick-hold-payment-650.png`: intermediate viewport.
- `.artifacts/playwright/quick-hold-payment-390.png`: narrow layout and insufficient wallet.
- Existing wallet success screenshots cover the confirmed QR state at the same three widths.

## Known limitations

- Pre-push review reproduced the `MyBookingsPage.test.tsx` selected-booking failure: `BK-API-41` appeared in both the confirmed ticket and generic noncompact details. `PENDING_CHECKIN` now uses the confirmed ticket as its single detail presentation at every width. The existing assertion is retained; this correction belongs to the shared ticket component and does not change booking or payment contracts. The earlier 867/868 suite result above is historical evidence before that correction.
- The full suite also emits network stderr from layout tests whose API requests are not mocked. Those tests pass. Playwright emits a runner `NO_COLOR`/`FORCE_COLOR` environment warning; this is separate from browser page errors.

# Driver wallet, refunds and deposit statements

Owner: payments / booking. last_verified: 2026-11-17. Status: local implementation, pending deployment and user review.

The approved SP-PAY-01 plan adds an internal driver balance receiving eligible cancellation refunds and paying a whole future deposit. No new package or design system was added. Wallet data uses the central HTTP client, Zod transport validation and TanStack Query; amounts are authoritative backend data.

## Screens and preserved behavior

| Screen | Change | Preserved |
|---|---|---|
| /wallet (new DRIVER route) | Available/held balance, paginated activity, booking links, mobile cards, refresh | Existing driver layout/authentication |
| /bookings and BookingStatusPanel | Explicit cancellation consent, refund amount/channel/status/reference, wallet payment option and pending feedback | PayOS, expiry, server-confirmed check-in QR, final-payment flow and booking navigation |
| /payments | WALLET label and refund details separate from the source status | Existing filters, page scope, pagination, details and reconciliation guidance |
| /merchant/revenue | On-demand deposit statement panel | Existing revenue/chart/wallet history/withdrawal links |
| /admin/transactions | On-demand statements and retry action for wallet refunds needing reconciliation | Existing transaction sorting, pagination and detail dialogs |

The active cancellation path is features/booking-flow/api.ts, composed by BookingStatusPanel inside MyBookingsPage. Changes are not limited to the older unused cancellation modal. That retained modal no longer asks for bank details or claims automatic bank repayment; its API no longer returns fake success on an exception.

## API mapping

- features/driver-wallet/api.ts validates GET /api/v1/driver/wallet, GET /api/v1/driver/wallet/transactions, POST /api/v1/payments/wallet, GET /api/v1/payments/wallet?bookingId=... and GET /api/v1/payments/{id}. The booking lookup returns only the authenticated driver's attempt; no attempt is null/omitted data in the standard envelope.
- features/deposit-statements uses /api/v1/merchant/revenue/deposits or /api/v1/admin/deposits; the server chooses ownership. Data loads when the panel is opened.
- Admin retry uses POST /api/v1/admin/refunds/{id}/retry-wallet. Other roles do not render this action; backend authorization remains mandatory.
- Booking schema retains refund fields instead of discarding them. Cancellation sends explicit acceptWalletRefund=true only after the current confirmation dialog is accepted.
- Every wallet POST outcome, including a lost response, refreshes wallet, booking and payment state. The booking-scoped lookup runs on mount and every 3 seconds while the component is mounted, so refresh can recover a hold without a remembered paymentId. Additional payment is blocked while looking up/reconciling, on lookup error, during PENDING, and for SUCCESS/REFUNDED/REQUIRES_REVIEW. FAILED permits PayOS if the booking still accepts payment. The server independently fences both sources; no automatic POST retry occurs.
- A zero refund or NONE does not promise a pending credit. Positive WALLET refunds display pending, completed, failed or reconciliation guidance according to the actual refund status.

## User-facing limits

The UI explains that the balance can pay the whole deposit when sufficient. If insufficient, the wallet stays unchanged and the user can pay the full amount with PayOS. No top-up, transfer, bank withdrawal or mixed payment action is shown. Wallet refunds are never labelled bank transfers. Loading, zero balance, empty activity, errors, pending confirmation and failed payment are handled explicitly.

## Evidence

DriverWallet.test.tsx covers zero/actual balances, insufficient funds, successful whole-deposit payment, pending feedback and API failure. DepositStatements.test.tsx covers lazy ownership-scoped reads, 16k allocation and failure states. Existing PayOS tests now mock the additional wallet read with its actual contract.

e2e/driver-wallet.spec.ts covers wallet reuse on 390px/1440px, cancellation consent/refund display, lost POST response followed by reload with a pending hold, and zero refunds. Network responses are stubbed in browser tests; no real PayOS charge is made. Existing driver payment history browser tests are run alongside it. Screenshots are under .artifacts/driver-wallet. Recovery fixes add component tests for omitted null data, lookup failures, owner-derived recovery states and failed/zero/positive refund states. Deploy the payment lookup endpoint before this frontend. No schema change is needed for the review fixes.

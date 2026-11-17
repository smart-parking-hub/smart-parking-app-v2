# Merchant checkout settlement

Owner: SmartParkingHub. last_verified: 2026-11-18. Screen: `/merchant/qr-scanner`. Local source implementation, not deployed.

Checkout retains reserved-time pricing and displays total, applied deposit and outstanding amount. A 40,000 VND bill with an 8,000 VND deposit requires 32,000 VND. Early departure does not change that reserved fee.

`CheckOutResponse` adds bookingId/finalPaymentMethod. GateSettlementDialog reads `/api/v1/merchant/bookings/{id}` under MERCHANT ownership every three seconds while mounted, passes an AbortSignal, and verifies returned booking ID/code/lot before accepting status. A manual payment check is available. Closing the dialog or changing scan unmounts the old observer. Query failure or an unrelated response cannot complete the displayed booking.

Drivers use their existing booking FINAL_PAYMENT action. The fabricated PayOS URL and manual QR confirmation were removed. Merchant credentials never impersonate the driver. A recorded PayOS decision disables cash in the UI, and backend coordination remains authoritative for concurrent attempts.

Cash confirmation sends `{bookingCode, parkingLotId, amount: amountDue}`. The positive amount is now mandatory in BE. Duplicate clicks are blocked while pending. Timeout/errors retain a visible message and permit checking/retrying the same operation; do not ask the driver to pay again before verifying.

Completion shows remaining debt zero and the verified method if available; historical null method is described only as server-confirmed. The UI does not infer method from a selected button. Booking/merchant queries are invalidated after completion.

Unit/component coverage includes server polling/manual check, pending/cash/error, exact 32,000 VND command, wrong booking, PayOS accepted and unmounted observers. Playwright covers cash, observed PayOS completion and a blocked cash attempt on mobile using mocked APIs. No real bank transfer is part of these checks.

Deploy with Booking V11 and Payment V20 plus compatible internal coordinator/recovery. Refer to backend `docs/api-contracts/gate-final-payment.md` for pending receipt, late payment reconciliation, rollout and rollback semantics. No checkout refund, pricing change or driver wallet change is included.

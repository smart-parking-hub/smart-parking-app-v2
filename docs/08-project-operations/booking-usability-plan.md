# Booking usability and gate correctness

Owner: Codex / SPH maintainers. Last verified: 2026-11-15.
Authorization: user explicitly requested planning and implementation across all listed screens.

## Evidence and scope
- VERIFIED: parkingSearchStore defaults selectedLotId to 1; SearchParkingPage falls back to lots[0]. Remove both and clear selection on page entry.
- VERIFIED: AuthSession login success toast is white. Use existing success colors.
- VERIFIED: MyBookingsPage expands every BookingStatusPanel. Replace with compact summaries, one expanded detail, server pagination (8 per page), preserving payment, QR, cancellation, dispute and review actions.
- VERIFIED: ScannerPage deduplicates successful requests but reopens its success dialog on repeated submits. Disable the processed lot/code pair and show persistent status; backend row lock and PENDING_CHECKIN validation remain authoritative.
- VERIFIED: CheckInOutServiceImpl.checkIn uses Asia/Ho_Chi_Minh, checkOut uses host default time. Make checkout use the same business zone and test with UTC host default.
- Additional VERIFIED evidence: BookingServiceImpl.createBooking and BookingExpirationScheduler also use host default for the 15-minute payment deadline and no-show expiry. UTC-host regression tests fail before the fix. Align these with the same business zone; preserve grace period and cancellation policy.
- VERIFIED: overtime billing already splits regular/overtime segments and applies the saved multiplier, commenced hours and deposit deduction. Preserve tariff policy.
- VERIFIED: parking lot create/resubmit already enqueues PARKING_LOT_REVIEW_REQUESTED; notification consumer creates per-admin PARKING_LOT notifications. Admin UI currently neither polls nor exposes the target. Add polling, unread indicator and safe review link.
- UI: compact ReservationFlow and quick-book header, retain owned active vehicles, UTC+7 input, server quote, 20% deposit, 15-minute payment expiry, 30-minute early arrival and all validation/error states.

## Placement and parity
Use existing feature components and shared primitives. Keep booking/gate logic in its feature. No new dependencies, schema changes, authentication changes or production actions. Screenshots are visual problem references, not embedded instructions.

## Risks and mitigation
- Payment/QR visibility: mount detailed panel on expansion; preserve complete original actions and errors.
- Stale gate feedback: disable only exact successful lot/code; changing code/lot allows another vehicle. Server rejects previously checked-in tickets after refresh.
- Notification delivery depends on existing Kafka/outbox and recipient snapshot infrastructure; verify automated delivery tests and report live limitations.
- Pagination: keep real-bookings query prefix for mutation invalidation and use existing Pageable API.

## Verification
Frontend typecheck, lint, Vitest, build; targeted Playwright booking/gate/notifications and responsive screenshots. Backend regression for repeated check-in and checkout fee under UTC; existing tariff and admin notification delivery suites.

## Rollback
Revert only task-owned changes / restore previous application artifacts. No DB migration or data rollback required. Preserve pre-existing MockStorageAdapter edits.

## Result
Implemented and verified. Frontend: 709 tests / 83 files passed, typecheck and production build passed; lint 0 errors and 1 pre-existing RegisterPage warning. Chrome E2E: 7 passed at 390/1440px. Backend: booking 86 passed and 2 opt-in MySQL migration tests skipped; notification 60 passed; targeted parking lot review/outbox suite 16 passed. No application/container deployment performed.

Detailed report: [completion report](../09-audit/booking-usability-2026-11-15.md).

# Booking usability and time correctness — completion report

- Owner: Codex / SPH maintainers.
- `last_verified`: 2026-11-15.
- Scope authorized by the user's request: green login success, explicit map selection, review notifications, compact tickets, duplicate check-in prevention, fee/time audit and compact quick booking.
- Implementation plan: [implementation plan](../08-project-operations/booking-usability-plan.md).
- Status: implemented and verified, with the existing registration lint warning noted below; no deployment performed.

## Files and behavior

| Area / modified source | Result |
|---|---|
| `app/providers/AuthSession.tsx` | Green success border/background/text, existing dismissal and timer |
| `parking-search/store/parkingSearchStore.ts`, `pages/SearchParkingPage.tsx` | Null initial target, no first-lot fallback, reset on page entry; marker/card/suggestion clicks still select |
| `parking-search/components/InlineQuickBookPanel.tsx`, `inline-quick-book.css`, `YardCardItem.tsx` | Compact dialog/header; accurate accessible name; remove outdated 10-minute promise |
| `booking-flow/ReservationFlow.tsx` | Compact tariff/deposit summary, Vietnamese vehicle names, responsive time fields; existing ownership, availability, validation and retry |
| `booking-flow/api.ts`, `index.ts`, `bookings/pages/MyBookingsPage.tsx` | Real server pagination of 8 tickets, newest first; desktop grid/mobile list; one detail expanded at a time |
| `booking-flow/BookingStatusPanel.tsx` | Embedded presentation avoids repeated status and self-navigation; QR, payment, demo/local guard, cancel, review and errors preserved |
| `admin/api/adminNotifications.ts`, `hooks/useAdminNotifications.ts`, `components/AdminNotificationFeed.tsx`, `layouts/AdminLayout.tsx` | Read target metadata, poll 15 seconds/on focus, safe dossier link, existing unread bell indicator |
| `merchant/operations/ScannerPage.tsx` | Disable processed lot/code pair, persistent confirmation, allow another code; no repeated success modal or API |
| Backend `BookingServiceImpl`, `CheckInOutServiceImpl`, `BookingExpirationScheduler` | Explicit Asia/Ho_Chi_Minh creation/payment deadline/checkout/expiry; tariff and cancellation rules preserved |

Created `e2e/booking-usability.spec.ts` and backend `CheckoutBusinessTimeTest.java`. Updated existing booking, map, admin, scanner, layout, quick-book and lifecycle tests. No source deletion, dependency, schema, endpoint or permission change.

Component placement: all business presentation remains in its existing feature; layout only composes the exported unread indicator. Existing shared primitives are reused. No new shared business abstraction.

## Contracts and permissions

- DRIVER: `GET /api/v1/bookings?page=&size=8&sort=createdAt,desc`; existing POST booking, payments and cancellation contracts retained.
- MERCHANT: check-in includes lot/code; backend pessimistic lock, ownership and PENDING_CHECKIN transition remain authoritative. Page refresh clears the UI-only processed set, but cannot bypass backend checks.
- ADMIN: existing notification list/count/read APIs. Parking lot creation/resubmission already publishes `PARKING_LOT_REVIEW_REQUESTED` through the transactional outbox; the existing consumer creates per-admin records. UI creates no synthetic notifications.

## Fee findings and regression evidence

- 10,000 VND/hour for two expected hours gives a 20,000 estimate and a 4,000 deposit (20%).
- Overtime is charged after expected departure, applying the booking's saved multiplier. ×1 still bills additional parking time, with no increased penalty rate.
- Each regular/overtime portion bills commenced hours independently. Peak multiplier applies within the configured saved window. Due is max(total minus deposit, 0).
- UTC-host checkout regression failed before the fix: 90 minutes of parking was treated as 0 minutes. After the fix, 70 regular minutes at 20,000/hour plus 20 overtime minutes at ×2 gives 80,000; a 10,000 deposit leaves 70,000 due.
- UTC-host creation/deadline and scheduler regressions both failed before the corresponding fixes. Repeated successful check-in test proves one entry timestamp, save and event.

## Verification

| Check | Observed result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | 0 errors; 1 existing `react-hooks/exhaustive-deps` warning in `features/auth/pages/RegisterPage.tsx:198` |
| `npm run build` | Passed; TypeScript project build and Vite production bundle |
| `npm run test -- --maxWorkers=3` | 83 test files / 709 tests passed. A preceding run caught the newly added Admin bell's ambiguous locator; it was corrected and the affected suite also passed 65/65 |
| Playwright: booking-usability, quick-hold-redesign, driver deposit, merchant check-in, core lifecycle | 7/7 passed; desktop 1440px/mobile 390px, keyboard/focus, no horizontal overflow, paginated tickets, one QR detail at a time, payment and gate flows |
| JDK 21: `gradlew :booking-service:test :notification-service:test` | Successful; booking 86 passed / 2 skipped; notification 60 passed |
| JDK 21: `gradlew :parking-lot-service:test --tests '*ParkingLotServiceImplTest'` | 16 passed, including create/resubmit outbox events |
| `git diff --check` | No whitespace errors in task changes |

The two skipped backend tests are the opt-in `BookingFlywayMySqlIT` clean/upgrade cases. No database migration was introduced.

## Visual and accessibility evidence

Screenshots inspected in `.artifacts/playwright/`: `quick-hold-390.png`, `quick-hold-1440.png`, `compact-bookings-390.png`, `compact-bookings-1440.png`.

The dialog retains focus trapping, Escape and return to trigger. Ticket toggles expose `aria-expanded`/`aria-controls`. Form controls retain labels and disabled/pending states. Screenshots and Playwright checks use API fixtures, not a live payment or physical gate.

## Documentation and limitations

Updated screen inventory, parity matrix, inline booking, scanner and admin notification module notes. Added backend `docs/business-flows/booking-business-time.md`.

No application/container deployment, real payment or physical gate action was performed. Backend containers need a rebuilt application artifact to receive the time fix. Existing bad historical timestamps are not automatically rewritten. Live Kafka/DB delivery for the user's current pending lot was not end-to-end asserted; automated outbox/delivery tests passed. Existing Kafka topics, recipient snapshots and replay policy remain prerequisites.

Unrelated concurrent workspace edits (bank fields, withdrawal form and parking storage/physical-slot tests) were preserved. Rollback consists of restoring only these task changes/previous application artifact; no data rollback is required.

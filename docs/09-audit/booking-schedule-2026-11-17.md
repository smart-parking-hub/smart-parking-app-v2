# Booking schedule completion report

- Task ID: booking-schedule-30m-20261117.
- Owner: SmartParkingHub; last verified: 2026-11-17.
- Status: implemented and locally verified; deployment and adoption of live application data not performed.

## Summary and scope

Added a shared half-hour time selector, computed exit, typed availability reads and daily/type/physical-slot timeline to `ReservationFlow`. Quick booking and lot detail share this implementation. Current full lots can open future schedules; queue entry is retained separately. The backend requires a 30-minute gap on the same slot, checks concurrent writes, preserves a post-checkout cooldown and supports explicitly staged adoption of old bookings.

Regular-hour pricing, half-hour overtime, 20% deposit, payment deadline, vehicle ownership/hold restrictions, PayOS/wallet/QR, cancellation and refund behavior are retained. New bookings enter from their reserved start; historical ticket rights are read from the server. No dependency or shared design token was added.

## Files and placement

- New: `BookingTimeSelector`, `BookingAvailabilityTimeline`, feature-owned `availability.ts`, test schedule fixtures, schedule E2E, module documentation.
- Modified: `ReservationFlow`, time/API schema, confirmed ticket entry window, quick-book actions, current-count wording, related tests/E2E fixtures, module notes, screen inventory and parity matrix.
- Deleted: none. All business components stay in `features/booking-flow`; existing shared UI and HTTP infrastructure are reused.

## API and permissions

The public Parking timeline/availability controllers and records were verified against source. The frontend validates their shape and uses TanStack Query with complete query keys and cancellation signals. Booking write authority remains on the backend. Loading/error/unknown availability never becomes an invented free place. Private lifecycle/migration endpoints require the internal service token.

## Verification

| Check | Result |
|---|---|
| TypeScript | `npm run typecheck`: passed |
| ESLint | `npm run lint`: zero errors and warnings |
| Full component/unit suite | 95 files, 872 tests passed; structured result in `.artifacts/booking-schedule-vitest.json` |
| Final affected-page check | 15 tests passed after current-count wording was clarified |
| Production build | `npm run build`: passed |
| Playwright | 9 selected scenarios passed: schedule, quick-book, PayOS deposit and core gate lifecycle; schedule screenshots refreshed in 2 further passing runs |
| Backend | Full Gradle test task succeeded: 826 passed / 13 skipped; separate MySQL checks passed 14 schedule cases and 1 Booking migration preservation case |
| Diff | Reviewed for task scope; Windows CRLF whitespace check passed |

Initial fixture/input and asynchronous test-wait failures were corrected and rerun. Existing JSDOM layout tests can emit unmocked request diagnostics; launcher NO_COLOR/CDS notices are separate from test results. No real payment or gate action was performed by browser fixtures.

## Visual and accessibility evidence

Inspected `.artifacts/playwright/booking-schedule-390.png` and `booking-schedule-1440.png`. E2E covers no page overflow, block selection, invalid duration, slot submission and no page errors. Text accompanies colors, the timeline has a keyboard-scrollable region, and the existing dialog focus/escape behavior remains. The timeline does not jump back on every polling refresh and is disabled during mutation.

## Documentation and release limitations

See [module and capability mapping](../05-modules/bookings/schedule.md). Backend ADR 0010, API contract, data ownership, migration tool and rollout/rollback instructions were added. Full cross-repository inventory, logs and result summaries are in `D:/DuAnOjt/audit-reports/booking-schedule-20261117/REPORT.md`.

The running application still needs Parking V9/backend, Booking V12/backend and the frontend release. Legacy data stays conservative until explicitly adopted. There is no new per-lot rollout flag, automatic reassignment of an overstaying vehicle or global map time-range filter in this implementation. Existing physical-choice flags remain authoritative.

# Overnight timeline and Vietnamese duration validation

- Task ID: booking-overnight-validation-20261117.
- Owner: SmartParkingHub frontend; last verified: 2026-11-17.
- Status: Done; frontend changes available through the existing Vite dev server.

## Summary and files

The timeline previously stopped at 23:30 on the entry day, and clearing duration exposed Zod's default English NaN error. The corrected shared reservation form loads the next occupied day, shows an exact date beneath later-day blocks and displays Vietnamese duration errors. The entry date is not repeated inside its blocks, following the user's final display correction.

Modified: `ReservationFlow.tsx`, `BookingTimeSelector.tsx`, `BookingAvailabilityTimeline.tsx`, `time.ts`, the two booking-flow test files, the shared test schedule fixture, `e2e/booking-schedule.spec.ts` and `docs/05-modules/bookings/schedule.md`. Created this report. No files deleted or dependencies added.

## Final requested behavior

- The entry day retains its complete daily timeline for choosing another arrival time. All later days show only blocks inside the chosen interval; checkout is exclusive. For 22:30–00:30, only 00:00–00:30 appears on the following day. Checkout at exactly 00:00 does not append a new day's blocks.
- Blocks on later days display `dd/MM/yyyy` beneath their start time; entry-day blocks show only time and capacity/state. Computed exit includes `(+N ngày)` for a later calendar date.
- The first continuation day loads automatically. Stays spanning more days can load each further day with **Xem ngày tiếp theo**, without changing selected times or resetting horizontal scroll.
- Blank/non-numeric duration shows **Vui lòng nhập thời lượng đỗ.**; integer/minimum/block-step errors are Vietnamese. Derived checkout errors are suppressed while duration is invalid. Submission stays disabled, and a valid replacement clears the error and recomputes exit.
- Pricing, minimum duration, half-hour steps, deposits, booking/payment/QR flows, role permissions and server authority are preserved.

## API and state

Reuses the verified daily `GET /api/v1/parking-lots/{id}/timeline` contract. Each date retains vehicle type, optional physical slot and cancellation signal. TanStack Query's infinite query holds daily server pages; form state remains in React Hook Form. Additional days are loaded on demand rather than issuing requests for an arbitrary large duration at once. The existing full-window availability read still validates the whole selected stay, including days not yet displayed. No backend or database changes were required.

## Verification

| Check | Command / result |
|---|---|
| Regression before correction | Two new component regressions failed: missing Vietnamese duration message and missing next-day indication. Both pass after the correction; assertions also cover exact dates, trimming extra hours, multi-day loading and midnight checkout. |
| Typecheck | `npm run typecheck`: passed. |
| Lint | `npm run lint`: passed, no errors/warnings. |
| Production build | `npm run build`: passed (`tsc -b` and Vite build). |
| Component/unit suite | `npm run test -- --maxWorkers=2 --reporter=json --outputFile=.artifacts/booking-overnight-vitest-final.json`: 95 files, 875 tests passed; zero failures/skips. |
| E2E | `npx.cmd playwright test e2e/booking-schedule.spec.ts e2e/quick-hold-redesign.spec.ts`: 5 passed in 19.1s. Includes empty duration with exactly one Vietnamese alert, recovery, exact next-day dates, selected-only continuation and existing booking behavior at mobile/desktop widths. |
| Diff | `git -c core.whitespace=cr-at-eol diff --check`: passed; existing CRLF conversion notices remain. |

An initial unrestricted full test run had two unrelated notification test failures at about the five-second limit while other checks were running. No notification source/test changes were made. The complete final suite passed with two workers. An initial build caught a typed test-fixture parameter access; it was corrected with explicit object/string narrowing and the final build passed.

## Visual and accessibility evidence

Inspected `.artifacts/playwright/booking-schedule-overnight-390.png` and `booking-schedule-overnight-1440.png`. The timeline scrolls within its own region; date text fits under each time. The first day remains available and following-day blocks stop at the selected exit. Buttons retain keyboard operation, selection state, explicit next-day/date accessible labels and disabled unavailable/past states. Empty duration is verified via an alert and disables booking.

Tests use mock API/identity fixtures and never create a live booking, payment or gate action. No production/VPS deployment was performed.

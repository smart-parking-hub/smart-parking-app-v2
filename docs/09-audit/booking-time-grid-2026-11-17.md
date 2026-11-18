# Arrival time grid

- Task ID: booking-time-grid-20261117; owner: SmartParkingHub frontend.
- Status: Done; date: 2026-11-17, UTC+7.
- User scope: replace the native arrival-time dropdown with a clearer table/grid-style picker in the existing reservation form.

## Behavior and parity

Clicking **Giờ vào dự kiến** opens a compact four-column board. Times are grouped into night/early morning, morning, afternoon and evening. The selected value uses the existing orange token and a check mark. Popup width is bounded to 384px and its time list scrolls independently; placement chooses above or below the trigger based on viewport and enclosing modal space.

All previous date/time rules remain: half-hour starts, only future times today, 48 choices on future dates, live clock refresh, same-day correction of an expired choice and an explicit exhausted-day state. Duration, computed checkout/next-day labels, timeline, exact-window availability, fees, vehicle restrictions, booking/payment and QR behavior are preserved. A time cell chooses arrival only and is not a capacity guarantee.

Arrow keys navigate the time cells, Home/End jump to the first/last choice, and Enter/Space selects. Selection and the close button return focus to the trigger. Escape closes only the picker inside the quick-book modal. Clicking outside or tabbing to another field dismisses it without selecting another time. The popup is labeled, selected state is announced, and focus remains visible.

## Files and placement

- Created feature-specific `features/booking-flow/BookingArrivalPicker.tsx`.
- Modified `BookingTimeSelector.tsx` to compose it while retaining existing time filtering/clock/form callbacks.
- Reused `shared/components/Popover.tsx`; added an optional accessible-name prop to `PopoverContent`. No existing caller behavior or style was changed.
- Updated picker/reservation component tests, schedule/quick-book E2E, schedule module documentation and parity notes.
- No dependency, API, permission, backend source or database change. No file deleted. The shared reservation component continues to serve both lot detail and quick booking.

## Verification observed

| Check | Result |
|---|---|
| Typecheck | `npm run typecheck`: passed. Final `npm run build` also ran the complete TypeScript project build successfully. |
| Lint | `npm run lint`: passed with zero errors/warnings. |
| Focused tests | Picker, reservation and shared compound-component suites: 46 tests passed. |
| Full suite | `npm run test -- --maxWorkers=2 --reporter=json --outputFile=.artifacts/booking-time-grid-vitest.json`: 96 files, 885 tests passed, zero failures/skips. Includes the final keyboard Tab-dismiss assertion. |
| Build | `npm run build`: passed; final log `.artifacts/booking-time-grid-build-final.log`. |
| E2E | `npx.cmd playwright test e2e/booking-schedule.spec.ts e2e/quick-hold-redesign.spec.ts --timeout=60000`: 5 passed in 19.6s. Covers 390/650/1440px as applicable, selecting times through the real grid, future-only choices, focus return, Escape containment, overflow and existing booking/payment presentation. |
| Diff | `git -c core.whitespace=cr-at-eol diff --check`: passed; existing CRLF notices remain. |

Two initial keyboard component tests timed out because all interaction timers were faked; those tests now fake only Date while using real interaction timers. Clock-expiry tests still fake/advance interval time. An initial build rejected a Playwright-only query option used in component tests; the option was removed, retaining Testing Library's exact string-name matching. Final checks above passed after correction.

## Visual evidence and limits

Inspected `.artifacts/playwright/quick-hold-time-grid-390.png`, `quick-hold-time-grid-1440.png` and the full-page picker screenshot during refinement. Final browser runs regenerated screenshots after narrowing the panel and limiting programmatic scrolling to its own list. Grid cells use project typography/colors and native buttons; there is no hidden native time dropdown.

Browser tests use mocked API/identity fixtures and do not create real bookings or payments. Existing Node launcher NO_COLOR/FORCE_COLOR notices remain; browser page errors are asserted empty. No production deployment was performed. Module contract/behavior record: `docs/05-modules/bookings/schedule.md`.

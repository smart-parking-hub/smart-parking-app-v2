# Disabled unavailable arrival choices

- Owner: SPH frontend. Last verified: 2026-11-17.
- Status: implemented and verified in source/local production preview.
- Authorization: user requested that full times also be disabled in the dropdown.

## Result and scope

ReservationFlow passes the selected day's raw first timeline page through BookingTimeSelector to BookingArrivalPicker. FULL/zero-capacity, BUFFER and PAST choices are disabled and labelled Hết chỗ, Đệm 30p and Đã qua. Muted appearance accompanies native disabled state. Arrow/Home/End navigation skips disabled choices; opening/refreshed capacity focuses an enabled choice or the close button if none exists. A completely unavailable day asks for another date, keeping the dropdown inspectable and the date field usable.

An already selected hour is not silently changed by a capacity refresh. Only known timeline blocks are disabled; unloaded data is not labelled full. The existing full-duration/physical-slot availability read and server checks remain authoritative. An individually free arrival block does not guarantee the entire stay. No extra per-time API calls, new dependencies, backend/schema or permission changes.

## Files

- Updated BookingArrivalPicker, BookingTimeSelector and ReservationFlow in booking-flow; selector and parent integration tests; booking-schedule E2E.
- Updated booking schedule docs, screen inventory and parity matrix.
- Created the workspace plan and this report. No deletions; existing unrelated edits preserved. Components remain feature-owned and reuse existing Popover/tokens.

## Verification

| Check | Result |
| --- | --- |
| Regression before fix | Three selector tests failed: full/buffer disabled, keyboard skip, full-day guidance |
| Focused tests | 42 passed: BookingTimeSelector 12, ReservationFlow 14, InlineQuickBookPanel 16 |
| Build / TypeScript | `npm run build`: passed |
| Lint | `npm run lint`: passed |
| Playwright | Schedule 390/1440px and quick-book 390/650/1440px: five passed |
| Review | Scoped whitespace checks and popup screenshot inspection passed |

Tests verify click prevention, enabled alternatives, parent timeline wiring, capacity refresh without intent changes, keyboard focus/selection, a full day, exact-window failure despite a free start, overnight schedule, exact submitted timestamps and existing quick-book behavior. Browser tests use mocked API responses; no real booking/payment was created.

Screenshots: [mobile popup](../../.artifacts/playwright/booking-arrival-full-390.png), [desktop popup](../../.artifacts/playwright/booking-arrival-full-1440.png). Backend and API deployment were not needed for this frontend change.

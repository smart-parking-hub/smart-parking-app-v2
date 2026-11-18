# Easy booking duration selection

- Task ID: booking-duration-picker-2026-11-17.
- Owner: SPH frontend. Last verified: 2026-11-17.
- Status: Done in source/local verification; not deployed.
- User authorization: quick durations plus “Thời lượng khác”, selected in the clarification response.
- Plan: `D:/DuAnOjt/plans/booking-duration-picker-2026-11-17.md`.

## Result

The shared reservation form now offers 30 minutes, 1/2/4/8 hours and 1 day, with its existing two-hour default visibly selected. “Thời lượng khác” opens separate whole-hours and 0/30-minute controls. Longer stays are supported without a new maximum. The exit summary displays HH:mm, the exact date, and “Cùng ngày”, “Ngày hôm sau” or “Sau N ngày”. Duration wording uses days/hours/minutes rather than block arithmetic.

## Files changed

Created:

- `src/features/booking-flow/BookingDurationPicker.tsx` and its component test.
- This report and the workspace plan.

Modified (including existing untracked workspace files):

- `BookingTimeSelector.tsx`, `time.ts`, their tests and `ReservationFlow.test.tsx` under booking-flow.
- `e2e/booking-schedule.spec.ts` and `e2e/booking-rate-limit.spec.ts` to use the new controls while retaining booking, validation, schedule and anti-spam assertions.
- Module `docs/05-modules/bookings/schedule.md`, screen inventory and parity matrix.

No deletions, new packages or shared primitive changes. Existing unrelated workspace edits were preserved.

## Behavior, contract and placement

| Capability | Outcome |
| --- | --- |
| Duration editing | Approved replacement of the default raw-minute field with quick choices and optional hours/half-hours |
| Two-hour default, minimum 30 minutes, half-hour increments, longer stays | Preserved |
| Invalid/empty duration | Vietnamese error; invalid exit hidden and submission disabled; recover through custom input or a preset |
| Date/arrival picker, expired-time correction, keyboard and Escape behavior | Preserved |
| Availability, overnight/multi-day continuation, physical slot reset | Preserved |
| Create request, idempotency, quotas, rate limits and payments | Preserved; backend still receives canonical start/end timestamps |
| Pending request | Native parent disabled fieldset also disables all duration controls |

BookingDurationPicker remains private to booking-flow. React Hook Form owns custom-hour/minute drafts; the parent form retains the canonical minute total and existing Zod validation. No routes, API contracts or permissions changed. Pricing and capacity remain server-authoritative.

## Verification

| Check | Command / environment | Result |
| --- | --- | --- |
| Focused component/utility/integration | BookingDurationPicker, BookingTimeSelector, ReservationFlow, time tests | 30 passed |
| Full frontend tests | `npm run test -- --maxWorkers=4 --reporter=dot` | 97 files / 893 tests passed |
| Typecheck | `npm run typecheck` plus project-reference checking in build | Passed |
| Lint | `npm run lint` | Passed |
| Build | `npm run build` | Passed |
| Browser flows | `npx playwright test e2e/booking-schedule.spec.ts e2e/booking-rate-limit.spec.ts e2e/quick-hold-redesign.spec.ts --reporter=list` | 7 passed against production preview with mocked HTTP |
| Review | Scoped whitespace/diff checks and screenshot inspection | Passed |

Browser checks cover 390px and 1440px detail views and 390/650/1440px quick-book dialogs. They retain assertions for exact submitted timestamps, physical slot, keyboard time selection, empty-duration recovery, midnight dates, no horizontal overflow, no JS page errors, preserved duration after rate limiting and no automatic booking after expiry. Existing unrelated layout tests still emit mocked-network stderr while passing.

## Visual/accessibility evidence

- [Mobile duration picker](../../.artifacts/playwright/booking-duration-390.png).
- [Desktop duration picker](../../.artifacts/playwright/booking-duration-1440.png).
- Existing booking-schedule overnight and quick-hold screenshots were refreshed by their tests.
- Native buttons expose selected state through aria-pressed; custom fields have labels; the custom disclosure exposes aria-expanded; keyboard focus and disabled controls were verified.

## Limitations and rollout

- Local source/build verification only; no live deployment or real booking/payment was performed.
- The whole-hours custom input accepts integers. Select “Thêm phút: 30 phút” for half hours.
- Backend acceptance and deployment remain separate from the mocked browser tests. No backend/schema change is needed for this UI.
- Rollback only this task's edits and newly created files, retaining prior workspace changes.

# Vehicle current parking

- Owner: SPH frontend
- Last verified: 2026-11-21
- Screen: SCR-020, `/vehicles` and existing vehicle route aliases

## Behavior and contracts

VERIFIED against backend `BookingController.getMyBookings`, `BookingDto`, `BookingStatusEnum`, and `CheckInOutServiceImpl.checkOut`.

The fleet table adds **Bãi hiện tại**, displaying the booking's lot name, address and physical slot code when supplied. Missing lot names fall back to the server lot ID. Vehicles are matched by `vehicleId`, so changing a plate does not break the association.

`GET /api/v1/bookings` is called with each of `status=PARKING` and `status=OVERTIME`, `size=100`, and `sort=createdAt,desc`. All pages of each filtered result are read. Only these two statuses, without `checkOutTime`, represent current parking. `AWAITING_FINAL_PAYMENT` already has a checkout timestamp and is excluded along with reservations and historical trips. These are driver-owned reads; backend role/ownership checks remain authoritative.

The operational badges are **Đang đỗ**, **Đỗ quá giờ**, and **Không đỗ tại bãi**. When parking data has loaded successfully and a vehicle has no active parking booking, its current-lot cell says **Chưa vào bãi**; loading and failed reads keep their separate states. Existing **Đang sử dụng / Ngừng sử dụng** badges and all create/edit/deactivate actions remain available. No vehicle status enum or backend transition changes.

Parking reads run through TanStack Query, refresh every 15 seconds while the screen is active, and accept cancellation. They run only when the fleet is nonempty. Loading shows **Đang tải bãi…**; failed reads show **Chưa xác định**, an error notice and retry. An error, including a failed background refresh, never presents the vehicle as outside the lot. Fleet reads and actions remain independent of parking availability.

## Capability parity and placement

| Capability | Result |
|---|---|
| Fleet pagination and plate/brand search within current page | Preserved |
| Create, edit, validation, deactivate confirmation and errors | Preserved |
| ACTIVE/INACTIVE status | Preserved |
| Current lot, address, slot and operational status | Added per user request |
| Empty, loading, error and retry | Preserved; extended for optional parking reads |
| Responsive table and semantic column headings | Preserved; horizontal table scrolling for added column |

`VehiclesTable` stays in `features/vehicles/components`: it is specific to fleet management. The query is composed in `VehiclesPage`, and the typed, validated read stays in `vehicleDataApi`. Existing booking schema is reused via the booking-flow public export. No dependency, route, permission or shared token changes.

## Verification and limitations

### 2026-11-21 vehicle editor viewport regression

The create/edit editor now scrolls only its field/error area and retains a
visible header and action row within the existing Modal. The vehicle schema,
ownership, API payloads and save/retry behavior are unchanged. Eight browser
cases cover create/edit at 320×568, 390×844, 1366×640 and 1440×900, including
validation and a rejected save followed by a successful retry. Buttons are
measured before the browser test can scroll them into view. All 29 existing
vehicle tests pass. The production QA reassessment and current release evidence
are in `docs/06-quality/production-qa-reassessment-20261121.md`.

### Earlier current-parking verification

The deep production retest on 2026-11-21 additionally found keyboard focus could
leave the vehicle editor and fail to return after close. The editor now records
the create/edit trigger before it is disabled, uses the native Modal top layer,
wraps keyboard focus and restores the trigger after the closing React commit.
Autocomplete Escape still closes only its suggestions. See
`docs/06-quality/production-qa-retest-deep-20261121.md` for scope and evidence.

- `npm run typecheck`: passed. `npm run build`: passed (TypeScript project build and Vite production bundle).
- `npm run lint`: passed with zero errors/warnings.
- `npm run test -- --maxWorkers=2 --reporter=dot`: **95 files, 864 tests passed**, including 29 vehicle component/schema tests. An initial highly concurrent run had seven failures/timeouts across other screens; limiting worker concurrency passed the complete suite. Existing layout tests still emit JSDOM network error diagnostics for unmocked requests; these do not fail assertions.
- `npx playwright test e2e/driver-vehicle-parking.spec.ts`: **2 passed**. Local browser connections required running outside the socket-restricted sandbox. No page or browser-console errors/warnings were observed. Node emits the existing FORCE_COLOR/NO_COLOR environment notice in the test launcher.
- Component coverage includes ID matching, address/slot display, inactive parked vehicles, overtime, pagination, exclusion of reservations/checked-out trips, loading, API failure and retry.
- Browser coverage at 390px and 1440px checks actual table content, horizontal scrolling without page overflow, search and runtime errors.
- Screenshots: `.artifacts/playwright/vehicle-current-parking-390.png`, `vehicle-current-parking-mobile-scrolled.png`, `vehicle-current-parking-1440.png`.
- API source contracts and mocked browser behavior are verified locally; no live gate event or production backend acceptance is claimed. Missing or incorrect server events affect physical-location accuracy. The UI reflects the latest successful read, with a polling delay of up to 15 seconds while active.

## Task report

- Objective: display which lot each vehicle is currently in and a suitable operational status.
- Status: implemented and locally verified; live backend acceptance pending.
- Created: this module document; `e2e/driver-vehicle-parking.spec.ts`.
- Modified: `src/features/vehicles/api/vehicleDataApi.ts`, `pages/VehiclesPage.tsx`, `components/VehiclesTable.tsx`, `__tests__/VehiclesPage.test.tsx`; screen inventory and capability parity matrix.
- Deleted: none. Existing unrelated working-tree changes were preserved.
- Visual review: desktop and horizontally scrolled mobile screenshots inspected; original table/header/action styling retained. Scroll region is named, keyboard focusable, and uses visible focus styling; semantic table headers and existing accessible action labels are preserved.

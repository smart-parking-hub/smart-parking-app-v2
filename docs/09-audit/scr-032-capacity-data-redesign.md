# SCR-032 — Lot capacity data and typography correction

- last_verified: 2026-11-07
- owner: Frontend maintainers
- Scope: `/merchant/parking-lots/:parkingLotId/slots` only.

## Verified data contracts

Evidence: parking-lot-service `ParkingLotController`, `ParkingLotDto`, `SlotDto`, `SlotConfigRequest`, `SlotServiceImpl`; common-library `VehicleTypeEnum`.

- GET merchant lot detail provides id, name, address and status. It does not provide a lot code or ALPR telemetry.
- GET public lot slots and PUT merchant slots/bulk return only configured slot rows.
- Used capacity is total minus available; it includes booking holds and cannot be called a physical vehicle count.
- Configuration is blocked for REJECTED and SUSPENDED, consistent with the service.
- Backend validates non-negative integer capacity and capacity >= used. Removed invented per-category limits of 30/50/100; maximum input reflects the Java Integer transport range.

## Capability parity

| Capability | Outcome |
| --- | --- |
| Selected lot information | Preserved; removed Cát Lái fallback and fabricated code |
| Vehicle capacity rows | Preserved; API rows only, with Vietnamese category labels |
| Increment, decrement, numeric editing | Preserved with labelled inputs and keyboard focus |
| Used-capacity minimum | Preserved, includes held slots |
| Live draft totals | Preserved |
| Reset, bulk save, duplicate-submit protection | Preserved |
| Confirm capacity decrease, Escape, scroll lock | Preserved; added focus trap and focus restoration |
| Detail, QR scanner, pricing navigation | Preserved |
| API errors / empty data | Explicit retry/empty states; no fake success or fallback fixtures |
| Surface weight, virtual queue, ALPR, sample terminal photos/specifications | Removed unsupported presentation and estimates; no corresponding API fields/actions |

## Design

Industrial utilitarian, DFII 14 (impact 4, fit 5, feasibility 5, performance 4, consistency risk 4). Dominant navy utilization strip and orange capacity bars anchor the screen. Existing locally hosted Be Vietnam Pro headings and Source Sans 3 body; semantic project color variables, 8px spacing rhythm, only short bar transitions. The design avoids template-like density by organizing actual operational counts around one utilization strip instead of filling the screen with unsupported technical panels.

All screen components and scoped CSS remain in merchant/slots; no new shared abstraction or dependency. Desktop and mobile have separately verified layouts. Browser fixtures are synthetic and do not represent a live backend read.

## Validation

- Targeted Vitest: 14/14 pass (API mapping, missing categories, empty/error states, failed saves, invariant, steppers, reset, save, confirmation, duplicate submit).
- ESLint: exit 0, no errors/warnings.
- Playwright Edge: 2/2 pass at 1440px and 390px; save payload has only returned categories, totals update, confirmation Escape, no page errors, no horizontal overflow.
- Visual evidence: scr-032-capacity-1440.png and scr-032-capacity-390.png.
- Full suite: 331 passed, 6 failed in existing MerchantParkingLotDetailPage tests (outside this change).
- Final npm run build: PASS (TypeScript project build and Vite bundle). npm run typecheck: PASS. Earlier unrelated edit-page test fixture errors were resolved by concurrent workspace work.
- Final browser rerun after mobile footer/focus changes: 2/2 pass. Playwright runner emits an environment NO_COLOR/FORCE_COLOR warning; this is separate from the application.


## Follow-up — 2026-11-08: add capacity to an unconfigured lot

User reported the empty state had no way to configure a new vehicle category. Added an explicit vehicle selector and Add vehicle type action, available on empty and partially configured lots. Options include only missing backend VehicleTypeEnum categories. New rows are marked unsaved, start at zero, and join the existing bulk-save payload only after user selection. Existing API data remains unchanged until save succeeds. Reset discards new rows; rejected/suspended lots and pending saves disable additions. Verified `SlotServiceImpl.configureSlotForLot` creates missing category rows through the existing bulk endpoint.

Validation: targeted slots/API/operations suite 34/34 passed, including empty-lot creation with two types, exact payload, duplicate-category prevention, reset and locked-lot behavior. Browser test covers mobile add → set 25/10 capacity → save → reload, alongside existing desktop/mobile editing tests. Screenshots use synthetic network fixtures.

Related requested fix: operations lot editor success notice now appears as a dismissible top-right toast for four seconds. Repeated successful saves restart visibility, including immediately resolved requests. Regression test covers expiry, repeat saves and dismissal.


## Follow-up — 2026-11-08: remove an unsaved vehicle type

Added a per-row “Bỏ loại xe” button for newly added, unsaved categories. Removing a row updates draft totals, restores the category to the selector and excludes it from the save payload while preserving edits to other rows. Removing the final draft restores the empty state and disables save. Re-adding starts at zero. The action follows existing saving/locked guards and returns keyboard focus to the selector. Existing persisted categories retain their capacity controls; this change does not issue deletion requests.

Regression tests cover selective removal with other drafts/edits preserved, exact save payload, removal of the last draft and clean re-addition.

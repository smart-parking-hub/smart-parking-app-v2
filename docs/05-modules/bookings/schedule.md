# Booking schedule, half-hour blocks and turnaround

- Owner: SmartParkingHub frontend; last verified from source: 2026-11-18.
- Authorized scope: the product owner's approved plan in `D:/DuAnOjt/plans/booking-timeline-30m-buffer-2026-11-17.md`.
- Screens: shared reservation form on parking detail and the map's quick-book dialog.

## Behavior

Select an owned active vehicle, calendar date, entry time (00/30 minute boundaries) and duration in positive multiples of 30 minutes. Exit is calculated automatically, including across midnight. Default entry is the next future half-hour in Vietnam time, and the existing two-hour default duration is retained.

Duration selection update (2026-11-17, explicitly requested by the user): “Bạn muốn đỗ bao lâu?” offers 30 minutes, 1/2/4/8 hours and 1 day as one-click choices, with the current preset visibly selected. “Thời lượng khác” reveals a whole-hours field and a 0/30 minute select; longer stays remain supported without a new maximum. The computed exit separates HH:mm from its exact date and labels “Cùng ngày”, “Ngày hôm sau” or “Sau N ngày”. The summary uses days/hours/minutes instead of requiring block arithmetic. BookingDurationPicker is feature-owned, uses React Hook Form for custom fields and passes the canonical minute total to the existing parent form/Zod schema. The pending parent fieldset disables all duration controls. Evidence: BookingDurationPicker/BookingTimeSelector tests, ReservationFlow regressions and booking-schedule / booking-rate-limit E2E.

The arrival control opens a compact four-column time grid grouped into night/early morning, morning, afternoon and evening. The selected time uses the existing orange accent and a check mark. The grid lists only strictly future half-hour starts for the selected date in Vietnam time: today starts at the next eligible block and ends at 23:30; future dates retain all 48 choices. Choices refresh every ten seconds and on focus/visibility changes. An arrival that expires while the form is open moves to the next available block on that same date and recomputes checkout using the current duration. When no future block remains, the trigger is disabled and asks the driver to choose another date; it does not silently move a booking to another day.

Selecting a time closes the grid and restores trigger focus. Arrow keys move between cells; Home/End reach the first/last choice; Enter/Space selects. Escape closes only the time picker, including inside the quick-book modal. Clicking outside or tabbing to another field dismisses it without changing the time. The popup uses existing `Popover` primitives, chooses above/below placement from available viewport/dialog space, has a bounded scroll area and focuses the selected cell without scrolling the surrounding form. The grid chooses arrival time only; the separate full-window capacity query remains authoritative for whether the stay can be booked.

Unavailable arrival choices (2026-11-17, user requested): the picker receives the selected day's raw first timeline page, including the current vehicle type and physical-slot filter. FULL/zero-capacity, BUFFER and PAST entries are disabled with “Hết chỗ”, “Khoảng đệm” or “Đã qua” labels. Keyboard navigation skips disabled cells and opening the picker focuses the selected enabled cell or the first enabled alternative. A fully unavailable day stays inspectable and asks the driver to choose another date; the date field remains editable. Capacity refresh can disable a selected time without silently moving the reservation. Unknown/unloaded blocks do not get an invented full label. No per-hour API calls are added. An enabled arrival block still requires the existing exact-window availability check for the entire duration and a compatible physical slot before submission.

Overnight display correction (2026-11-17): only blocks on later days show their exact `dd/MM/yyyy` date beneath the time; the entry day's date is not repeated inside each block. The calculated exit adds `(+N ngày)` when it falls on a later calendar day. The entry-day timeline retains all its hours for changing entry time; subsequent days show only blocks inside the selected stay, excluding the checkout boundary. For 22:30–00:30 the following day shows only 00:00–00:30, and checkout exactly at midnight adds no following-day blocks. The first continuation day loads automatically. Longer stays can load further days one at a time with **Xem ngày tiếp theo**; loading a day does not move the reservation or reset horizontal scrolling. These reads reuse the same daily endpoint and physical-slot filter, with cancellation and the existing refresh interval. Full-window availability remains authoritative for the entire stay, including days not yet displayed.

Clearing the custom hours field shows **Vui lòng nhập thời lượng đỗ.**, disables submission and suppresses derivative exit-time errors until duration is valid. Zero hours plus zero minutes remains below the existing minimum. Fractional hours are rejected in this whole-hours field; use the extra 30-minute option. Re-entering valid hours or choosing a preset clears the error and recomputes checkout. Duration and pricing rules are unchanged.

The server supplies a daily 48-block timeline after the vehicle/type and date are known. Counts include the early-entry and turnaround windows returned by the backend. Consecutive new bookings on the same slot still require 30 minutes between their nominal stays. A separate full-window query verifies the selected duration and returns eligible physical slots, preventing the UI from combining fragments from different slots into a false promise. Selecting a physical slot changes the timeline to that slot; group mode does not create fictional slot IDs. Explicit physical choices still respect the backend's existing feature flag.

Green means bookable; red means no eligible place; amber means the required gap; gray means past. Text and accessible labels accompany colors. Timeline scrolls within its own region and supports keyboard use. It does not reset the user's scroll on every background refresh. Pending creation locks the form and timeline.

Timeline display update (2026-11-18): **Lưới** is the default and wraps blocks to fit the available width. **Hàng ngang** displays the same blocks in a single scrollable row. Both views show the selected stay with an orange outline. Switching views keeps the booking selection and brings the selected arrival block into view within the timeline. The booking-schedule Playwright spec covers both views at mobile and desktop widths.

The quick-book action stays available for a currently full lot, labelled **XEM LỊCH TRỐNG**. Its existing queue capability remains as a separate button for current availability. The current-count/full filter remains a current-state filter; this release does not add global date/time filters to the map search.

Availability errors/unknown data disable creation and provide retry; a successful full-window read is required. Changing date/type/time/duration resets the selected slot. Query keys include all relevant inputs, and requests use cancellation signals. Server data stays in TanStack Query; form data stays in React Hook Form and Zod. On conflict, keep the editable intent, reload the schedule and show the server reason. Idempotency includes the selected physical slot and times.

## Contracts and money

- New reads: `GET /api/v1/parking-lots/{id}/timeline?vehicleType=&date=&physicalSlotId=` and `/availability?vehicleType=&start=&end=`. Transport schemas are validated in `features/booking-flow/availability.ts`.
- Create retains `POST /api/v1/bookings` and adds the existing backend optional physicalSlotId to the FE input. The backend decides the final slot and tariff under a lock.
- Policy 2 tickets show entry up to 15 minutes early if the slot is ready. The timeline includes this window and the 15-minute turnaround after the preceding stay. Ticket entry bounds use the saved `checkInEarlyMinutes` from the server, and previous tickets retain their original times. Charges still start at actual entry.
- The 30-minute selection grid does not change tariff units: regular parking still charges commenced hours (a 30-minute booking costs at least one hour), overtime charges commenced half-hours, and deposit remains 20%. Buffer is not reserved billable time.

## Capability and traceability

| Requirement | Implementation | Verification |
|---|---|---|
| Half-hour entry/duration and computed exit | `BookingTimeSelector`, `time.ts`, form Zod schema | time/component tests; booking-schedule E2E |
| Current full does not prevent a free future window | `ReservationFlow`, `YardCardItem` | component regression and E2E with current capacity 0 |
| Daily/type/physical timeline | `BookingAvailabilityTimeline`, typed reads | component reads/errors; mobile/desktop E2E |
| Cross-midnight dates and Vietnamese duration errors | `BookingTimeSelector`, infinite daily timeline query, form schema | empty/recovery and multi-day component regressions; overnight mobile/desktop E2E |
| At least 30 minutes between uses | Backend authoritative interval query, reflected in timeline | backend MySQL concurrent/boundary tests; E2E 15:00 blocked / 15:30 allowed |
| Existing booking/payment/QR/queue capabilities | existing flow composed with the new selector | existing booking component and PayOS/gate E2E regressions |

All new business components remain inside `features/booking-flow`; existing pages compose its public export. No dependency or shared design token was added. Test fixtures never create a real payment or operate a physical gate. Deployment and legacy data adoption require the backend rollout described in its schedule runbook. See the completion report for exact results and screenshots.

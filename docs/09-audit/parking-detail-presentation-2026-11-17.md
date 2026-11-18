# Parking detail presentation and future-only arrival choices

- Task ID: SCR-016-presentation-20261117.
- Owner: SmartParkingHub; timezone UTC+7; status: Done, ready for user review.
- User scope: real photos when available, understandable vehicle names/rates on `/parking/37`, and arrival dropdown choices that exclude elapsed times.

## Result

The detail page uses real image metadata from the existing lot response, prioritizes the cover, and supports thumbnail selection with keyboard operation. Rate cards use the shared Vietnamese vehicle labels and show current free/total capacity, hourly base price, HH:mm peak hours and overtime multiplier. Existing tokens, header/address, navigation, loading/error/retry and the complete reservation flow are preserved.

For today's date, arrival choices contain only future half-hour blocks through 23:30 in Vietnam time. Future dates retain 48 choices. The picker refreshes its clock while open and on focus/visibility changes; an expired arrival moves to the next available start on the same date and recomputes exit. Once no eligible block remains, the picker asks for a different date rather than moving the booking to tomorrow implicitly.

## Real lot-37 media recovery

The metadata read returned four photos, but all four content endpoints initially returned 404 (`Không tìm thấy file ảnh`). The running container had no upload-directory mount. Found four local source files matching the stored original names and byte counts; verified JPEG/WebP signatures before recovery. Preserved the sources under the task audit folder and SHA-256 checked the copies in the new named local volume.

`compose.schedule.local.yaml` now mounts `docker_parking_images` at `/app/uploads/parking-lot-images`. Recreated only Parking with the same deployed image, waited for health UP and confirmed Flyway V9 remained up to date with no new migration. All four API bodies returned 200 through Vite and matched the recovered source SHA-256 and sizes (116961, 217499, 28852, 24076 bytes). No image DB record, booking, tariff or permission was modified by recovery.

Proof and retained originals: `D:/DuAnOjt/audit-reports/parking-detail-presentation-20261117/`. Live API proof: `.artifacts/parking-detail-live-images.json`. Keep the volume and recovery copies across future container updates. This recovery covers lot 37; it does not claim to recover missing historical files for other lots.

## Files and placement

- Created feature-owned `ParkingLotGallery` and `ParkingCapacityPricing`, plus focused picker tests, presentation E2E, module documentation and this report.
- Modified the existing page, additive lot image transport typing, `BookingTimeSelector`, schedule E2E assertions, page component tests, module notes, screen inventory/parity and local storage overlay/runbook.
- Reused `ApiImage`, `vehicleLabels`, existing formatters, API client and `ReservationFlow`. Extracted `ParkingLotImage` into the existing entity module because two lot transport types use it. No new dependency, endpoint or shared visual token.
- Deleted no files. No backend business source or schema change. No VPS/production action.

## Capability parity and contract evidence

See [module record](../05-modules/parking-detail/presentation.md) for the full mapping. Public DTO/controller/service source verifies image fields and content URLs. API images retain the centralized client's headers and blob cleanup; test assertions verify an application header is present without logging its value. Current capacity is still a present-state count; full-window schedule reads and backend booking validation remain authoritative.

No new Stitch source was provided. The user explicitly requested a visual improvement to the supplied existing screen; verification uses existing design tokens and responsive screenshots, not a claimed comparison with an absent new design file.

## Verification observed

| Check | Outcome |
|---|---|
| TypeScript | `npm run typecheck`: passed. |
| Lint | `npm run lint`: zero errors/warnings. |
| Build | `npm run build`: TypeScript project build and Vite passed; final log `.artifacts/parking-detail-presentation-build-final.log`. |
| Focused behavior | Page/gallery, picker and reservation suites: 25 tests passed. Covers translated types, missing configuration/images, cover order, keyboard switching, today/future date choices, expired selection, live clock and day-end exhaustion. |
| Full unit/component suite | `npm run test -- --maxWorkers=2 --reporter=json --outputFile=.artifacts/parking-detail-time-options-vitest-final.json`: 96 files, 883 tests passed; zero failures/skips. |
| Browser | `npx.cmd playwright test e2e/parking-detail-presentation.spec.ts e2e/booking-schedule.spec.ts e2e/quick-hold-redesign.spec.ts --timeout=60000`: 7 passed in 29.8s. Presentation verified at 390/1440px; existing quick booking at 390/650/1440px. |
| Runtime media | Lot 37 read 200; all four content URLs 200 and SHA-256 match recovered sources. |
| Local service | Persistent mount verified; same image; health UP; Flyway V9 up to date, no migration needed. |
| Diff | `git -c core.whitespace=cr-at-eol diff --check`: passed; existing CRLF conversion notices remain. |

The first unbounded Vitest launch failed before running tests because Windows could not allocate memory for its workers. The focused rerun with one worker and complete final run with two workers passed. One earlier desktop browser run reached its screenshot step and timed out under concurrent load; the final run with a 60-second test budget passed every test. Browser assertions recorded no page/console errors or warnings. The Node launcher retains its existing NO_COLOR/FORCE_COLOR notice.

## Visual evidence and limits

Inspected `.artifacts/playwright/parking-detail-presentation-390.png` and `parking-detail-presentation-1440.png`: gallery/price panels stack on mobile and use two columns on desktop, names and prices fit, thumbnails have visible focus/selection and no page-width overflow. Browser media fixtures use an existing local test image; real lot-37 photo contents were separately checked through the live API. Tests do not create a real booking, payment or gate action. Other screens were exercised for regression only, not redesigned.

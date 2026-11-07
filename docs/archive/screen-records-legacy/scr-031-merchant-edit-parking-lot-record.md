# SCR-031 — Chỉnh sửa hồ sơ bãi đỗ

- Route: `/merchant/parking-lots/:parkingLotId/edit`
- Owner: frontend maintainers
- last_verified: 2026-11-07
- Status: Fixed; live backend persistence not exercised.

## Problem and behavior

The previous edit page merged API data with a sample container-yard profile,
used fixed GPS coordinates, displayed invented reviewer/history/photos and
reported update success even when requests failed. This record supersedes the
previous prototype-based implementation and its historical test counts.

The page now loads only the requested yard through TanStack Query and validates
the response ID. Editable fields are exactly the backend request: name, address,
latitude and longitude. Missing coordinates remain blank; zero is valid. The
map and Google Maps link use current form coordinates. Device location failure
preserves the existing position; reset restores this yard's saved coordinates.

Only REJECTED and CHANGES_REQUESTED yards can edit, as enforced by the backend.
Other statuses return to the same yard's detail page; the detail page hides its
edit link. Only a nonempty real reviewReason displays admin feedback.

Images use the yard's real image records and authenticated content URLs.
Optional uploads follow backend limits: 5 images/yard, 5 MB/image, JPG/PNG/WebP.
Images upload before PUT changes the yard to pending approval. If upload fails,
PUT is not sent. If PUT fails after upload, uploaded images remain in query
cache and are not uploaded twice on retry. Errors remain visible; success shows
a modal with the actual returned status. List/count/detail queries invalidate.

Drafts remain browser-local and specific to the lot ID, using version 2 and
validated fields. Restore requires an explicit click. Legacy unversioned drafts
are ignored because they may contain prototype coordinates. Image files are not
persisted; the draft confirmation explains that they must be selected again.

## Backend evidence

Verified in `smart-parking-service-microservice/parking-lot-service`:

- `ParkingLotController`: MERCHANT role, GET/PUT `/api/v1/merchant/parking-lots/{id}`.
- `ParkingLotDto`: ID, name, address, coordinates, status, reviewReason, images.
- `CreateParkingLotRequest`: only name/address/latitude/longitude; size/range validation.
- `ParkingLotServiceImpl.updateParkingLot`: ownership check; edit only rejected or
  changes requested; successful update sets PENDING_APPROVAL and clears review metadata.
- `ParkingLotImageController` and `ParkingLotImageServiceImpl`: owned-yard image
  uploads and the file/count limits above.

No backend, authentication, role or dependency changes. Prototype-only hotline,
height/OTP claims, response text, review rounds/history, revision number and
Gatekeeper/checklist claims are no longer rendered because the API does not
provide or persist them. No synthetic data substitutes for failed GET/PUT/upload.

## Files changed

- `pages/EditMerchantParkingLotPage.tsx`: replace prototype with real-data form,
  draft controls, GPS/map, real images, mutation/error/success behavior.
- `api/merchantParkingLotApi.ts`: validate real detail/update responses; remove
  fallback from those requests and supplementary upload; map image DTO correctly.
- `pages/MerchantParkingLotDetailPage.tsx`: status label and edit-link availability.
- `__tests__/EditMerchantParkingLotPage.test.tsx`: replace tests that asserted
  prototype data with real contract and user-behavior regressions.
- `e2e/merchant-edit-parking-lot.spec.ts`: desktop/mobile browser flow and yard switching.
- This record, inventory and parity matrix; screenshots listed below.

Existing unrelated work in the workspace was preserved. Legacy edit components
remain on disk but this page no longer renders them.

## Verification

| Check | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed, no errors/warnings |
| `npm run build` | Passed |
| Edit page component tests | 16/16 passed |
| Full suite at first run | 327 passed / 10 failed (337 tests); network warnings also reported |
| Rerun of bank, queue, create and edit tests with `--maxWorkers=2` | 46/46 passed before the final two edit tests were added; resolves the four additional failures from the full run |
| Edge E2E | 3/3 passed: desktop 1440, mobile 390, switch IDs and approved redirect |
| Visual/a11y | Screenshots inspected; no horizontal overflow; native labels, keyboard controls and modal success checked |

Six full-suite failures remain in MerchantParkingLotDetailPage.test.tsx, whose
old expectations and mocks target the earlier prototype; these also failed before
this task. The full suite was not repeated after the focused reruns. E2E used
mocked API responses and a synthetic merchant session, not production records.
Initial browser attempts hit an inaccessible occupied port and shared trace
artifact conflict; the passing run used port 5176 and a separate output directory.
Playwright also printed an environment FORCE_COLOR/NO_COLOR warning.

## Visual evidence

- [Desktop](./scr-031-real-data-1440.png)
- [Mobile](./scr-031-real-data-390.png)

Live backend persistence and any stale data already stored by older edits remain
unverified. The UI now displays the server's values; it cannot infer the intended
coordinates if previously saved records themselves are wrong.

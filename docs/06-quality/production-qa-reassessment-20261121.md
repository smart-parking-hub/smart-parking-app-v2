# Production QA reassessment — 2026-11-21

- Owner: SmartParkingHub frontend/backend maintainers
- Last verified: 2026-11-21, UTC+7
- Scope: reassess the original full-test and fix reports against current source,
  original screenshots, GitHub releases and production read-only observations.
- Baseline: FE `90bb4ba`, BE `6d59f46`. This is not an end-to-end release certification.
- Private inputs: the full-test, fix and newly available retest reports under
  local `docs/09-audit/`. Credentials and live account screenshots stay local.

## Evidence corrections

| Finding | Assessment and disposition |
| --- | --- |
| Full report: 48 checks, 45 PASS, 2 bugs, 1 locked | The detailed 48 rows contain 46 PASS and 2 FAIL: Public 6/6, Driver 12/14, Merchant 15/15, Admin 13/13. There is no separate locked row in that matrix. These are the report's labels, not independently verified acceptance results. Distinct bugs and failed rows are different counts. |
| Full report: all downstream flows tested using seeded bookings | Existing records prove read/render behavior. They do not prove new booking creation, deposit settlement, check-in/out, refunds, withdrawals, OCR accuracy or persistence. Modal opening and QR-scanner opening are not successful transactions. RBAC requires negative API/ownership checks as well as redirects. |
| Full report: coverage and payment providers | The claimed 25-screen total has no deduplicated screen inventory in the report. Its MoMo checkout claim is unsupported by the current booking UI, which offers PayOS and wallet; the linked screenshot cannot certify another provider's transaction. |
| Reproduction and routes | Use an active registered vehicle and a future half-hour interval in Vietnam business time; do not reuse the historical report's "today 14:00–18:00". Current solution routes use `/solutions/drivers` and `/solutions/owners`. Gateway/Identity is on VPS1; Booking/Parking is on VPS3. Do not treat guessed pricing/FK errors as the established cause. |
| Fix report: BE #82 is still draft | Superseded. #82 merged as `8b2ee64`; its production CD failed because required service URLs were not provisioned. Corrective #84 merged as `6d59f46`, restoring the prior deployable tree. Main CI `44890065576` and CD `44890065540` passed. Restoring deployability did not repair booking connectivity. |
| Fix report omits latest FE release | #117 merged as `90bb4ba`; CI `44889284857` and Vercel production succeeded. This optimized images and narrow navigation, not booking APIs. |
| Retest attributes Booking 500 to unmerged #82 | Incorrect release explanation; the symptom remains open. A fresh read-only VPS3 check at `6d59f46` found no `IDENTITY_SERVICE_URL` or `APP_INTERNAL_SERVICE_TOKEN` in Booking's environment; VPS3 could not reach Identity:8081 or Payment:8084. Previous incident logs identified the Identity call falling back to localhost. No new booking/payment write was submitted in this reassessment. |
| Parking image 404 | Fixed by #83 and retained in #84. Eight exact unchanged mock metadata records were removed by V12; no actual Cat Lai photo existed to restore. Lot 1 legitimately has no gallery. Real uploaded images were retained. Missing image responses preserve 404 JSON even with image-only Accept. This is not restoration of a real Cat Lai photograph. |
| Vehicle current-lot label | Fixed by #116: successful empty reads say **Chưa vào bãi**; genuine loading and read failures retain distinct states. Do not replace every loading label unconditionally. |
| Retest: `/parking` requires a Vercel SPA rewrite | Not reproduced. The rewrite already exists. Its screenshot shows **Đang tải giao diện…**, not evidence of a permanent empty main. Fresh authenticated Chrome contexts returned HTTP 200 and mounted main content at 390/1024/1440px without page errors. New tests cover direct load and reload. |
| Retest: duplicate select arrow caused by missing CSS | Current code already has `appearance-none`; computed production CSS was `appearance: none` at all three widths. Preserve it and add browser regression coverage; no speculative CSS override. The historical screenshot needs browser/version/zoom metadata before attributing a current defect. |
| Retest: profile click blocked | Initial click opened the account menu at all three production widths. Add regression coverage; an intermittent failure is not disproven, but no event/z-index patch is justified by present evidence. |
| Marker overlap | The retest file named `parking-map-markers.png` actually shows the login screen, but the original `driver-search-lots.png` does show overlapping price cards. A fresh production probe confirmed 5/20/15 intersecting visible-marker pairs at 1440/1024/390px respectively. This is a reproducible usability defect; the patch below addresses it. |
| Retest: horizontal fleet scrollbar | The seven-column table intentionally has its own scroll region and a 1100px minimum. Two rows do not determine column width. Preserve readable columns/actions and verify no page-level overflow; do not hide overflow and clip actions. |
| Refresh / feature flags | Driver bookings already has **Làm mới** and polling; merchant bookings also refetches. Search has an error retry, but no normal-success refresh; the latter is a separate P2 improvement. Disabled wallet top-up and queues are intentional, not features to enable as a QA fix. |

## Confirmed remaining UI defect and patch

Production mobile reproduction at 390×844: the vehicle modal's save button was
below the panel and viewport, while the complete panel was the scrolling area.
The same form is used for creation and editing. The new browser regression
failed before the source change because both visibility and pointer-hit checks
were false.

`VehicleEditor` now uses the existing Modal with a bounded flex column. Only the
field/error area scrolls; the header and action row remain visible. The shared
Modal, validation schema, authorization, API payload and mutation behavior are
unchanged. No new dependency or global CSS was added.

Browser acceptance covers create/edit at 320×568, 390×844, 1366×640 and 1440×900:
actions are measured before Playwright can scroll them into view; validation
does not submit; a rejected save preserves inputs and retry; successful retry
closes the dialog. Two more tests cover direct `/parking` load/reload and real
pointer clicks on the account menu. API responses in these tests are mocked;
they do not certify production persistence or booking connectivity.

## Confirmed map overlap and patch

Search now uses MapLibre's existing GeoJSON clustering for unselected lots.
Clusters are labelled native HTML buttons displaying the real lot count; Enter
or Space expands to the source's expansion zoom. Individual unselected lots use
compact pins. Selection retains the original detailed rate/capacity marker,
popup, card state, directions and quick-book actions. Prices remain available
in the existing list and selected marker. No new dependency or backend API is
introduced.

Only currently rendered features are mirrored into HTML; tile-boundary
duplicates are deduplicated. Marker DOM stays stable across redraws for focus
retention. Render and idle events remove obsolete parent-tile clusters after
zooming. A parsed style can accept data updates while its tiles are loading;
basemap style reloads recreate the source. Cleanup removes event listeners and
markers, and ignores a pending cluster expansion after disposal.

Initial browser testing caught stale parent-tile clusters and an installation
race; those iterations were fixed before release. Native-worker browser tests
at 390/1440px pass twice each. They use a local blank basemap and synthetic API
fixtures to isolate clustering from public tile availability; their screenshots
are not production-map evidence. Unit cases also cover duplicate features,
invalid coordinates, failed expansion/retry, late expansion, source loading,
style recreation and final idle synchronization. Exactly coincident lot
coordinates can still overlap at maximum zoom; each lot remains selectable in
the existing list.

## Verification

| Check | Result |
| --- | --- |
| Before-fix regression, mobile create action visibility | Failed as expected, both visibility and pointer-hit false |
| `npm exec -- playwright test e2e/driver-vehicle-modal.spec.ts --workers=1` | 10 passed |
| `npm test -- src/features/vehicles/__tests__/VehiclesPage.test.tsx --reporter=dot` | 29 passed |
| Final focused vehicle/map unit suites | 41 passed: 29 vehicle, 4 canvas integration, 8 cluster lifecycle |
| Native-worker map browser suite, `--repeat-each=2` | 4 passed (2 cases repeated twice) |
| Screenshots | Local `.artifacts/qa-reevaluation/vehicle-{create,edit}-{width}x{height}.png`; mobile 320px and desktop 1440px visually inspected |
| Typecheck | Passed after map integration |
| Lint | 0 errors; existing `src/vite-env.d.ts:22` explicit-any warning remains |
| Complete unit suite before map patch | 114 files / 1099 tests passed; latest full-head coverage is required from CI |
| Final production build | Passed, including application and E2E TypeScript projects; existing large map chunk warning remains |
| Full-head CI / release | Must be verified against the PR head and deployment SHA; local tests do not certify production |

The CI workflow includes the modal/deep-link, native-map cluster and existing
current-parking vehicle suites. Release evidence must refer to the resulting SHA.

## Booking closure criteria and rollback

Booking remains **OPEN / P0**. Provision authenticated reachable private/TLS
routes, then configure and validate Identity/Payment/Booking URLs and internal
tokens on the actual nodes before reintroducing deployment requirements. Verify
ownership rejection and real booking creation, then correlate the same booking
through its deposit and gate transitions. CI and healthy containers alone do
not satisfy these criteria. Do not bypass vehicle ownership, expose internal
endpoints publicly or substitute guessed URLs.

The present UI patch has no database or backend changes. Rollback is a revert
of its FE commit followed by the normal Vercel deployment. The current successful
backend deployment remains untouched.

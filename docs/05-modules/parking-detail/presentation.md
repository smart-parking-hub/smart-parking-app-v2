# Parking detail: photos and readable capacity/prices

- Screen: SCR-016, `/parking/:id`; owner: SmartParkingHub frontend.
- Last verified: 2026-11-17 (UTC+7).
- Scope: user-authorized presentation improvements to this single screen, using the supplied current-screen screenshots and existing navy/orange/surface tokens. No new Stitch HTML/CSS was supplied; this is not a pixel-match claim against a new Stitch design.

## Contract and presentation

`ParkingLotServiceImpl.toDetail` includes `slots`, `pricingRules` and `images` in `GET /api/v1/parking-lots/{id}`. Each image contains `id`, `contentUrl`, `originalFileName` and `cover`. Local content is read through `ApiImage` and the centralized API client, preserving application/auth headers and blob URL cleanup. External HTTP(S) content URLs, including Cloudinary URLs now returned by backend main, render directly without sending application API headers. No token is placed in an image URL. CDN support originates in FE commit `0634fff`; `ApiImage` is synchronized exactly with the newer `4436031` on the Cloudinary branch to avoid competing edits.

The gallery is shown only for a nonempty image list. Cover images are prioritized without mutating query data; the driver can choose another image through keyboard-operable thumbnails. Missing/loading image content uses `ApiImage`'s existing states, with booking independent of photo delivery. No stock/demo photos or unsupported facility descriptions are substituted.

Capacity cards reuse `entities/operations.vehicleLabels`: Ô tô 4–7 chỗ, Xe khách, Xe tải nhẹ, Xe tải nặng, Đầu kéo / Container. They retain the server's exact current free/total count, hourly base price, surge multiplier/time range and overtime multiplier. Time ranges display HH:mm. Missing prices and empty capacity lists remain explicit. Current capacity is distinct from availability for a chosen future window.

With photos, gallery and pricing use two columns on larger screens and stack on mobile. Without photos, rate cards use available width and responsive columns. The existing header/address, back-to-map link, error/retry, invalid-ID protection and `ReservationFlow` are retained.

## Capability parity

| Capability | Result |
|---|---|
| Public lot read, ID validation, loading/error/retry | Preserved |
| Name/address and return to map | Preserved; screen-specific Vietnamese eyebrow |
| Current capacity and all configured price factors | Preserved; readable cards and shared Vietnamese vehicle labels |
| Optional real photos and cover selection | Added from the existing response contract |
| Vehicle registration, date/time, availability/timeline, booking/payment/QR | Preserved through the existing shared reservation component |
| No images or missing configuration | Explicit states; no fictional data |

## Component placement

`ParkingLotGallery` and `ParkingCapacityPricing` live inside `features/parking-detail/components`, because they compose this detail screen. `ApiImage` remains the shared image primitive. `ParkingLotImage` is an entity transport type reused by the existing operations lot and booking-flow lot response; adding optional image fields does not change other screens' behavior. Gallery selection is local React state; server data stays in TanStack Query.

## Local photo recovery

Lot 37 returned four image metadata records but all four content URLs initially returned 404 because the running container's upload directory was absent and no image volume was mounted. The four corresponding source files were found under the user's local Pictures folder with exact original filenames, byte counts and valid JPEG/WebP signatures. They were copied to `docker_parking_images`; persistent copies were SHA-256 checked before mounting.

The local `compose.schedule.local.yaml` now mounts that volume at `/app/uploads/parking-lot-images`. Only Parking was recreated, with its same schedule image. Flyway remained at V9 and reported no migration necessary. All four content URLs subsequently returned 200 through Vite with SHA-256 matching the recovered source files. No image database row was changed and no substitute image was uploaded. Other lots' historical missing files are outside this recovery's scope.

Proof: `D:/DuAnOjt/audit-reports/parking-detail-presentation-20261117/image-recovery-proof.json` and frontend `.artifacts/parking-detail-live-images.json`. Keep the named volume and task recovery copy when updating local containers; do not remove the image volume as part of application restart.

## Verification

Targeted page/gallery and reservation regressions: 20 passed before the subsequent time-picker change; combined page/reservation/time-picker run: 25 passed. TypeScript, ESLint and production build passed. See `docs/09-audit/parking-detail-presentation-2026-11-17.md` for final full-suite/browser counts and visual evidence. Browser fixtures use local test media and never create a real booking or payment; the real lot-37 media was separately verified through its API.

# SCR-030 — Merchant lot profile visual redesign

- last_verified: 2026-11-08
- owner: Frontend maintainers
- Scope: `/merchant/parking-lots/:parkingLotId`.

## Design

Modern operational profile, DFII 14/15 (impact 4, context fit 5, feasibility 5, performance 4, consistency risk 4). Existing local Be Vietnam Pro headings and Source Sans 3 body; navy/orange project variables; 8px spacing rhythm. A dark available-capacity summary anchors the asymmetric capacity/location layout, with category icons and orange utilization bars. Pricing appears in comparable cards, with actual Vietnamese vehicle labels and VND formatting. Mobile stacks sections and uses two pricing columns. Motion stays limited to existing gallery/navigation hover feedback.

The design avoids anonymous text-heavy panels by using one distinct capacity summary, an actual location map and comparable vehicle rates. No fabricated counts, images or equipment claims.

## Verified contracts and capability parity

Evidence: backend ParkingLotDto, SlotDto, PricingRuleDto and existing page implementation.

| Capability | Result |
| --- | --- |
| Selected lot identity/status/review reason | Preserved from merchant GET detail |
| Navigation, edit/configuration visibility, QR route | Preserved with concurrent shared MerchantLotNavigation integration |
| Gallery/upload/refetch/error/lightbox Escape | Preserved; neutral copy and keyboard-openable thumbnails |
| Capacity | Sum actual slot rows; free/total counts per type; usage includes held slots |
| Pricing | Actual returned categories and basePricePerHour; no invented rates |
| Location | Exact returned coordinates; new read-only Leaflet map and existing Google Maps link |
| Missing data/loading/error/retry | Preserved and explicitly tested |

Leaflet is already installed; no dependency added. Location viewer and scoped CSS remain feature-owned. MerchantLotGallery is only consumed by this screen. No global tokens or unrelated screens changed by this redesign.

## Verification

- Targeted component tests: 6/6 pass with API fixtures, including permissions, empty/missing data, gallery, upload error and retry.
- Browser Edge (final run): 2/2 pass at 1440px and 390px, map loads, verified actual links, five utilization bars, no horizontal overflow/page errors, keyboard link focus.
- ESLint: pass, no warnings/errors.
- TypeScript project build and Vite build: passed; final typography/map-size polish also rechecked through two browser scenarios.
- Full suite: 342 passed, 2 failed in unrelated src/app/App.test.tsx (home heading lookup and owner-solutions timeout).
- Images: scr-030-detail-1440.png, scr-030-detail-390.png. Screenshots use synthetic network fixtures, not a live backend read.
- Map tiles depend on OpenStreetMap availability; tile failures show a fallback message and preserve the Google Maps link.

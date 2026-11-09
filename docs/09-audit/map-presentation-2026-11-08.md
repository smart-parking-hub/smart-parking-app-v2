# Parking map polish — 2026-11-08

- Owner: Codex; last_verified: 2026-11-08.
- Scope: user-requested driver/merchant map presentation and house/depot icon.
- Direction: utilitarian navigation; DFII 14 (impact 4, fit 4, feasibility 4, performance 4, consistency risk 2). Existing Be Vietnam Pro headings, Source Sans 3 body, navy/white surfaces and orange accent; 4px spacing rhythm, no decorative animation. Colors reference existing CSS variables only.
- Distinctive anchor: depot silhouette in a compact badge with a pointer anchored to GPS; detailed driver badges split hourly price and capacity.

## Files and placement

- Added `src/entities/parking-lot/parkingMapIcon.ts` and `parking-map-icon.css`: reusable Leaflet depot marker shared by driver search and merchant location/picker.
- Updated `InteractiveMapCanvas.tsx`: detailed lot markers, white-cased orange route, blue origin, Enter/Space selection and reduced-motion support. Popups open on interaction, with DOM text nodes for lot data.
- Updated `MerchantLotLocationMap.tsx` and `CreateParkingLotMapPicker.tsx`: compact depot marker with the same pointer.
- Updated `src/styles/globals.css`: removed retired pin styles, added scoped popup typography.
- Updated merchant screenshots `scr-030-detail-1440.png` and `scr-030-detail-390.png` through the existing E2E.

## Capability parity

| Capability | Result |
|---|---|
| Select lot / show name, address, price and capacity | Preserved; new marker presentation |
| Full-lot disabled booking | Preserved |
| Origin, OSRM route distance/time, route errors | Preserved |
| Search/filter/location and booking callbacks | Preserved |
| Merchant coordinates, picker click/update and external map link | Preserved |
| Tile error / retry, zoom, scale and attribution | Preserved |
| Keyboard selection | Improved: explicit Enter and Space support |
| Automatically opened selected popup | Changed: opens on interaction to keep map uncluttered |

No API, auth, permissions, payload, dependencies, pricing or routing contracts changed. Existing mapProvider and search DTO implementation were the contract reference; live backend acceptance was not performed.

## Verification

- `npm run typecheck`: passed.
- `npm run build`: first run passed. Final rerun blocked by concurrent unrelated change in `src/features/admin/__tests__/AdminUserGovernanceAndSettlement.test.tsx:206` (TS2769: `exact` is not a valid `ByRoleOptions` property). This file was not edited for map work.
- `npm run test -- src/features/parking-search src/features/merchant/parking-lots/__tests__`: 49/49 tests passed across 6 files.
- ESLint on all four changed TS/TSX files with `--max-warnings 0`: passed.
- `npm run lint`: 0 errors, 21 existing warnings outside changed files. Repository-wide zero-warning gate remains unmet; unrelated files were not changed.
- Existing `e2e/merchant-lot-detail.spec.ts`: 2/2 passed, desktop 1440 and mobile 390.
- Temporary Playwright verification `.artifacts/map-polish/verify.mjs`: driver passed at 1440/390; house SVG, full state, mocked route, keyboard selection, disabled booking, no horizontal page overflow or uncaught runtime errors.
- Visual evidence: `.artifacts/map-polish/driver-1440.png`, `driver-390.png`; merchant screenshots listed above.
- Browser tests use API/route fixtures and real OSM tiles. Initial attempts could not launch Edge inside sandbox/connect across sandbox; rerun with browser and Vite outside sandbox passed.

## Limits

Unselected lots outside the fitted route may fall beyond the viewport; “Toàn khu vực” remains available. Global lint warnings remain as reported. Existing concurrent admin/layout work was left untouched.

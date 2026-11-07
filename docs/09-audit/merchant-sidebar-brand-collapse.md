# Merchant sidebar branding and collapse

- Last verified: 2026-11-08
- Scope: Merchant shell shown in the user's screenshot.
- Status: Implemented and verified locally.

## Changes

- MerchantSidebar now displays Smart Parking Hub with the outlined orange Truck icon used by DriverHeader. Notifications use Bell.
- MerchantHeader exposes a desktop collapse/expand button in both its regular and profile variants. MerchantLayout owns this isolated UI state.
- Desktop sidebar, header offset and content padding change together between 260px and 76px. Collapsed links retain accessible names and native title tooltips. Keyboard focus remains visible.
- Mobile retains the full-width drawer regardless of desktop collapse state.
- Updated the default browser title/description and SVG favicon.
- Existing navigation, active states, support link, API calls and permission behavior are preserved. No dependencies added.

## Files

- Modified: src/layouts/MerchantLayout.tsx, src/layouts/merchant/MerchantSidebar.tsx, src/layouts/merchant/MerchantHeader.tsx, index.html, public/favicon.svg.
- Added: e2e/merchant-sidebar.spec.ts and this report. Browser screenshots: merchant-sidebar-dashboard-collapsed.png and merchant-sidebar-profile-collapsed.png.
- Deleted: none.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm test -- --silent`: 48 files, 344 tests passed.
- `npx playwright test e2e/merchant-sidebar.spec.ts`: 3 passed, covering dashboard/profile collapse and expansion, keyboard activation, accessible links, header alignment and mobile opening after desktop collapse.
- Browser execution required running Edge and Vite outside the sandbox; the initial sandbox attempt could not launch/connect. Successful rerun: 3 passed in 16.1s.
- Visually inspected the collapsed dashboard screenshot. API responses are stubbed in these shell tests, so the dashboard displays its existing API-error state. These tests do not validate live backend data.

## Limits

- Collapse state lasts while MerchantLayout remains mounted; it is not persisted across reloads.
- Marketing-page copy and other role layouts are outside this merchant-shell change. LandingMetadata continues to set its existing marketing titles while those pages are mounted.
- docs/05-modules/README.md is still a placeholder; there is no merchant-specific module specification there.

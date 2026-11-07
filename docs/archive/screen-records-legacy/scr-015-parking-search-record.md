# Screen Implementation Record: SCR-015 Interactive Parking Search & Map

- Screen: `SCR-015 Interactive Parking Search & Map (Bản đồ tương tác tìm kiếm bãi đỗ xe)`
- Route: `/parking`, `/dashboard/search`, `/dashboard/parking`
- Owning feature: `features/parking-search`
- Stitch source supplied: Yes (`SmartTruckHub Driver Ops - Parking Search` HTML/CSS)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_DRIVER`
- Legacy screen reference: `smart-parking-app/src/features/parking-search/pages/SearchParkingPage.tsx`
- Git branch: `feat/scr-15-parking-search`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Layout | Split-view workbench 12 cols (42% danh sách, 58% bản đồ sticky) | `SearchParkingPage.tsx` | Verified |
| Top Toolbar | Vehicle dropdown, 5 tải trọng, slider bán kính 1-50km, sort select, full lots toggle | `TopFilterBar.tsx` | Verified |
| Search bar | Smart location input, locate me GPS button, result counter signal | `SmartLocationBar.tsx` | Verified |
| Yard Cards | Best match chip, distance/eta, slots tag, pricing row, amenities, action buttons | `YardCardItem.tsx`, `YardCardList.tsx` | Verified |
| Map Canvas | Cartographic grid, vector road arteries, floating direction banner, controls, pins, legend, traffic alert | `InteractiveMapCanvas.tsx` | Verified |
| Quick Book Drawer | 10-minute hold countdown, yard highlight, ETA, ops deposit, confirm button | `QuickBookingDrawer.tsx` | Verified |

## Verification
- [x] Typecheck: `npm run typecheck` (`tsc --noEmit`) -> 0 Errors
- [x] Lint: `npm run lint` (`eslint .`) -> 0 Errors, 0 Warnings
- [x] Unit/component tests: `npm run test` (`vitest run`) -> 14/14 Tests Passed (100%)
- [x] Build: `npm run build` (`tsc -b && vite build`) -> Built successfully
- [x] Accessibility & Keyboard navigation: Drawer ESC close, aria labels on inputs and controls
- [x] Diff reviewed: Cô lập 100% trên nhánh `feat/scr-15-parking-search`

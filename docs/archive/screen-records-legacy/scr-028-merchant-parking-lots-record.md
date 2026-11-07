# Screen Implementation Record: SCR-028 Merchant Parking Lots Directory

> Integration correction — last_verified: 2026-11-07; owner: frontend maintainers.
> Earlier visual claims below describe prototype data, not database-backed behavior.
> VERIFIED cause: the page initialized mock metrics, called an unsupported `/metrics` endpoint,
> sent `status=ALL` to an enum parameter and replaced failed list requests with three demo yards.
> The list now validates `ApiResponse.data`, propagates errors and omits ALL/blank search parameters.
> Server state uses TanStack Query with filter/page/sort keys, cancellation and refresh on remount.
> Summary cards use server totals from unfiltered/all, APPROVED and PENDING_APPROVAL queries (size=1).
> No occupancy/revenue/vehicle/gate/amenity values are fabricated from the narrow list DTO.
> Preserved: keyword/status filtering, server pagination, supported name/date sorting, persisted grid/table mode,
> registration, detail, edit, slot/pricing/scanner links for approved yards.
> Export now downloads actual CSV rows from the current filtered page; disabled for empty/error/loading.
> Removed prototype behaviors: unsupported capacity/rating/revenue sorting, simulated export and support-success toast.
> Ownership source evidence: ParkingLotController passes authenticated user ID; ParkingLotServiceImpl calls
> ParkingLotRepository.searchOwnedParkingLots with `p.merchantId = :merchantId`. No backend/schema changes.
> LIVE VERIFIED: the existing browser session (#MCH-15) shows 0 total/approved/pending yards and the initial empty state.
> Dashboard in that session also shows 0 yards/bookings and a zero wallet. No demo yards rendered after navigation.
> Unit/component regression: owned list 8/8, dashboard 6/6 passed. Full ESLint passed; TypeScript project build and Vite production build passed.
> Existing demo detail/edit helpers remain outside this list integration; direct deep links were not reworked here.

- Screen: `SCR-028 MerchantParkingLotsPage (Danh mục bãi đỗ xe sở hữu)`
- Route: `/merchant/parking-lots`
- Owning feature: `features/merchant/parking-lots`
- Stitch source supplied: Yes (`SMARTTRUCK HUB MERCHANT OPS` HTML/CSS web_dashboard shell)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_MERCHANT`
- Legacy screen reference: `MOD-04: Merchant Operations Portal`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Layout & Shell | Fixed 260px desktop sidebar with 8 merchant navigation links, active highlight on `Bãi đỗ của tôi`, top control header with live ticker | `MerchantLayout.tsx`, `MerchantSidebar.tsx`, `MerchantHeader.tsx` | Verified |
| Typography | Sora (headlines, lot titles, numbers), Inter (body/labels), Mono (yard codes, slot gauge %, timestamps, #MCH-88219) | Tailwind v4 @theme, font-sora, font-mono | Verified |
| Colors/surfaces | `#131b2e` (primary-container), `#d95f00` (tertiary accent), `#eff4ff` (surface-container-low), `#0d1c2e` (on-surface text) | Industrial freight color tokens in Tailwind v4 | Verified |
| Industrial Header | Eyebrow `QUẢN LÝ MẶT BẰNG & NĂNG LỰC TIẾP NHẬN`, Title H1, button `Xuất Báo Cáo Mặt Bằng`, primary CTA `+ ĐĂNG KÝ BÃI ĐỖ MỚI` | `MerchantParkingLotsHeader.tsx` | Verified |
| Metric Bento Strip | 3 Bento KPI cards: Tổng cơ sở khai thác (03/02/01), Năng lực tiếp nhận (200/165 slot 82.5%), Doanh thu hôm nay (18.450.000 VND, +14.2%, 48 lượt barie) | `MerchantParkingLotsMetrics.tsx` | Verified |
| Workbench Controls | Search input with live filter, shared custom `Select` dropdowns (status & sort with subtle styling & orange active highlight), and interactive view switcher (Grid vs Table) | `MerchantParkingLotsFilterBar.tsx`, `Select.tsx` | Verified |
| Master Card View | Card Cát Lái Gate 2 (90% capacity near full alert, reefer/cont fleets, 380V cold charging, 100T weigh station, 4 CTAs: SCR-030, 032, 033, 036), Sóng Thần 2, Phú Hữu 2 (pending approval compliance checklist, contact admin) | `MerchantParkingLotCardItem.tsx` | Verified |
| Master Table View | Compact table view with lot name/code, address, status tag, capacity/usage ratio, revenue, action links | `MerchantParkingLotsTableView.tsx` | Verified |
| Compliance Banner | Regulatory notice banner regarding PCCC inspection and ALPR gate synchronization within 24-48h + pagination controls | `MerchantParkingLotsPagination.tsx` | Verified |
| Interactive Modals & Toast | Export Report modal (XLSX, CSV, PDF selection) + fast floating support toast for pending inspection acceleration | `ExportReportModal.tsx`, `MerchantParkingLotsPage.tsx` | Verified |

## Verification
- [x] Typecheck: `tsc --noEmit` / `tsc -b` -> 0 Errors
- [x] Unit/component tests: `vitest run` -> 9/9 SCR-028 tests passed (100%), 17/17 test suites passed (100%, 140/140 tests)
- [x] Production build: `npm run build` (`tsc -b && vite build`) -> Built successfully (`dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css`)
- [x] Accessibility & Keyboard navigation: Semantic buttons, ARIA labels, responsive scrollbars, accessible color contrasts

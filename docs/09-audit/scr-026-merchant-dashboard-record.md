# Screen Implementation Record: SCR-026 Merchant Operations Dashboard

- Screen: `SCR-026 Merchant Dashboard Home (Bảng điều khiển tổng quan vận hành & doanh thu chủ bãi)`
- Route: `/merchant`, `/merchant/dashboard`
- Owning feature: `features/merchant/dashboard`
- Stitch source supplied: Yes (`SMARTTRUCK HUB MERCHANT OPS` HTML/CSS web_dashboard shell)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_MERCHANT`
- Legacy screen reference: `MOD-04: Merchant Operations Portal`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Layout & Shell | Fixed 260px desktop sidebar with 8 merchant navigation links, hotline `1900 6868`, top control header with live ticker, notification center, and user avatar | `MerchantLayout.tsx`, `MerchantSidebar.tsx`, `MerchantHeader.tsx` | Verified |
| Typography | Sora (headlines, KPI numbers), Inter (body/labels), Mono (timestamps, slot codes, license plates) | Tailwind v4 @theme, font-sora, font-mono | Verified |
| Colors/surfaces | `#131b2e` (primary-container), `#d95f00` (tertiary accent), `#eff4ff` / `#f8f9ff` (surface backgrounds), `#0d1c2e` (on-surface text) | Industrial freight color tokens in Tailwind v4 | Verified |
| Command Surface | Welcome banner with quick yard selector dropdown, live time indicator, instant action shortcuts (Tạo booking thủ công, Xuất báo cáo ca, Quét QR Check-in) | `MerchantCommandSurface.tsx` | Verified |
| Bento Metrics | 4 KPI cards: Doanh thu thực nhận hôm nay (`48.250.000 ₫`), Công suất bãi (`82%`), Lượt xe đang lưu bãi (`196 xe`), Cảnh báo vi phạm & quá giờ (`03 ca`) | `MerchantBentoMetrics.tsx` | Verified |
| Operations Split 65:35 | Left (65%): SVG combo chart (Doanh thu & Lưu lượng 7 ngày) + Recent check-in manifest table (Danh sách xe vừa check-in gần nhất)<br>Right (35%): Live yards capacity list (3 bãi đỗ với progress bar & occupancy tags) + ALPR gate controller card with live camera feed simulation | `RevenueVolumeComboChart.tsx`, `RecentCheckinManifestTable.tsx`, `LiveYardsCapacityList.tsx`, `AlprGateControllerCard.tsx` | Verified |
| Responsive | Mobile collapse drawer sidebar, responsive flex-wrap, 1-to-4 column Bento grid, horizontally scrollable manifest table & SVG chart | Responsive Tailwind utility classes | Verified |

## Verification
- [x] Typecheck: `tsc --noEmit` / `tsc -b` -> 0 Errors
- [x] Unit/component tests: `vitest run` -> 15/15 Test Files Passed, 123/123 Tests Passed (100%)
- [x] Production build: `npm run build` (`tsc -b && vite build`) -> Built successfully (`dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css`)
- [x] Accessibility & Keyboard navigation: Semantic buttons, ARIA labels, responsive scrollbars, accessible color contrasts

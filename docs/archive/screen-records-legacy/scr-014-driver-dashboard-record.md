# Screen Implementation Record: SCR-014 Driver Dashboard Home

- Screen: `SCR-014 Driver Dashboard Home (Tổng quan Tài xế)`
- Route: `/dashboard`, `/driver`, `/driver/dashboard`
- Owning feature: `features/driver` (re-exported via `features/dashboard`)
- Stitch source supplied: Yes (`SmartTruckHub Driver Ops` HTML/CSS)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_DRIVER`
- Legacy screen reference: `smart-parking-app/src/features/dashboard/pages/DashboardHomePage.tsx`
- Git branch: `feat/scr-014-driver-dashboard`
- Status: **READY_FOR_REVIEW**

## 4-Layer Architecture (Hiến pháp Rule 15)
- **Layer 1 (Shared UI Primitives)**: `src/shared/components/` (`Workspace`, `Panel`, `Notice`, `QueryState`, `Select`, `ApiImage`).
- **Layer 2 (Entities)**: `src/entities/driver.ts`, `src/entities/operations.ts` (`DriverEntity`, `DriverBookingEntity`, `DriverMetricsEntity`).
- **Layer 3 (Feature Components)**: `src/features/driver/components/` (`DriverWelcomeBanner`, `DriverStatGrid`, `ActiveTripCard`, `DriverShortcuts`, `RecentBookingsTable`, `QrCheckoutModal`, `DashboardSkeleton`, `DashboardEmptyState`).
- **Layer 4 (Feature Pages & Entry Points)**: `src/features/driver/pages/DriverDashboardPage.tsx`, `src/features/driver/index.ts`.

## 4 UI States Handled
1. **Loading State**: `DashboardSkeleton` with smooth pulse animations across Banner, Bento KPIs, Active Trip, Shortcuts and Manifest.
2. **Empty State**: `DashboardEmptyState` with truck illustration, guidance message, and clear CTAs linking to SCR-020 (`/vehicles`) and SCR-015 (`/parking`).
3. **Error State**: Error alert banner displaying error code and interactive retry button (`Thử lại`).
4. **Success State**: Complete operational dashboard with quick manifest search, copy QR pass notification toast, and real-time active parking telemetry.

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Layout | Shell cố định 68px header, full-width footer, max-w-1280px container | `DriverLayout.tsx`, `DriverHeader.tsx`, `DriverFooter.tsx` | Verified |
| Typography | Sora (headlines), Inter (body/labels), Mono (codes/timers) | Tailwind v4 @theme, font-sora, font-mono | Verified |
| Colors/surfaces | `#131b2e` (primary-container), `#d95f00` (orange accent), `#f8f9ff` (surface bg) | Tailwind v4 utilities | Verified |
| Components | Command deck banner, 4 Bento KPI cards, Split pane active trip, Shortcuts, Manifest table, QR modal, Empty state | `src/features/driver/components/` | Verified |
| Responsive | Mobile drawer nav, 1-to-4 col grid responsive, scrollable manifest table | Tailwind grid & flex responsive prefixes | Verified |

## Verification
- [x] Typecheck: `npm run typecheck` (`tsc --noEmit`) -> 0 Errors
- [x] Lint: `npm run lint` (`eslint .`) -> 0 Errors, 0 Warnings
- [x] Unit/component tests: `npm run test` (`vitest run`) -> 100% Tests Passed
- [x] Build: `npm run build` (`tsc -b && vite build`) -> Built successfully
- [x] Form validation: Zod schema & React Hook Form
- [x] UI State: `useDriverDashboardStore` (modal, search, toast notifications)
- [x] Accessibility & Keyboard navigation: Modal ESC key close, semantic links & buttons
- [x] Diff reviewed: Cô lập 100% trên nhánh `feat/scr-014-driver-dashboard`

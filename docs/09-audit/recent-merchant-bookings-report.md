# Recent merchant bookings presentation

- Owner: Frontend maintainers
- Last verified: 2026-11-15
- Scope: `/merchant/dashboard`, recent bookings section only.
- Status: Implemented; scoped checks passed; repository-wide checks have unrelated failures/warnings.

## Changes

Created `RecentMerchantBookings.tsx` under the dashboard feature and replaced the wrapping list in `MerchantDashboardPage.tsx`. Added a quiet header, labeled aligned columns, readable plates, abbreviated long codes, sentence-case status badges, row hover/focus feedback, mobile stacked rows and a full-width view-all link. Existing empty/loading/error behavior, data order, detail links and shared Badge status mapping remain available. No dependencies or global CSS changes.

## Verification

| Check | Command / environment | Result |
| --- | --- | --- |
| TypeScript | `npm run typecheck` | Passed |
| Build, final source | `npm run build` | Passed, Vite 15.39s |
| Scoped lint, final source | `npx eslint src/features/merchant/dashboard/components/RecentMerchantBookings.tsx src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx --max-warnings=0` | Passed |
| Dashboard + yard integration, final source | `npm run test -- src/features/merchant/dashboard/__tests__/MerchantDashboardPage.test.tsx src/features/merchant/__tests__/Batch14DMerchantYardIntegration.test.tsx` | 17/17 passed |
| Repository lint | `npm run lint -- --max-warnings=0` | Failed: existing useEffect dependency warning in `RegisterPage.tsx:198` |
| Full suite before final accessibility fix | `npm run test` | 720 passed, 14 failed in 4 files. One dashboard failure was duplicate short-code text; fixed using an accessible link label and verified by the final 17-test scoped run. Other failures were payment-cancel (11 missing QueryClient), payment-return (1 assertion) and notifications (1 timeout). Full suite was not rerun after the fix. |
| Browser | Standalone development fixture, same production component and CSS | Desktop/tablet table and 390px mobile layout; no horizontal overflow; five detail links preserve IDs and original codes; Tab reaches the next detail link; empty state inspected; no component console warnings/errors |

The browser had no authenticated merchant session and redirected the live route to login. Visual verification used synthetic fixture data, including long identifiers/lot names and the longest standard status label. The temporary fixture was removed after verification. No live end-to-end booking operation was performed.

## Evidence

- `recent-merchant-bookings-desktop.jpg`: component at 802px width.
- `recent-merchant-bookings-mobile.jpg`: 390px viewport.
- Ignored command logs: `.artifacts/recent-bookings-tests.log`, `.artifacts/recent-bookings-build.log`.

Full capability mapping: `docs/05-modules/merchant/dashboard-recent-bookings.md`.

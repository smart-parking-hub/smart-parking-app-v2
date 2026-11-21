# Public asset and narrow-screen performance review

- Owner: SmartParkingHub frontend
- Last verified: 2026-11-21 (UTC+7)
- Branch: `fix/production-performance`; reviewed directly in the primary FE checkout.

## Changes retained

| Asset | Previous bytes | Optimized bytes |
|---|---:|---:|
| Shared logo | 187,716 | 32,362 |
| Auth background, full resolution | 848,226 | 133,588 |
| Auth background, small landscape candidate | 848,226 | 42,818 |

The full-resolution WebP and logo reduce their combined resource size by about 84%. These are asset byte measurements, not a page-load timing claim. The original logo and JPEG remain available; JPEG is the non-WebP fallback.

Auth image selection accounts for `object-cover`: portrait screens need image width determined by viewport height, so `sizes` must not simply be `100vw`. Portrait uses the sharper 1376px candidate; a small 640x320 landscape viewport can use the 720px candidate. Image crop and form layout are retained.

The public navbar previously measured 395px wide at both 320px and 390px viewports. The revised production build measures 320px and 390px respectively. Desktop remains 1440px at a 1440px viewport. At widths up to 360px, the header CTA is reachable in the mobile menu; the page's main action is retained.

## Changes removed during review

- Removed the proposed repository-wide ignore of `docs/09-audit`; existing confidential QA reports/evidence remain local via narrowly scoped `.git/info/exclude` entries.
- Reverted the added Vercel cache headers, including the week-long browser cache across all `/images` resources. No proxy or routing changes are included.

## Verification

- TypeScript check passed; final production build passed.
- ESLint: zero errors, one existing `no-explicit-any` warning in `src/vite-env.d.ts:22`. Build retains the existing large-chunk warning.
- Full unit/component suite: 114 files, 1,099 tests passed. Existing JSDOM canvas diagnostics are emitted by unrelated map fixtures.
- Public/mobile E2E: 7 passed, covering nine public routes at 320/375/390px, mobile-menu CTA navigation, portrait/landscape image selection, asset budgets and empty-login validation without a credential request.
- The first E2E pass had one cold Vite lazy-route load exceed the default five-second assertion wait while other heavy checks ran. The final isolated run passed all seven tests without raising the E2E assertion timeout.
- Before/after screenshots and resource/width measurements: `.artifacts/performance-review-20261121/` (local, ignored). Comparison uses deployed main as baseline and the final local production build, avoiding development-only auth controls in the visual comparison.
- Added this public/mobile regression suite to the existing GitHub quality gate. No dependency, API, permission or business-rule changes.

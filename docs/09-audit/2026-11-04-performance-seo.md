# Landing performance and SEO

Owner: frontend maintainers. Last verified: 2026-11-04.

## Scope and design

Optimize the shared startup path, public-page metadata, `/api-docs`, and home
assets. The user's reference was a desktop Lighthouse run (56 Performance,
94 Accessibility, 96 Best Practices, 83 SEO) against the development server.
Production and development scores are not a controlled before/after comparison.

Design direction: industrial/utilitarian logistics. Keep the navy terminal,
orange accents, asymmetric solution grid, and numbered onboarding steps.
DFII: impact 4 + fit 4 + feasibility 4 + performance 5 - consistency risk 3 = 14.
Be Vietnam Pro provides heading structure; Source Sans 3 supports Vietnamese
body copy. Both are local WOFF2 fonts. Dark orange text on light panels and
navy labels on orange buttons improve contrast. Reduced-motion preferences
disable nonessential animation. Small-screen actions remain in the mobile menu.

## Architecture and behavior

| Boundary | Implementation / preserved behavior |
| --- | --- |
| Router | Existing URLs, parameters, aliases and role guards retained. Page/layout imports load on demand under the existing Suspense fallback. |
| Public pages | Landing components own public metadata; aliases use the primary route as canonical. |
| Driver / merchant / admin | Modules load when visited; they no longer inflate the public entry bundle. Backend authorization remains unchanged. |
| Server state | Existing TanStack Query provider and request layer unchanged. |
| Client / form state | Redux, local component state and React Hook Form unchanged. |
| API demo | Four example tabs and copy payload retained; readable syntax colors and real section anchors added. |
| Navigation | All menu links remain available, including the primary CTA in the small-screen drawer. |
| Images | Existing home photography retained, delivered locally as WebP; service images remain lazy loaded. |

No new runtime packages. Removed the catch-all vendor chunk so optional map,
form and portal dependencies follow their route. Before this change the four
entry JavaScript chunks totaled 1,257.22 kB uncompressed. Build output is in
`.artifacts/performance/build.log`; the route chunks are independent afterward.

Fixed a direct-load bug: the Vite `/api` proxy also matched `/api-docs` and
returned a backend error. `^/api(?:/|$)` now forwards only API paths.

Global description and language are available in the HTML shell. Each public
route adds a specific title, description, canonical URL and Open Graph tags.
`public/robots.txt` prevents SPA fallback HTML from being mistaken for robots
directives. Canonicals derive from the serving origin; no production domain
was invented. Source font licenses are included.

Below-fold home/API sections use CSS content visibility with reserved size;
their content stays in the DOM for search, keyboard navigation and assistive
technology. No business capability was removed for the score.

## Reproduce

```powershell
npm run preview:production
```

Open `http://127.0.0.1:4173/api-docs` or the home page, then run Lighthouse in
a clean browser profile. Select Desktop for comparison with the supplied report.
Use a separate run for Mobile. The preview command is for local verification,
not a production hosting service. Deploy the generated `dist` through the normal
hosting pipeline and configure SPA rewrites and `/api/` routing there as well.

Vite documents this distinction in its [static deployment guide](https://vite.dev/guide/static-deploy).
CSS rendering deferral follows [Chrome's guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/performance/defer-rendering-heavy-content).

## Final Lighthouse results

Chrome 156, Lighthouse 13.6.0, local production preview, fresh Lighthouse
navigation, sequential runs using the standard desktop/mobile presets:

| Page / device | Performance | Accessibility | Best Practices | SEO | LCP | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| API / desktop | 99 | 100 | 100 | 100 | 0.9 s | 0 ms |
| API / mobile | 93 | 100 | 100 | 100 | 3.3 s | 0 ms |
| Home / desktop | 98 | 96 | 100 | 100 | 1.0 s | 0 ms |
| Home / mobile | 86 | 96 | 100 | 100 | 4.2 s | 0 ms |

CLS was 0 in all four final runs. The API page meets the requested ~90 target
on both presets; home meets it on desktop, while mobile home remains below 90.
Other public and authenticated pages have not been individually benchmarked.
The remaining home accessibility finding concerns text contrast. Results vary
with host load; earlier concurrent local work produced lower mobile results.

HTML/JSON reports: `.artifacts/performance/{api,home}-{desktop,mobile}.{html,json}`.

## Validation and limitations

- `npm run build`: passed (TypeScript project build and Vite).
- `npm run typecheck`: passed.
- `npm run lint`: passed, no errors/warnings.
- Full Vitest suite: 25 files, 187 tests passed. Several existing portal tests
  emit jsdom network errors because they attempt backend requests; assertions pass.
- Final focused rerun: 4 files, 19 tests passed, covering public pages, route
  matching, metadata updates/cleanup, canonical aliases and denied clipboard access.
- Real browser smoke checks passed: API and home at 360, 390, 768, 1024, 1249,
  1280 and 1440 px without document overflow; API tab switching, clipboard copy,
  section anchors, mobile navigation, anonymous redirects for all three roles,
  robots.txt and no JavaScript page errors. `smoke.json` records these checks.
- Viewed desktop hero and mobile workflow screenshots. Offscreen sections render
  when scrolled into view. Full-page screenshots can omit offscreen content with
  CSS content visibility; viewport captures (`api-{hero,workflow,cta}-{390,1440}.png`)
  are the visual evidence.
- Browser audit artifacts and screenshots: `.artifacts/performance/` (ignored
  generated files, never deployed).
- Lighthouse results are local lab measurements, not production field data.
  The mobile simulation is slower than desktop and has a separate score.
- Metadata is updated by the SPA after JavaScript loads. Full prerendering,
  production sitemap/domain configuration and real search indexing were not
  implemented or verified in this task.
- Existing marketing/demo claims, sample payloads and placeholder integrations
  were retained; this task does not certify a live SDK download, sandbox
  provisioning, SLA or backend transaction flow.

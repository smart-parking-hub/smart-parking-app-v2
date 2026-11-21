# Live QA follow-up: vehicle sizing and pre-React loading

- Owner: frontend maintainers
- Date: 2026-11-21 (UTC+7)
- Input: private `2026-11-21-live-production-qa-verification.md` (111 lines)
- Baseline: FE main/production `60275b2`, BE `a841f21`

## Assessment of the report

The report lists three action items although its introduction says two. Treat
each finding against the mounted DOM and current code, rather than editing an
unused file because its name appears in the report.

| Item | Verified baseline | Decision |
| --- | --- | --- |
| Duplicate vehicle select arrow | The mounted editor is `VehicleEditor.tsx`, already using `appearance-none`. Chrome 138 / Edge 158 report appearance and WebKit appearance `none`, no background image and exactly one SVG Chevron. `#modal-reg-class` is absent; `RegisterVehicleModal.tsx` has no caller. | Not reproduced in these browsers. Keep native select behavior and cover the mounted selector; do not patch dormant code and claim a production fix. |
| Redundant table scroll | At 1164 CSS px, the table region is 1098px and the forced table width is 1100px: exactly 2px overflow. At 1280 CSS px there is no overflow. Simply removing the floor still leaves intrinsic content wider than some smaller desktop regions. | Remove the artificial floor on desktop and compact only medium desktop cell padding/current-lot minimum; retain mobile horizontal access to all seven columns. |
| Empty cold bootstrap | With entry scripts paused, both `/login` and anonymous `/parking` return HTTP 200 with an empty root. After scripts resume, the anonymous parking route correctly redirects to login. | Add a small accessible status in the initial HTML. Preserve the existing React Suspense fallback and authentication/route guards. This app uses createRoot, not SSR hydration. |

The supplied merchant screenshot demonstrates a visible modal footer, not a
completed withdrawal. Reading balances and opening a form cannot establish the
report's claim that all real deposit/withdrawal flows passed. No money movement
is performed or claimed by this repair.

## Scope and behavior

- `index.html`: add a status paragraph inside `#root` with the same loading text,
  muted color and spacing as the existing application fallback. Its tiny inline
  styling also works before JavaScript/CSS-module execution. React replaces the
  paragraph normally when mounting; no private content is rendered before auth.
- `VehiclesTable.tsx`: below 1024px retain the original 1100px readable table and
  named horizontal scroll region. Between 1024px and 1279px, use 12px horizontal
  cell padding and a 160px current-lot minimum so the seven columns fit the
  available desktop width. At 1280px and above restore the existing 20px padding
  and 208px current-lot minimum; desktop table minimum is its container width.
- No fields, actions, API calls, permissions, filtering, vehicle validation,
  booking logic, auth bootstrap or backend configuration are changed.

## Regression evidence and release gate

Four browser regressions fail on the baseline: loading status before scripts for
anonymous login/parking, authenticated vehicle bootstrap, and table sizing near
the old width threshold. The suite additionally checks mobile 320/390px with all
seven columns and reachable actions, and the mounted one-arrow vehicle selector.
Use real browser layout measurements; JSDOM/class-name assertions cannot prove
that a two-pixel scroll was removed.

```text
npx playwright test e2e/live-qa-layout-regressions.spec.ts --workers=1
npx vitest run src/features/vehicles/__tests__/VehiclesPage.test.tsx
npx tsc -b --force
npm run lint
npm run build
```

Review the exact remote head, changed-file blobs and full CI before merge. Repeat
the read-only production probe after Vercel deploys that merge SHA; record actual
dimensions, route handoff, selector state, browser versions and images in the PR
receipt and private input report. Raw credentials/account screenshots remain
ignored locally. A passing CI or form render is not a real financial transaction.

Rollback: revert this FE patch and use the normal Vercel integration. No database,
provider credential, backend deployment or volume rollback is involved.

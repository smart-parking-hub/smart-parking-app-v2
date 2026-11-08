# SCR-029 — Parking lot registration redesign

- Last verified: 2026-11-07 (Asia/Bangkok)
- Owner: frontend maintainers
- Scope: `/merchant/parking-lots/new` only; requested redesign of the existing screenshot.
- Status: Implemented; screen-specific checks pass. Repository-wide test gate remains failing in SCR-030, outside this change.

## Direction and design system

**Trạm điều phối tinh gọn / refined utilitarian.** The primary purpose is completing a clear three-step registration, with a larger form and a narrower preparation guide. The navy step with orange number and the parking-bay motif give the page a recognizable identity.

DFII: impact 4, context fit 5, feasibility 5, performance 4, consistency risk 4 = **14**.

- Headings: locally hosted Be Vietnam Pro; body: locally hosted Source Sans 3, both already available with Vietnamese glyphs.
- Existing variables only: brand navy, primary orange, surface/border/text and semantic status tokens. Darker existing orange token on primary buttons supports readable white labels.
- Spacing follows an 8px rhythm with 24–32px section gaps; desktop workspace uses a 304px guide alongside a flexible form. Below 900px the form becomes one column and optional guidance is hidden.
- Motion is limited to state-color transitions and loading spinners; the existing reduced-motion rule remains effective.
- Visual identity comes from the navigation structure and parking-bay motif. No images, fonts, libraries or dependencies were added to the runtime.

## Implementation and placement

Created `src/features/merchant/parking-lots/pages/CreateMerchantParkingLotPage.css` and `e2e/merchant-registration.spec.ts`. Updated the create page, its six existing feature components (stepper, basic info, photos, geo, confirmation, footer), and its existing component test file. Updated screen inventory and parity matrix. No files were deleted.

All components remain under the merchant parking-lots feature because they contain registration-specific copy and behavior. Shared tokens, route guards, layouts and API modules were not edited. CSS is scoped under `.lot-registration`.

## Verified behavior and contracts

- `POST /api/v1/merchant/parking-lots`: name, address, latitude, longitude; backend `hasRole('MERCHANT')` remains authoritative.
- `POST /api/v1/merchant/parking-lots/{id}/images`: existing multipart upload function preserved.
- Name/address lengths and coordinate ranges are unchanged and match backend request constraints.
- Images remain optional, with current maximum five, 5 MB each, JPG/PNG/WebP restrictions preserved.
- Draft key and restoration are unchanged; unavailable browser storage now produces a visible message. Image files are not persisted and this limitation is explicitly stated.
- Images can also be dropped into the upload area. Removed/unmounted object URLs are revoked.
- Retry reuses the created lot ID and clears its draft after successful upload.
- The final summary now correctly displays zero coordinates. Technical status remains `PENDING_APPROVAL`; the user sees “Chờ phê duyệt”.
- Unsupported encryption, PCCC-document and 24–48-hour review promises were removed from explanatory copy; no new business requirements were added.
- Previously saved AI content still restores, displays and can be cleared; no new AI widget was introduced.

## Verification

| Check | Command/environment | Result |
|---|---|---|
| TypeScript | `npm run typecheck` | PASS |
| ESLint | `npm run lint` | PASS, 0 errors/warnings |
| Registration component tests | `npm run test -- src/features/merchant/parking-lots/__tests__/CreateMerchantParkingLotPage.test.tsx` | 10/10 PASS |
| Full component suite | `npm run test -- --reporter=dot` | 319 passed, 6 failed; 46 files passed, 1 failed (`MerchantParkingLotDetailPage.test.tsx`, SCR-030) |
| Production build | `npm run build` | PASS |
| E2E | `REGISTRATION_BASE_URL=http://127.0.0.1:5175 npx playwright test e2e/merchant-registration.spec.ts` (PowerShell environment equivalent) | 3/3 PASS, Edge headless |
| Diff whitespace | `git diff --check` | PASS |

The old registration test suite had 6/7 failures before implementation: it expected AI/SLA widgets and prefilled data absent in the current source. It now exercises actual form validation, restoration, navigation, image restrictions and removal, zero coordinates, pending-state locking, and upload retries.

E2E uses test-only MERCHANT JWTs and mocked profile/create/upload APIs, so no real lot is created. It verifies both 1440px desktop and 390px mobile, no horizontal overflow, keyboard navigation of completed steps, visible validation/focus, image previews, coordinates, draft persistence, confirmation and upload retry. Page errors and console warnings/errors are checked; network failures from external map tiles are allowed by the test. Map tiles were visible in the inspected screenshots. Runner itself emits an environment warning because both NO_COLOR and FORCE_COLOR are set.

Edge could not launch inside the OS sandbox; browser checks and a local Vite server were rerun in the permitted host environment. No application permissions were changed.

## Visual evidence

Inspected initial, map and confirmation layouts on desktop/mobile. Screenshots are generated by the E2E test:

- [Desktop form](./scr-029-redesign-1440.png)
- [Mobile form](./scr-029-redesign-390.png)
- [Desktop map](./scr-029-map-1440.png)
- [Mobile map](./scr-029-map-390.png)
- [Desktop confirmation](./scr-029-confirm-1440.png)
- [Mobile confirmation](./scr-029-confirm-390.png)

Accessible labels, field errors via `aria-describedby`, required/invalid attributes, live feedback, native buttons, `aria-current=step`, visible keyboard focus, input font size 16px, disabled submission controls and responsive layout are implemented.

## Remaining limitations

- The full suite is not green because six SCR-030 detail-page tests fail. That page/test source was not changed. Other existing suites also log unmocked-request/query warnings. These issues were not expanded into this single-screen task.
- This validates frontend behavior with mocked write APIs, not a live backend end-to-end deployment.
- `docs/05-modules/` currently contains only a placeholder index; this screen record and the verified source supply the module-specific evidence.
- Existing API module fallback behavior was preserved and not audited or rewritten in this presentation task.
- Manual visual inspection covered 1440px and 390px; CSS includes tablet breakpoints, but no separate tablet screenshot was captured.


## Follow-up — wider form, reduced sidebar gap (2026-11-07)

At the user's request, removed the centered 1240px container cap, reduced desktop horizontal padding to 24px, and reduced the form-to-guide gap from 32px to 24px. The form now takes the available workspace width while the guide remains 304px. Existing mobile padding remains 16px.

Verification: all three registration Playwright tests pass again (1440px, 390px and upload retry). A separate 1920px browser check measured sidebar edge x=260, content x=284 (24px separation), content width=1612px, form width=1284px, and no horizontal overflow. [Wide desktop screenshot](./scr-029-redesign-1920.png). Only the screen-scoped CSS was changed for this follow-up; business code and tests were unchanged.

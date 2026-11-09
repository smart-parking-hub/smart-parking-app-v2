# Admin users and navigation redesign

- Owner: frontend maintainers / Codex implementation
- last_verified: 2026-11-08
- Scope: SCR-045 `/admin/users` and its existing shared Admin shell.
- Status: implemented; scoped checks pass; repository-wide quality gate remains open.

## Design

Industrial Control Desk, inspired by transport operations desks. DFII: impact 4 + context 5 + feasibility 5 + performance 5 - consistency risk 5 = 14. Recognizable anchor: grouped navy navigation with a slim orange active rail, angular shield badge and compact operational typography. Uses existing Be Vietnam Pro headings, Source Sans 3 body, semantic navy/orange/surface tokens and an 8px spacing rhythm. Motion is limited to existing short hover transitions and respects the global reduced-motion rule. No new packages or font downloads.

## Implementation and placement

- `src/layouts/AdminLayout.tsx`: structural navigation grouped into operations, finance/control and system; light header, account shortcut, logout and skip link. Local AdminNavigation composes the same destinations on desktop and mobile.
- `src/layouts/admin-layout.css`: Admin-only presentation and responsive sizing, existing CSS variables.
- `src/features/admin/index.tsx`: SCR-045 passes an accessible mobile user card to the existing DataTable. All identity, contact, role, status and join-date fields remain visible.
- Existing shared Dialog supplies native modal focus containment, Escape handling, focus restoration and background scroll locking. Desktop media-query changes close the mobile drawer.
- Four existing component-test files updated for redesigned labels, semantic active navigation and separate desktop/mobile representations.
- `e2e/admin-users-layout.spec.ts`: mocked-network browser coverage for 390, 768 and 1440px, no document overflow, correct navigation, modal semantics, Escape/focus restoration and mobile detail link.

## Capability parity

| Capability | Result | Evidence |
| --- | --- | --- |
| Nine Admin destinations, active route | Preserved; grouped presentation | AdminLayout, component/browser tests |
| Logout, session/cache clearing and login redirect | Preserved | Same clearSession, storage removal, cache.clear and navigate calls |
| Paged user list, 20/page | Preserved | Existing AdminList query unchanged |
| User identity, phone, email, role, status, joined date | Preserved; mobile card added | Same User fields and Badge/date helpers |
| Management and detail navigation | Preserved | Existing table links and mobile card point to `/admin/users/:id` |
| Loading, error and empty states | Preserved | QueryState and DataTable unchanged |
| Permissions and enforcement actions | Preserved | Guards, user-detail page and backend untouched |

Backend verified: identity-service AdminUserController uses GET `/api/v1/admin/users` with Pageable and class-level `hasRole('ADMIN')`; GET `/users/{id}` provides details. No DTOs, APIs, authorization, business states or mutation workflows changed. Visual tests use synthetic account fixtures, not live backend acceptance.

## Verification

- `npm run typecheck`: pass; production `npm run build`: pass.
- ESLint on six changed source/test files with `--max-warnings 0`: pass, no errors or warnings. Global lint: 0 errors, 21 warnings in untouched files. The repository ESLint config excludes e2e files.
- `npx vitest run src/features/admin src/layouts/__tests__/LayoutsAndNavigation.test.tsx --reporter=dot`: 7 files / 57 tests passed. Existing unrelated layout tests emit jsdom network errors to stderr.
- Playwright: 3/3 responsive browser tests passed. Inspected desktop and mobile screenshots in `.artifacts/admin-users-1440.png` and `.artifacts/admin-users-390.png`; mobile navigation screenshot `.artifacts/admin-menu-390.png`.
- Browser assertions collected no uncaught page errors. No live backend smoke test was performed.
- Full-suite snapshot during development: 59 files passed / 10 failed, 515 tests passed / 19 failed. Two failures from old Admin test selectors were subsequently corrected and the entire scoped Admin/layout suite rerun successfully. Remaining full-suite failures include landing, auth, notifications and merchant tests; see `.artifacts/admin-redesign-full-tests.log`. Repository-wide zero-error/zero-warning acceptance is not claimed.
- Scoped `git diff --check -- src/layouts src/features/admin`: pass.

## Limitations

No Stitch source was supplied: the user explicitly requested redesign of the screenshot using frontend-design, so the screenshot is a problem reference. Other Admin pages inherit the revised shared shell; their business content was not redesigned. Work observed concurrently in parking maps/global styles is outside this change. No migration cutover, deployment or live-data modifications.

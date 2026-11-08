# Merge origin/main into scr-53

- Last verified: 2026-11-08
- Source: origin/main at 775c66a98cea45248914ec70c9a141b4bf134bf5.
- Purpose: resolve the six PR conflicts without losing the merchant redesign.

## Resolution

- Kept the updated SCR-031 record at main's archived document path.
- Kept the current merchant detail tests and registration wizard, including actual-data behavior, validation, image handling and draft safeguards.
- Kept collapsed sidebar branding, sizing and header/content alignment; integrated ScrollToTop and the mobile Escape handler from main. Removed a duplicate Bell import introduced by auto-merge.
- Kept main's Workspace re-exports and separate Dialog/DataTable/Badge components. Ported the native Dialog cleanup fix into Dialog.tsx so close() runs before removing the open attribute.
- Updated the newly imported Batch14D test fixtures to local typed slots/lot data instead of production fallback exports removed by the branch. Removed its obsolete code field to restore compilation.
- Other main changes, including automatically merged API additions, are retained. No backend files changed.

## Verification

- Production build (tsc -b and Vite): passed.
- Focused tests: 9 files, 101 tests passed (merchant create/detail/edit/list/slots APIs and UI, admin moderation, shared primitives).
- Edge browser: 4 passed covering dashboard/profile collapse/expansion, mobile after desktop collapse, and admin modal Escape/reopen/approve/result behavior. API fixtures are mocked.
- ESLint: 0 errors, 15 warnings in imported ApiContractVerification, Popover and ScrollToTop code.
- Latest full suite: 492 tests, 465 passed, 27 failed. Failures span auth accessibility/bank/OTP, parking search, newly imported merchant Batch14D/14E integration expectations, payment cancellation and one registration test. The registration suite passed in the focused run. Old merchant batch expectations still refer to removed AI/demo UI; payment cancellation tests lack QueryClientProvider. These failures are retained and reported, not skipped or masked. Full-suite green status is not claimed.
- Initial full-suite run also reported a missing ResizeObserver test environment mock from the old merchant batch map test.
- No unresolved Git index entries or source conflict markers remain.

## Limits

The merge resolves Git conflicts and builds successfully. The full regression suite still requires follow-up; this is not a claim that every imported main feature or live backend workflow has been accepted.

# Fix: parking approval dialog crashes before confirmation

- Task ID: FIX-ADMIN-APPROVAL-DIALOG
- Status: Done for the reported frontend exception.
- Owner: Codex / maintainers
- last_verified: 2026-11-07

## Scope and evidence

VERIFIED: `Dialog` in `src/shared/components/Workspace.tsx` set the native
`open` attribute before calling `showModal()`. This opens a non-modal dialog,
so the modal call throws the `InvalidStateError` shown in the user screenshot.
The exception prevents the approval confirmation from being displayed.

## Files changed

- Modified `src/shared/components/Workspace.tsx`: call `showModal()` directly;
  use `open` only when that API is unavailable. During cleanup, call `close()`
  before falling back to removing `open`, preserving native modal cleanup and
  focus restoration during React StrictMode effect replay.
- Created `e2e/admin-parking-approval.spec.ts`: browser regression test.
- Created this report. No files deleted.

## Behavior and contracts

Preserved approval with optional reason, rejection/change-request validation,
API error feedback, retry, keyboard dismissal, focus restoration and existing
permissions. No API, dependency, authentication or routing changes.
Verified `PUT /api/v1/admin/parking-lots/{id}/approve` and ADMIN authorization
against `parking-lot-service/.../api/controller/AdminParkingLotController.java`.
The browser test uses a synthetic ADMIN token and mocked API responses.

## Verification

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | Passed |
| Lint | `npm run lint` | Passed, no lint warnings |
| Build | `npm run build` | Passed |
| Component tests | `npm test -- src/features/admin/__tests__/AdminParkingLotsModeration.test.tsx src/shared/components/__tests__/SharedComponents.test.tsx` | 22/22 passed |
| Full test suite | `npm test -- --reporter=dot` | 319 passed, 6 failed; all failures in `MerchantParkingLotDetailPage.test.tsx` |
| Browser | `npx playwright test e2e/admin-parking-approval.spec.ts` | 1/1 passed on Edge against Vite development server / React StrictMode |
| Diff | `git diff --check` | Passed |

Browser checks cover native `:modal` state, Escape and close-button dismissal,
focus returned to the approval trigger, reopening, empty approval reason,
server error feedback, retry, updated approved status and no page exceptions.
Playwright emitted an environment warning about FORCE_COLOR overriding NO_COLOR.
The initial sandbox browser launch and cross-sandbox connection failed; the
successful run used browser and Vite outside the sandbox.

## Limitations

Live backend persistence was not tested. The full suite reports network errors
and six failures on the merchant detail screen, which this task does not modify.
Module-specific documentation under `docs/05-modules/` is not populated; this
report records source and test evidence directly. Existing unrelated workspace
changes were preserved.

## Follow-up: show the decision result

User reported that successful confirmation closed silently. Added an optional
success callback to `DecisionDialog`; `AdminLotDetailPage` now shows a result
dialog after successful approval, rejection or change request. Approval displays
“Duyệt bãi thành công” with a “Đã hiểu” dismissal button. Existing query
invalidation refreshes the parking status. API failure keeps the confirmation
dialog and error feedback visible and does not show a success dialog.

Modified `src/features/admin/index.tsx`, its moderation component tests and the
browser regression test. Reverified typecheck, lint, build, 22/22 related
component tests and 1/1 Edge browser test with mocked API. Browser assertions
cover the success dialog's native modal state, dismissal, updated status and
absence of success feedback when the API fails. Live backend persistence remains
unverified. The full suite was not repeated; its earlier failures are listed above.

# SCR-53: merge main and resolve registration conflicts

- Verified: 2026-11-08 (Asia/Bangkok).
- Scope: merge `origin/main` at `131308d` into `scr-53` at `d59a08a`.
- Resolved files: registration page and its component tests. Preserve the SCR-53 registration design, empty initial form, validation, draft restoration, image handling and submission locking. Keep main updates to APIs, map picker, AI widget and merchant layout. Preserve customHighlights when loading/saving existing drafts without restoring the obsolete AI/SLA page layout.
- Additional fix: synchronize package-lock.json with html5-qrcode and qrcode.react already declared by main. No new dependency requirement or API/permission change was introduced by this resolution.
- No files deleted. Existing integration tests outside the conflicted files were preserved.

## Validation

- `npm run typecheck`: passed; `npm run build`: passed (includes TypeScript project build).
- `npm run lint`: exit 0, 0 errors, 21 warnings elsewhere in the merged repository.
- Focused Vitest run of CreateMerchantParkingLotPage.test.tsx and CreateParkingLotAiWidget.test.tsx with --maxWorkers=1: 14/14 passed.
- Full `npm run test -- --reporter=dot`: 499 passed, 19 failed across 11 files. Includes outdated merchant integration assertions for the earlier UI and timeouts in the parallel run; three registration timeouts passed in the focused rerun. Other failures cover landing, navigation, admin, auth, driver, scanner, notifications, search and slots. These are not claimed to be pre-existing without a separate baseline run.
- Registration Playwright suite: 3/3 passed using Edge outside the sandbox, covering desktop/mobile validation, keyboard, photos, coordinates, draft, submission and upload retry. Generated screenshots were restored to avoid unrelated binary changes.
- Conflict markers/unmerged entries: none. Whitespace check passes for the resolved page and lockfile; inherited whitespace findings in main documents and unrelated files were left unchanged.

## Environment limitations

Initial build failed because installed lucide-react typings were missing; the final build passed after dependency recovery. Full npm install encountered a locked Rollup native binary; package-lock-only synchronization succeeded. Initial E2E browser startup was blocked in the sandbox; the host run passed. Repository-wide lint/test gates are not fully clean as reported above. No production backend data was created by mocked E2E tests.

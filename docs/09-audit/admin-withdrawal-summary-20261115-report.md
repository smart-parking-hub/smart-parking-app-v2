# SCR-048 withdrawal confirmation report

- Owner: frontend maintainers
- last_verified: 2026-11-15
- Objective: make the confirmation easier to scan, with the full account number and receiving bank logo.
- Status: implementation, build and scoped verification passed on the isolated PR branch; prior full-suite evidence from the source checkout is recorded separately. Global lint has the unrelated existing warning listed below.

## Files and placement

- Created feature composition: `src/features/admin/components/WithdrawalSummary.tsx`.
- Modified `src/features/admin/index.tsx` to pass the verified `bankAccountNumber` and render the summary.
- Extended `Withdrawal` in `src/entities/operations.ts` with the optional string/null API field.
- Extracted the existing logo renderer into `src/entities/bank/components/BankLogo.tsx`, exported it through the entity index and reused it in `BankField`. Existing bank-field dimensions and fallback behavior are preserved.
- Added `WithdrawalSummary.test.tsx` and the browser test `e2e/admin-withdrawal-summary.spec.ts`; updated the existing settlement test to assert full-account mapping.
- Updated the module documentation, screen inventory and parity matrix. No files deleted.

## Behavior / contract

Changed per user request: larger full account number, bank logo/name, separately emphasized amount and readable beneficiary details. Leading zeros remain intact. A missing full account is explicitly labeled; the ledger remains masked.

Preserved: ADMIN route/server authorization, GET list and PUT approve/reject endpoints, reason validation, pending/error handling, query invalidation, close/cancel, Escape and focus restoration. Backend evidence: payment service `WithdrawalResponse.fromEntity` and `AdminFinanceController`. No new dependencies or backend changes. No real withdrawal decision or bank transfer was performed.

Logos use the existing VietQR directory/cache and approved provider URL restriction. Unknown banks, unavailable directory and broken images use a generic bank icon. No account details are included in provider requests.

## Verification

| Check | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run build` | Passed on retry; initial concurrent run ran out of Node memory |
| Scoped ESLint | Passed, no warnings |
| `npm run lint` | Zero errors; existing `RegisterPage.tsx:198` hook dependency warning |
| Three scoped component/integration files | 19 tests passed |
| Existing BankField suite | 11 tests passed, including actual merchant registration form integration |
| `npx playwright test e2e/admin-withdrawal-summary.spec.ts` | 2 passed at 390px and 1440px; real provider logo loaded, full account, amount, holder, overflow, Escape/focus restoration, rejection validation/payload verified |
| `npx vitest run --maxWorkers=2 --reporter=dot` | 84 files / 714 tests passed in 100.09s; log: `.artifacts/admin-withdrawal-summary-vitest-final.log`. Initial concurrent attempt ran out of memory; sandbox retry was interrupted after failing to progress; final run completed outside sandbox |
| Scoped `git diff --check` | Passed |

Screenshots inspected: `.artifacts/admin-withdrawal-summary-390.png` and `.artifacts/admin-withdrawal-summary-1440.png` (synthetic beneficiary/account data). Browser APIs use fixtures; live backend/payout acceptance was not exercised. Final browser run: 2 passed in 11.3s with zero browser console errors/warnings. Node test-runner color-environment notices are separate from browser runtime console. Whole-suite tests pass while existing payment-cancel/layout mocks emit 401/403 diagnostics; this is not a claim of globally silent test output.

No new Stitch HTML was supplied; the user explicitly requested a presentation change to the attached existing dialog. Scope remained within SCR-048 and reusable bank-logo extraction.

## Isolated PR branch verification

The publishing branch `fix/admin-withdrawal-summary` starts at `origin/main` (`f457774`) and excludes the booking commit in PR #81 and unfinished Merchant withdrawal-form changes. It includes the bank entity extraction and auth adapters required to reuse the existing directory/logo without a feature-to-feature dependency.

On this isolated branch: production build passed; scoped ESLint reported no warnings/errors; 30 tests across four affected component/integration files passed; both Playwright cases passed at 390px and 1440px in 12.1s, with no browser console errors/warnings. The earlier 714-test full-suite run above belongs to the source checkout, which contained other in-progress work; it is not a separate full-suite run on this publishing branch. Original checkout edits were retained.
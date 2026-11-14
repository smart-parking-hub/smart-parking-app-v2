# Completion Report

- Task ID: withdrawal-form-20261115
- Summary: format withdrawal amounts and make default/other receiving-account choices explicit.
- Status: requested implementation complete; whole-project gates have unrelated failures.

## Files changed

- Modified: `src/features/merchant/operations/FinancePages.tsx`, `src/features/merchant/operations/operations.test.tsx`, `src/features/merchant/__tests__/Batch14EMerchantGateFinanceIntegration.test.tsx`.
- Created: `e2e/merchant-withdrawals.spec.ts`, `docs/05-modules/merchant/withdrawal-form.md`, this report.
- Deleted: none.

## Behavior

- Preserved: withdrawal limits, balance shortcuts, POST fields, numeric payload, account leading zeros, pending guard, server errors, approval explanation, cache invalidation and dialog close on success.
- Changed per user request: grouped amount input, explicit default-account review and another-account entry; absent profile falls back to manual entry. Custom drafts survive switching accounts. No profile mutation.
- Placement: all implementation remains in the merchant withdrawal dialog; no shared component, formatter dependency, route, authentication or API-contract change.

## Verification

| Check | Command / environment | Result |
|---|---|---|
| Typecheck script | `npm run typecheck` | Passed, but root command does not fully check referenced app project; build is authoritative |
| Related component/integration tests | `npm run test -- src/features/merchant/operations/operations.test.tsx src/features/merchant/__tests__/Batch14EMerchantGateFinanceIntegration.test.tsx` | 27 passed |
| Full suite | `npm run test` | 77 files passed, 6 failed; 698 tests passed, 8 failed outside withdrawal suites |
| Global lint | `npm run lint` | 0 errors, 1 hook dependency warning at RegisterPage.tsx:198 |
| Scoped lint | `npx eslint src/features/merchant/operations/FinancePages.tsx src/features/merchant/operations/operations.test.tsx src/features/merchant/__tests__/Batch14EMerchantGateFinanceIntegration.test.tsx` | Passed |
| Browser | `npm run test:e2e -- e2e/merchant-withdrawals.spec.ts` | 2 passed; 390/1440px, mocked API fixtures, no runtime console errors/warnings |
| Production build | `npm run build` | Failed outside edited files: MyBookingsPage.test.tsx:82 TS2339, `page` does not exist on `{}` |
| Diff review | `git diff --check --` scoped to task files | Passed |

Browser tests require localhost access outside the default sandbox. The initial sandbox attempt was stopped after localhost access was denied, then the authorized elevated run passed.

## Visual and accessibility evidence

Reviewed screenshots at `.artifacts/merchant-withdrawals-390.png` and `.artifacts/merchant-withdrawals-1440.png`. Native fieldset/legend/radios, labeled inputs, numeric mobile keyboard and invalid-field flags are used. The existing shared dialog retains its keyboard behavior. No horizontal overflow inside the dialog at tested sizes. Live payout and real backend integration are not verified by mocked browser checks.

## Known limitations

The working checkout contains concurrent changes outside this task. Whole-project test/build/lint failures are reported without changing those features. Account persistence is limited to the existing profile account; the other account applies to one request only.

## Follow-up: reuse registration bank list

User request: replace the withdrawal bank text box with the same API-backed bank search used in account registration.

- Moved the existing VietQR API and picker into `src/entities/bank` with a public entry point. The auth component is a typed compatibility wrapper; the auth API re-exports the same implementation. Existing shared BankLogo changes in this checkout are retained.
- Withdrawal uses the shared picker with label “Ngân hàng nhận”. Zod checks the selected canonical name against the cached provider list because resolver-backed forms do not use RHF field validation rules. Default account details remain usable independently of VietQR.
- No new dependency, provider URL, payment endpoint, DTO field, profile write or permission change.
- `npm run build`: passed, including app TypeScript compilation. An earlier sandbox TypeScript process exhausted memory; the completed build supersedes that attempt.
- Scoped ESLint: passed. Global ESLint: 0 errors, 1 existing RegisterPage hook warning.
- BankField + operations + Batch14E run: 37 passed, 1 unrelated booking-detail heading mismatch. Focused bank/withdrawal run: 18 passed, 20 skipped.
- Browser runs use `.artifacts/withdrawal-bank.playwright.config.ts` on dedicated port 5186 because the server on 5174 served an older checkout. Initial browser attempts against that server do not verify the current implementation.
- Both isolated browser cases passed at 390px and 1440px: Vietnamese search without accents, keyboard selection, unknown-bank rejection, bank cache reuse across account switching, numeric amount and canonical bank name in the withdrawal payload. Screenshots reviewed at `.artifacts/merchant-withdrawal-bank-options-390.png`, `.artifacts/merchant-withdrawal-bank-options-1440.png` and `.artifacts/merchant-withdrawals-390.png`. No runtime console errors or warnings in the assertions.
- The initial isolated test's absolute request-count assertion was corrected to compare counts before/after account switching, accounting for React StrictMode aborting its first fetch; the final browser cases passed.
- The final runner printed `ok` for both cases, then stalled during teardown. It was interrupted after those results; there is no clean final runner exit to claim. Build and lint commands exited normally.

## Branch verification before push

The requested branch is fix/admin-withdrawal-summary. Reused its clean existing checkout and retained its existing admin summary commit. Only the seven withdrawal/auth-documentation files were transferred; booking and checkout changes were excluded. Main was already up to date. The exact target checkout passed all 38 tests in the BankField, operations and Batch14E suites, plus scoped ESLint.
Production build on the target checkout also passed, including TypeScript compilation.

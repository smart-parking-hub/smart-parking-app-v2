# Completion Report — SP-S3-PAY-03

- Owner: SPH
- last_verified: 2026-11-14
- Summary: extended the existing merchant revenue report with correct grouping and measure labels, and a paginated read-only wallet activity ledger backed by the existing payment data.
- Status: implementation prepared on origin/main fe5fa48 in an isolated worktree; human acceptance/sign-off and live PayOS verification pending. See the final PR review below for current evidence.

## Files changed

Created in frontend:

- `src/features/merchant/operations/MerchantRevenuePage.tsx`
- `src/features/merchant/operations/merchantFinanceApi.ts`
- `src/features/merchant/operations/merchantFinance.test.tsx`
- `src/features/merchant/components/MerchantRevenueChart.tsx`
- `src/features/merchant/components/MerchantWalletLedger.tsx`
- `e2e/merchant-revenue.spec.ts`
- `docs/05-modules/merchant/revenue-wallet-ledger.md`
- This report.

Modified in frontend:

- `FinancePages.tsx`: re-export extracted revenue page; withdrawal code preserved.
- `PayOsPaymentPanel.test.tsx`: cover the 4,000 VND deposit and server rejection of a stale checkout; reset the request mock and accept currency nonbreaking spaces.
- `Batch14EMerchantGateFinanceIntegration.test.tsx`: supply the independent ledger response and assert corrected KPI label/accessibility table.

Created in backend:

- `payment-service/src/main/java/com/smartparking/payment/api/controller/MerchantLedgerController.java`
- `payment-service/src/main/java/com/smartparking/payment/application/service/MerchantLedgerQueryService.java`
- `payment-service/src/main/java/com/smartparking/payment/application/dto/MerchantLedgerEntryResponse.java`
- `payment-service/src/test/java/com/smartparking/payment/api/MerchantLedgerControllerTest.java`
- `payment-service/src/test/java/com/smartparking/payment/MerchantLedgerRepositoryTest.java`
- `docs/api-contracts/merchant-revenue-ledger.md`
- `docs/api-contracts/payos-checkout-amount-validation.md`
- `payment-service/src/test/java/com/smartparking/payment/application/service/PaymentAmountConsistencyTest.java`

Modified in backend: `PaymentServiceImpl.java` validates cached/new PayOS amounts, order IDs and cached merchant/lot; `ParkingChargeTest.java` covers 20,000 × 20% = 4,000.

Deleted: none. Existing backend working-tree changes were left intact.

## Behavior / permissions / assumptions

See the [module note](../05-modules/merchant/revenue-wallet-ledger.md) for the parity matrix, card conflicts, source-verified data semantics and intentionally excluded scope. API is additive and MERCHANT-only, uses authenticated identity instead of a client merchant ID, caps page size at 100, and reads only the payment service's existing table. No schema, migration, dependency, gateway/auth or accounting mutation changes.

The API lives under the existing `/merchant/revenue/**` gateway route, so it requires no gateway configuration changes. Revenue's DAY response is grouped in the frontend; cumulative amounts keep existing backend contracts and have explicit explanatory labels.

## Verification

| Check | Command / environment | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | Pass |
| Lint | `npm run lint` | Pass, zero errors/warnings |
| Component regression | `npm run test -- --reporter=dot --maxWorkers=2 --testTimeout=15000` | 82 files, 688 tests passed on the PR base with two workers and a 15-second per-test timeout |
| Production build | `npm run build` | Pass |
| E2E / responsive / keyboard | `npx playwright test e2e/merchant-revenue.spec.ts e2e/payos-embedded-checkout.spec.ts` | 6 passed (2 revenue, 4 PayOS deposit/final), Chrome at 390px and 1440px; reversed dates blocked without request, month aggregation, keyboard expansion of numeric table, ledger paging, GET-only access, no horizontal document overflow; revenue scenarios assert zero browser console errors/warnings and page errors; PayOS scenarios require server confirmation |
| New backend tests | `gradlew.bat :payment-service:test --tests com.smartparking.payment.api.MerchantLedgerControllerTest --tests com.smartparking.payment.MerchantLedgerRepositoryTest --console=plain` | 5 passed; real MVC/security/query service with mock persistence, plus H2 repository isolation/paging/order test |
| Backend regression | `gradlew.bat test --console=plain` with Java 21 | BUILD SUCCESSFUL on backend main 8c2ced3; 55 tasks, 41 up-to-date. XML reports: 603 tests total, 597 passed, 6 skipped; payment: 143 total, 141 passed, 2 skipped. MySQL migration tests used the existing local credential via environment only |
| Diff review | Task-scoped diff and `git diff --check` | No whitespace errors; no unrelated edits introduced by this task |

Full frontend tests emit pre-existing jsdom network errors in layout/notification tests while all assertions pass; this is not a claim of zero stderr for the whole suite. Gradle emits a JVM class-sharing notice; Playwright's runner emits a NO_COLOR/FORCE_COLOR environment warning. The changed revenue screen has zero captured browser errors/warnings in its two E2E runs. The PayOS harness emits a Vite proxy refusal for its unrelated disputes request; all six E2E assertions pass.

Initial frontend tests found ambiguous text selectors after adding the accessible chart table; selectors were adjusted to account for chart/table duplication. The first backend MVC run failed because application JPA auditing was pulled into the MVC slice; a test-only mapping-context mock resolved it. The final runs passed. Sandbox restrictions required running Gradle cache access and localhost browser tests with elevated tool approval; no production action was performed.

## Visual / accessibility evidence

- [Mobile screenshot, synthetic test data](evidence/pay03/merchant-revenue-390.png)
- [Desktop screenshot, synthetic test data](evidence/pay03/merchant-revenue-1440.png)
- `.artifacts/pay03-vitest.log`
- Sibling backend: `build/pay03-gradle-test.log`, `payment-service/build/reports/tests/test/index.html`.
- Both screenshots were visually inspected. Existing layout/design tokens were retained; mobile table content scrolls horizontally inside its container. No Stitch reference was supplied; this extends the existing screen rather than a visual redesign.

## Rollback and pending work

Revert only the files/sections listed above; there is no database rollback. Deploy the backend before the frontend to make the ledger endpoint available. Revenue remains usable if the independent ledger request fails.

No VPS/MySQL end-to-end check or production deployment was performed. Browser tests use network fixtures, MVC uses the real security chain with mocked repository, and repository behavior is checked against H2. Human sign-off and PR approval are pending. Historical accounting reconciliation and other screens' existing finance semantics are outside this task.


## PR self-review — 2026-11-14

Scope: only this task's frontend/API files and the requested PayOS amount follow-up. Feature branches originate from the latest main fetched for review; no unrelated admin transaction, notification, layout or deployment changes are included. The original dirty checkouts are preserved.

Findings addressed:

1. Currency formatting uses a nonbreaking space; the new 4,000 VND payment selector now accepts whitespace correctly. Reset only the HTTP post mock between tests to clear queued failures while retaining the SDK stub.
2. An initial whole-file transfer would have reverted a demo-confirmation fix already merged into backend main. That unrelated hunk was removed from the PR; existing demo behavior is preserved.
3. Cached PayOS links now require a fresh authoritative amount and matching merchant/lot, plus verified provider amount/order/status. New provider responses require the correct amount/order and a nonblank URL. No client amount overrides, new fallback charge, automatic cancellation or historical-row repair.
4. Wallet history is merchant-scoped at the server; scalar DTO fields avoid exposing Payment/bank details. Offset pagination has a fixed page size in the UI and server size bounds; timestamp ties sort by ID.
5. The revenue report distinguishes cumulative measures, the displayed period and signed wallet activity. The activity table is not claimed to reconstruct the full accounting journal or opening balance.

Regression investigation: the first unconstrained full frontend run had two landing assertion failures and two unrelated test timeouts under concurrent build/Java load. Landing tests passed on the branch when rerun separately and all nine passed on an exported, untouched main. The final constrained full suite passed all 688 tests; no landing/notification/dispute source or tests were changed in this PR to achieve that result. Global lint/typecheck/build passed. Existing jsdom network stderr is recorded rather than treated as an assertion failure.

No unresolved blocking finding was identified in the reviewed changes. This is an agent self-review, not a human approval. Browser tests mock API/PayOS; no real transfer or production deploy was performed. The previously reported local checkout discrepancy remains unverified for its exact historical booking/link, because the services and transaction were not available.

Final backend gate: the first fresh-worktree full run failed two Identity MySQL migration tests because the ignored local credential was absent. A rerun used the existing local .env credential via process environment at localhost:3306 and passed the full repository gate, including those migration tests. No credential file or value is included in the PR.

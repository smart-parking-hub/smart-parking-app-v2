# Withdrawal amount and receiving account

- Owner: frontend maintainers
- last_verified: 2026-11-15
- Route: `/merchant/withdrawals`
- Evidence: `src/features/merchant/operations/FinancePages.tsx`, operations component tests, Batch14E integration test, `e2e/merchant-withdrawals.spec.ts`.

## Behavior and parity

| Capability | Result |
|---|---|
| Amount entry | Changed as requested: Vietnamese thousands separators while typing (`1.000.000`); pasted comma/dot grouping is normalized; empty/unsafe values cannot submit |
| Minimum / entire balance shortcuts | Preserved; both update the formatted input |
| Minimum and maximum validation | Preserved with RHF + Zod; integer VND input |
| Saved profile bank details | Explicit default-account radio option with bank, full account number and holder shown for review |
| Another receiving account | Explicit radio option reveals the VietQR bank picker plus account number and holder inputs; switching away and back preserves the draft |
| Bank list | Reuses registration's API, cache, search, logo, loading and retry behavior through `entities/bank`; requires a bank returned by the provider |
| Missing/incomplete profile account | Default option disabled; manual account entry available with explanation |
| Profile fetch failure/loading | Loading feedback and submit guard while awaiting default; manual entry available without profile; failure explained |
| Request submission, approval, wallet refresh | Preserved; POST uses numeric amount and string account number including leading zeros |

The default is the existing account returned by `GET /api/v1/merchant/profile`: `bankName`, `bankAccountNum`, and `fullName`, matching the previous prefill mapping. Another account is used only for this withdrawal request and is not saved to the profile. No new account-storage endpoint is invented.

The bank picker uses the existing public `GET https://api.vietqr.io/v2/banks` request without app authorization or account data, caches the list for 24 hours, and supports Vietnamese accent-insensitive search by full name, short name, code and BIN. A failed request offers retry rather than fabricated options. The request still sends the canonical `shortName` as `bankName`. The saved default account can be submitted without waiting for this list.

`POST /api/v1/withdrawals` still sends only `amount`, `bankName`, `bankAccountNumber`, and `accountHolderName`. Backend evidence is `payment-service/.../CreateWithdrawalRequestDto.java` and `WithdrawalServiceImpl.java` in the sibling microservice repository. Existing MERCHANT routing and server authorization remain unchanged.

## Verification

- Related component/integration suites: 27 passed.
- Playwright with mocked APIs: 2 passed at 390px and 1440px; numeric payload, default/custom accounts, leading zeros, empty/excessive amount, missing profile and dialog overflow verified. No browser error/warning captured.
- Changed React/TypeScript files: ESLint clean; scoped diff whitespace check clean.
- Screenshots: `.artifacts/merchant-withdrawals-390.png`, `.artifacts/merchant-withdrawals-1440.png`.
- Whole-project suite: 698 passed, 8 failed across 6 unrelated files; see task report.
- Follow-up bank-picker change: production build passed. Scoped ESLint clean; global ESLint reports one existing hook dependency warning in `RegisterPage.tsx:198`. Bank and withdrawal focused checks passed (18 tests); an earlier broad run had 37 passed and one unrelated booking-detail heading mismatch.
- Follow-up browser checks: both 390px and 1440px cases passed on isolated port 5186, including accent-insensitive bank search, keyboard selection, rejection of unknown names, canonical `bankName` payload and cache reuse when switching receiving accounts. Reviewed `.artifacts/merchant-withdrawal-bank-options-390.png` and `-1440.png`, plus the selected-bank mobile screenshot. Provider data is mocked for these deterministic checks.
- Live bank payout/backend mutation was not exercised; browser verification uses network fixtures.

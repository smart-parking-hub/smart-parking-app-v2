# Withdrawal confirmation

- Owner: frontend maintainers
- last_verified: 2026-11-15
- Route: `/admin/withdrawals`, approval and rejection dialogs (SCR-048)

The confirmation summary groups the amount, receiving bank/logo, full account number, account holder and merchant. The account remains a string so leading zeroes are preserved. `bankAccountNumber` is verified in the payment service `WithdrawalResponse.fromEntity` and `AdminFinanceController.getWithdrawals`; this change does not introduce an endpoint or change authorization.

Only the confirmation dialog displays the full account. The ledger continues using `maskedBankAccount`. If a response lacks the full account, show the masked value and explicitly state that the full number is unavailable.

The existing public VietQR bank query/cache supplies logos. Matching uses the saved bank name, short name, code or BIN, with support for a short name/code followed by a branch name. Unknown banks, directory errors and broken images retain the bank text and a generic bank icon. No account information is sent to VietQR. `BankLogo` lives under `entities/bank` and is reused by the existing bank field; the summary composition stays in `features/admin/components`.

| Existing capability | Result |
|---|---|
| Amount, bank, account holder, merchant, warning | Preserved with clearer hierarchy |
| Masked account in confirmation | Full API account displayed per user request; explicit fallback if missing |
| Approval/rejection endpoints and reason validation | Preserved |
| Pending/failed mutation handling and cache invalidation | Preserved |
| Cancel, Escape, focus restoration and responsive dialog | Shared Dialog retained |

Verification and limits: [task report](../../09-audit/admin-withdrawal-summary-20261115-report.md).

# Merchant revenue and wallet ledger

- Task: SP-S3-PAY-03
- Owner: SPH
- last_verified: 2026-11-14
- Route: `/merchant/revenue` (existing MERCHANT route guard).
- Status: VERIFIED locally with component tests and mocked-network browser tests; pending human acceptance and deployed API verification.

## Scope fitted to the repository

The card labels this as BE and names `smart-parking-microservice`, but points at frontend paths. The actual repositories are `smart-parking-app-v2` and `smart-parking-service-microservice`. The implemented scope extends the existing revenue screen and adds one read-only payment endpoint for the existing wallet activity table. Generic requirements about new microservices, Flyway migrations and blanket Gradle-only verification do not apply. No new screen, chart library, accounting mutation, export flow or production deployment was added.

## Behavior and parity

| Capability | Result |
|---|---|
| Existing route, four KPIs and withdrawal navigation | Preserved |
| Start/end dates, date-order validation | Preserved; RHF + Zod, associated accessible error |
| DAY/MONTH/YEAR selector | Corrected: DAY from backend, aggregate real returned daily points locally |
| Chart, period totals | Actual response values only; zero-day bars have zero height; all-zero/empty series show an empty state |
| Keyboard and numeric chart access | Scroll region is focusable; native expandable data table |
| Cumulative KPI interpretation | Explicitly outside the date filter; `totalNetRevenue` relabeled “Biến động ví tích lũy” because it includes withdrawals/refunds/adjustments |
| Booking count interpretation | No longer asserts completed bookings; grouped counts sum daily counts and may repeat the same booking across days |
| Wallet activity | New paginated table, signed amounts, type/booking/time/gross/fee/note, manual refresh |
| Loading/error/retry | Revenue and ledger query independently through the shared QueryState component |
| Withdrawal behavior | Preserved in FinancePages; no changes to withdrawal mutation/validation |

## Contracts and ownership

- `getMerchantRevenue` uses the existing centralized client for `GET /api/v1/merchant/revenue`, sending dates only when present and `granularity=DAY`.
- Revenue query key includes both date inputs. Grouping is a local display setting; no new request is needed for grouping alone.
- `getMerchantLedger` calls `GET /api/v1/merchant/revenue/ledger?page=N&size=20`; ledger query key includes zero-based page. It uses the existing Page envelope (`content`, `currentPage`, `totalPages`, `totalElements`).
- Ledger is independent of the revenue date filter, explicitly explained in the UI. It maps the four existing backend entry types, keeps future unknown type labels visible, and displays nullable booking/note as a dash.
- Existing centralized auth/JWT handling is preserved. Backend filters by authenticated merchant and enforces MERCHANT; frontend guards alone are not authorization.
- Detailed backend contract: sibling `smart-parking-service-microservice/docs/api-contracts/merchant-revenue-ledger.md`.

## Data limitations

The daily chart is computed by the current payment service from SUCCESS payments using its current fee calculation, not historical double-entry settlement postings. It must not be treated as bank receipts, settled wallet credits or audited accounting revenue. The cumulative gross, fees, signed ledger sum and wallet balance are separate measures; a date filter does not reconcile them.

The displayed wallet activity uses `wallet_ledger_entries`, not the full accounting journal. Opening balances or direct journal reversals may not be represented in that activity table. No client-side running balance is invented from a partial page.

The original backend revenue API's default dates, single-bound handling and daily granularity remain unchanged for other consumers. No changes are made to the merchant dashboard or withdrawal screen's existing labels/calculations in this task.

## Verification

See [task report](../../09-audit/sp-s3-pay-03-report.md) for exact commands, results, artifacts and pending sign-off.

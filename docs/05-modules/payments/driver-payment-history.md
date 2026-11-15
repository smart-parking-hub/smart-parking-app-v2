# Driver payment history

Owner: payments feature. `last_verified`: 2026-11-15. Route: `/payments`, existing DRIVER guard.

The user requested a visual refresh of the current API-backed payment-history screen. The screenshot is the before state, not a new Stitch design. Existing navy/orange tokens, Workspace, Badge, Dialog and payment formatters are reused; no dependency, backend, route or financial rule changes.

## Verified data contract

`paymentDataApi.ts` parses `GET /api/v1/payments?page=0&size=20&sort=id,desc` with Zod. Backend evidence: `PaymentController.getMyPayments` requires DRIVER and uses the authenticated user's ID; `PaymentDto` supplies transaction/booking/lot/order IDs, gateway, amount, type, status and creation time. No VAT, bank details, vehicle data, monthly totals or export functionality is invented.

Total transaction count uses `totalElements`. Successful non-refund amount, pending count and reconciliation count use only loaded rows and stay explicitly labelled as current-page figures. Search and all five status options remain current-page filters. Page navigation resets search/status/selection; refresh stays on the current page.

## Presentation and placement

| Component | Responsibility | Placement |
| --- | --- | --- |
| DriverPaymentsPage | Query/filter/pagination state and composition | Feature page |
| DriverPaymentSummary | Four compact metric cards; successful amount highlighted | Feature component |
| DriverPaymentList / DriverPaymentStatus | Single semantic table, stacked cards below 1024px, shared colored Badge | Feature components |
| DriverPaymentDetails | Shared Dialog with original IDs/amount/status and available time/type/channel | Feature component |

Long codes visually truncate in rows, retain full text/title/accessibility name, and are fully readable in details. Amounts align right with tabular numbers. Detail moved from below the table into an immediate modal, with native Escape/focus restoration and a link to the booking list. Original reconciliation guidance remains visible.

## Capability parity

| Existing capability | Result |
| --- | --- |
| Four metrics and calculation scope | Preserved |
| Transaction/booking IDs, time, type, gateway, amount and five statuses | Preserved; type/channel grouped and statuses colored |
| Search, status filter, server pages and manual refresh | Preserved |
| Selected transaction fields, reconciliation notice and close | Preserved in Dialog |
| Booking navigation | Preserved; detail adds a link to the booking list |
| Loading / empty / filtered empty / errors / retry / disabled controls | Preserved and styled; filtered-empty reset added |
| API, auth, payment state changes, monetary calculations | Unchanged |

Tests: `DriverPaymentsPage.test.tsx` (12), driver integration suite (5), `e2e/driver-payment-history.spec.ts` (4 scenarios including a narrow-phone boundary). Full validation and known unrelated lint warning are documented in `docs/09-audit/payment-history-redesign-2026-11-15.md`.

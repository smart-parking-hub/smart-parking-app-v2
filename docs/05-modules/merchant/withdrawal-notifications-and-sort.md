# Withdrawal notifications and ordering

- Owner: frontend maintainers; last_verified: 2026-11-13.
- Routes: `/admin/withdrawals`, `/admin/notifications`, `/merchant/notifications`.

Admin withdrawal requests default to newest first, with oldest first and amount ascending/descending options. The request date is visible. Sort is sent to `/api/v1/admin/withdrawals` and applies across all pages on the server.

Admin/Merchant notification pages expose newest/oldest ordering using `sort=createdAt,desc|asc`. Changing order resets to the first page and changes the query key; read mutations invalidate all relevant sort variants. Merchant notifications also have a Cập nhật button. Permissions, approve/reject dialogs, read ownership and zero-based pagination remain intact.

Backend now creates an Admin notification for new withdrawals and an IN_APP result notification for the Merchant owner after a successful approval/rejection. Approval text confirms administrative approval, without claiming bank payout completion. These are backend-generated records, not frontend optimistic notifications. Older decisions are not fabricated or backfilled.

Merchant sidebar and header bell show a red dot only when the existing unread-count API returns a positive integer. The shared query polls every 30 seconds while visible and refreshes on focus when stale. Marking notifications read invalidates the indicator immediately. An opaque session revision isolates cached counts across login changes without putting credentials into query keys. The dot has an accessible unread label and also works with the collapsed sidebar. Indicator, layout and operations suites: 42 passed; lint passed. Existing layout tests also emit unrelated mocked-environment network diagnostics.

Verification: complete frontend suite 676 passed; final sorting suite 4 passed; production build/TypeScript passed; lint zero errors/warnings. Real MySQL/Kafka lab flow and browser checks passed for request/approve/reject, private Merchant messages and ordering. Active local gateway/browser showed the restored request notification for WD-28. Desktop screenshots are in `D:/DuAnOjt/audit-reports/withdrawal-notifications-20261113`. Existing Merchant layout constraints on mobile remain outside this change.

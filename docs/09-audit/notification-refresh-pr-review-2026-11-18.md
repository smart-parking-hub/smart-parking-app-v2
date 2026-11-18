# Notification refresh PR review

Owner: SPH. Last verified: 2026-11-18.

Port only the notification changes from local save commit `66eaf27` onto
`origin/main` (`3f3532b`). Registration already exists on main with later fixes;
no authentication, booking, shared dialog, or parking-detail code is included.

Driver and Merchant lists poll every 15 seconds while visible. Focus refresh
respects TanStack Query's stale policy. Admin read mutations await both inbox
and header indicator invalidation. API ownership, sorting, pagination, error
handling and session cache isolation remain unchanged.

Executed checks: typecheck, lint (no diagnostics), production build, 40 targeted
unit/component tests, and 13 Chromium admin-notification E2E tests all passed.
Browser checks cover mobile/desktop, read actions, errors, account changes,
role guards, and Merchant compatibility. Fixtures mock APIs; this run does not
verify SMTP, Kafka, production delivery, or historical notification backfill.

Rollback: revert this PR's commit. The FE continues to use the same notification
API and does not depend on the backend PR for API compatibility.

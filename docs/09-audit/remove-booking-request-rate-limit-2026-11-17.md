# Removed booking request-rate blocking

- Owner: SPH booking/frontend. Last verified: 2026-11-17.
- Status: implemented, verified, and activated in the existing local booking Docker service.
- Authorization: user requested removing the “thao tác quá nhanh” restriction after the UI displayed 42382 seconds of waiting.
- Plan: `D:/DuAnOjt/plans/remove-booking-request-rate-limit-2026-11-17.md`.

## Changes

- BookingServiceImpl no longer injects or invokes HoldRateLimiter. Historical rate rows and the unused evaluator remain; the booking API does not consult or increment them.
- A legacy RATE_LIMIT error cannot lock the frontend or display a spam countdown. The UI reports “Chưa tạo được booking. Vui lòng thử lại.” and allows an immediate explicit retry, preserving form values and requestId.
- Pending-submit protection, ownership, schedule/capacity checks, transactional locks, idempotency, other hold restrictions and payment behavior are preserved. No automatic retry or fake success.
- Modified backend service/constructor fixtures, UnpaidHoldPolicyIntegrationTest and API contract; frontend notice/tests, rate-limit E2E and booking module docs. Added the workspace plan, this report and the local Compose image overlay. Existing unrelated workspace edits were preserved. No source files were deleted and no dependency/schema changed.

## Verification

| Check | Result |
| --- | --- |
| Backend regression | Failed before fix; passed after: twelve attempts with a future exhausted rate window reach normal capacity checks, followed by successful create/replay; stored rate row unchanged |
| Full booking-service tests | `gradlew.bat :booking-service:test --offline --console=plain`: 227 passed, 6 skipped, 0 failures (233 total) |
| Frontend relevant tests | Notice, ReservationFlow, InlineQuickBookPanel: 38 passed |
| Build and TypeScript | `npm run build`: passed |
| Lint | `npm run lint`: passed |
| Browser | Rate-error immediate retry and quick-hold scenarios: 5 passed at 390/650/1440px; preserved payload and no JS page errors |
| Local runtime | Booking health UP, active artifact hash matches, all unrelated container IDs unchanged |

The six backend skips are environment gated; integration verification used H2 in MySQL mode. Browser tests use mocked APIs. No real booking or payment was created for runtime verification.

## Local activation and rollback

The original runtime BookingServiceImpl class matched the pre-change local compilation exactly. To preserve all existing image migrations/libraries and avoid deploying unrelated source changes, the new local image replaces only this tested class inside a copy of the current JAR. Every other uncompressed ZIP entry was compared byte-for-byte and compression methods were retained. The original JAR is saved in `D:/DuAnOjt/output/remove-booking-rate-limit/booking-before.jar`.

The original configured booking environment was compared without printing secrets and was unchanged. Only booking-service was recreated using the current Compose project/files plus `compose.no-request-rate.local.yaml`. The active image is `smart-parking/booking-service:no-request-rate-local-20261117`; include that overlay in future local Compose recreations. The original schedule image remains available for rollback. No production service or database content was changed by this task.

Rollback: restore only this task's source hunks and recreate only booking-service with the prior local Compose image configuration. No database rollback or rate-row deletion is needed.

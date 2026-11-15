# Completion report — unpaid hold protection

- Task ID: unpaid-hold-policy-20261115
- Owner: booking-flow / Booking / Payment. Last verified: 2026-11-15.
- Summary: prevent repeated free holds and show clear, server-owned recovery guidance.
- Status: Done for the approved account/vehicle/lot policy; activated locally.

## Files changed

- Created frontend: `BookingHoldRestrictionNotice.tsx`, its component tests, `e2e/unpaid-hold-policy.spec.ts`, module documentation and this report.
- Modified frontend: `ReservationFlow.tsx` and its tests. Its pre-existing compact payment summary work is retained.
- Created backend: Booking V9/config, quota/rate/store/transaction/verifier/read-query/recheck components, internal hold controller and policy/regression/integration/migration/contract tests. Payment assessment service/internal controller and tests.
- Modified backend: Booking create/cancel/expiry integration, repository locked replay, public error mapping, configuration and existing affected tests; Payment internal booking client; data ownership and API contract. The existing PayOS recovery changes remain intact.
- Deleted: none. Unrelated shared-workspace changes were preserved.

## Behavior

- Approved: one pending-payment hold per vehicle, three per account, two confirmed unpaid releases within 60 minutes at the same lot trigger a fixed 30-minute cooldown; technical rate default ten new attempts per 60 seconds.
- Preserved: price/deposit/refund rules, 15-minute payment deadline, expiry grace, booking/payment idempotency, check-in/out and existing pending tickets. No capacity RPC occurs after a rejected gate.
- Safe evidence: closing PayOS alone is not a strike. Failed create, paid/review/refunded/partial and unknown payment results are not abuse findings. Unknown evidence can temporarily defer new creation; late money revokes unpaid classification.
- UI: clear server message, existing-ticket/list links, Vietnam retry time, countdown/disabled submission, retained form values and manual retry after deadline. No auto-post or payment opening on rejection.

## API / permissions

Verified against `smart-parking-service-microservice/docs/api-contracts/unpaid-hold-policy.md`: POST bookings request unchanged; typed 409/429/503 error data. Both new internal APIs require the shared service token, not user-role headers. Booking owns policy tables; Payment owns financial evidence. No cross-service SQL or financial ledger changes.

## Verification

| Check | Command / environment | Result |
| --- | --- | --- |
| TypeScript + production build | `npm run build` | PASS |
| Scoped lint | ESLint changed booking-flow source/component tests | PASS, zero errors/warnings |
| Frontend unit/component | `npm run test -- src/features/booking-flow/__tests__` | 96 passed |
| Browser | Playwright `unpaid-hold-policy.spec.ts`, isolated Vite/Chrome, 390px/1440px | 4 passed |
| Backend full affected modules | Gradle `:booking-service:test :payment-service:test :booking-service:bootJar :payment-service:bootJar` | 280 passed, 6 conditional skips out of 286 cases |
| MySQL real concurrency/migration | Isolated MySQL 8.4, `UnpaidHoldPolicyIntegrationTest`, `UnpaidHoldMigrationTest` | 10 passed |
| Live-database copy validation | Private copies, exact packaged migration resources | Booking V7→V9 / Payment V18; original data/history unchanged; repeat migration 0 |
| Local activation | Payment first, then Booking; original config/token/mounts/networks retained | Both health UP; Booking V9 enabled; Payment V18 |
| Live internal auth | Missing token on both endpoints; valid token on read-only Booking endpoint | 403 / 200 as expected |
| Frontend local runtime | Port 3000 transformed component request | New restriction component served |

The six full-suite skips are environment-gated older Flyway tests plus the new optional migration test. The new migration test was separately executed successfully on MySQL. Private-copy validation also checks the actual local upgrade paths. No bank transfer is performed in tests.

The real MySQL run exposed absent-row gap-lock contention between independent accounts in the rate window. READ_COMMITTED with explicit account/vehicle/rate key serialization fixed it; the full concurrent MySQL suite then passed. The first browser fixture matched source `/api/` imports too broadly; narrowing it to `/api/v1/` resolved the test setup issue, and all four cases passed on rerun.

## Visual / accessibility evidence

Screenshots: `.artifacts/hold-policy/VEHICLE_LIMIT-390.png`, `VEHICLE_LIMIT-1440.png`, `COOLDOWN-390.png`, `COOLDOWN-1440.png`. Real dialog routes checked at both sizes; no horizontal overflow or page errors. Errors use the existing alert component, links are semantic, submit remains keyboard guarded. The mobile dialog scrolls to lower form actions.

## Documentation updated

Module `docs/05-modules/bookings/unpaid-hold-policy.md`, backend API contract/data ownership, workspace approved implementation plan and original audit status. Runtime/copy proof and sanitized logs are local `.artifacts/hold-policy-*` files, including `hold-policy-local-runtime.json` and `hold-policy-runtime-verified.json`.

## Known limitations / follow-ups

This policy does not solve coordinated multi-account/identity abuse. Provider outages remain temporary unconfirmed states, not punitive findings. Capacity still follows the existing 15-minute deadline plus grace/reconciliation behavior. Local rollback images/database copies were retained; no production deployment, merge, commit or push was performed for this increment. The general workspace diff has unrelated in-progress changes, including existing map whitespace, outside this task's reviewed scope.

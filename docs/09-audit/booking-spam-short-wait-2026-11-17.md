# Booking spam protection: short wait

- Task ID: booking-spam-short-wait-2026-11-17.
- Owner: SPH booking/frontend. Last verified: 2026-11-17.
- Status: Done in source and local verification; not deployed.
- Authorization: user approved the proposed change and requested planning and implementation.
- Plan: `D:/DuAnOjt/plans/booking-spam-short-wait-2026-11-17.md`.

## Summary and evidence

The old rate limiter could block until a future persisted window's end. Its configured window duration also had no upper bound. Two unit regressions and one H2 integration regression failed before the fix, then passed after it. The screenshot's actual database/configuration was not inspected, so its exact runtime cause remains UNKNOWN.

The effective spam window is now capped at 60 seconds, with the existing ten-attempt default. Future window starts reset to current server business time; exact expiry starts a fresh window. Blocked requests do not write or extend the existing window. The existing per-driver lock and REQUIRES_NEW transaction still serialize concurrent requests and preserve attempt counts after business rollback.

The RATE_LIMIT notice and disabled button now show seconds. At the server deadline the notice says “Bạn có thể thử tạo booking lại.” and the button unlocks. Form data and the original requestId remain available for a user-initiated retry.

## Files changed

Created:

- Backend `booking-service/src/test/java/com/smartparking/booking/application/service/HoldRateLimiterTest.java`.
- Frontend `e2e/booking-rate-limit.spec.ts` and this report.
- Workspace plan above.

Modified:

- Backend `booking-service/src/main/java/com/smartparking/booking/application/service/HoldRateLimiter.java`.
- Backend `booking-service/src/test/java/com/smartparking/booking/UnpaidHoldPolicyIntegrationTest.java`: appended two integration tests; retained the existing unrelated schedule-fixture edits.
- Backend `docs/api-contracts/unpaid-hold-policy.md`.
- Frontend `src/features/booking-flow/BookingHoldRestrictionNotice.tsx` and `__tests__/BookingHoldRestrictionNotice.test.tsx`.
- Frontend `docs/05-modules/bookings/inline-quick-book.md`.

No files were deleted. Existing workspace changes were preserved.

## Behavior and API/permissions

- Approved change: bound RATE_LIMIT windows and replace their absolute-date notice with a countdown.
- Preserved: form inputs, explicit submission, pending-request protection, idempotency, backend authorization, quotas, unpaid-abandonment cooldown and payment verification restrictions.
- Existing `POST /api/v1/bookings` request and error envelope are unchanged; RATE_LIMIT is HTTP 429 with server retryAt and Retry-After. UTC+7 parsing and focus refresh remain in use.
- Components remain feature-owned under booking-flow. No new shared primitive or library was needed.

## Verification

| Check | Command/environment | Result |
| --- | --- | --- |
| Backend unit/integration | Java 21, `gradlew.bat :booking-service:test :common-library:test --console=plain --offline` | BUILD SUCCESSFUL; booking-service 226 passed, 6 skipped, 0 failures (232 total); common-library eight tests up to date |
| Backend regression matrix | HoldRateLimiterTest (6), UnpaidHoldPolicyIntegrationTest (11) | All 17 passed; includes future-data recovery, 60-second cap, shorter override, exact expiry, no extension, concurrent threshold and transaction rollback |
| Frontend focused tests | Notice and ReservationFlow test files | 22 passed |
| Frontend full suite | `npm run test -- --maxWorkers=4 --reporter=dot` | 96 files, 887 tests passed |
| Typecheck | `npm run typecheck` | Passed |
| Lint | `npm run lint` | Passed |
| Production build | `npm run build` | Passed |
| E2E | `npx playwright test e2e/booking-rate-limit.spec.ts --reporter=list`, Chrome, production preview, mocked HTTP | 2 passed at 390px and 1440px |
| Diff review | Scoped git diff and whitespace checks | Passed; existing unrelated edits retained |

The first default-worker frontend suite run had a notification-search timeout under concurrent build/backend work. Its isolated rerun and the final full run passed without changing that test or feature. Existing layout tests emit mocked-network stderr. A targeted ESLint invocation including the E2E file reported that the file is excluded by the existing ESLint configuration; application/test source lint passed. The first E2E harness paused its virtual clock during lazy loading; moving the pause after page readiness resolved it without product changes.

## Visual/accessibility evidence

- Existing alert semantics and semantic disabled submit button retained. Vehicle selection remained operable while waiting.
- E2E verified inputs remain selected, no horizontal overflow, no JS page errors, no automatic booking after expiry, and identical payload/requestId on explicit retry.
- Screenshots were inspected: [mobile](../../.artifacts/playwright/booking-rate-limit-390.png), [desktop](../../.artifacts/playwright/booking-rate-limit-1440.png). Full-page captures include the existing fixed navigation.

## Limitations and rollout

- This is a source/local fix, not a deployment. Backend and frontend must be released to change the running site.
- No CAPTCHA is included in this approved scope. The persisted server-side limiter remains the anti-spam mechanism.
- Other hold-policy restrictions can still impose their existing waits; the 60-second cap applies only to RATE_LIMIT.
- Database integration here used H2 in MySQL compatibility mode; six environment-gated tests were skipped. No production data was changed.
- A configured rate window above 60 seconds is intentionally treated as 60 seconds. Rollback only this task's hunks/files; no schema rollback is needed.

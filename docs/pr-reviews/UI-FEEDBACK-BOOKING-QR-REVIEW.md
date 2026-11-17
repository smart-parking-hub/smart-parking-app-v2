# Review: UI feedback and booking QR correctness

- Date: 2026-11-17
- Branch: `fix/ui-feedback-booking-qr`
- Base reviewed: `origin/main` at `bc51950`
- Review type: author self-review; a separate maintainer review remains available through the PR.

## Result

No unresolved Blocker, Critical or Major finding was identified in the reviewed change. The current revision passes the local build, full unit/component suite and all 55 browser scenarios after synchronization with main.

## Findings and disposition

| Severity | Finding | Disposition |
|---|---|---|
| Major, fixed | Dashboard selected the first open booking and combined it with sample slot, plate, time, fee and ALPR information. | Follow real booking pagination, prioritize parking states, render server facts or explicit missing-data states, preserve zero money values, and keep fixtures in tests. |
| Major, fixed | Checkout QR was static and copied a code with an invented `-OUT` suffix. | Generate a real QR from the exact server `bookingCode`; show/copy the same code; allow checkout QR only for `PARKING`/`OVERTIME`; pin the selected booking ID across refreshes. |
| Major, fixed | Unpaid check-in codes appeared in payment summaries, return views and booking lists/details. | Use the existing numeric order reference for `PENDING_PAYMENT`, including text, attributes, clipboard and gate links. This is a UI visibility change; backend authorization remains authoritative. |
| Minor, fixed | Success/error feedback used inconsistent banners, floating notices and dialogs; controls were misaligned. | Reuse native Dialog for modal notifications, retain top-right login toast, align toast contents and vehicle controls, translate the lot status and style navigation as buttons. |
| Minor, fixed | Mobile floating assistant could cover capacity save controls. | Reserve space below the mobile footer; validate the save/confirm flow at 390px and 1440px. |
| Minor, existing | `RegisterPage.tsx:198` emits `react-hooks/exhaustive-deps` for `form` and `verifyOtp`. | Recorded as pre-existing, outside this PR. ESLint reports zero errors and one warning. |

## Correctness, privacy and contracts

- Backend evidence was checked in `BookingDto`, `BookingServiceImpl.getMyBookings`, `QueueController` and `CheckInOutServiceImpl`. No API, authentication, role or payment-state transition was changed.
- Server data remains in TanStack Query. The selected QR booking ID is local UI state; no API response is mirrored into a global store.
- Shared UI stays domain-agnostic. The booking-reference helper is pure and shared across driver/merchant/payment views.
- Native dialogs preserve Escape/backdrop dismissal, scroll restoration and focus management. Scanner failure dismissal returns focus to its code input.
- Exact QR content was checked by decoding rendered browser screenshots with ZXing. The user-provided screenshot was also decoded to `BK-20260301-013`, matching its printed code and the repository's existing demo seed; the PR does not delete or alter that database record.
- No credentials, environment files, generated build output, browser reports or temporary tooling are included in the commit.

## Validation after rebase

| Check | Outcome |
|---|---|
| `npm run build` (`tsc -b && vite build`) | Passed |
| `npm run lint` | 0 errors, 1 existing warning |
| `npm test -- --maxWorkers=2` | 775 passed, 0 failed |
| CI booking/gate/payment suite plus new UI/dashboard/capacity E2E | 55 unique scenarios passed; two outdated text/code expectations were updated and their complete flows rechecked successfully |
| `git -c core.whitespace=cr-at-eol diff --check origin/main` | Passed |

## Limits and follow-up context

- APIs and PayOS are mocked in browser tests. No real bank transfer, physical gate operation or production write was performed.
- The backend still sends `bookingCode` for pending bookings. UI hiding is not a replacement for server authorization or an API-level privacy change.
- Exact selection/counting currently reads all driver-booking pages while active dashboards refresh every 15 seconds. A large history may warrant a separately designed server summary endpoint.
- Seeded old parking sessions can legitimately be selected ahead of a newer unpaid hold. This PR fixes display and QR correctness without inventing a cleanup rule for existing data.

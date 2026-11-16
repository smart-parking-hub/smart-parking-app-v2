# Driver dashboard: real booking data and QR

- Owner: SPH frontend
- Last verified: 2026-11-17
- Route: `/dashboard` and existing dashboard aliases
- Status: verified locally with API mocks; no production change

## Problem and resulting behavior

The dashboard previously selected the first open booking, including unpaid holds, then displayed placeholder parking facts and check-out actions for it. The QR was a static SVG; copied codes appended `-OUT`, although the gate API looks up the exact booking code.

- Select an ongoing parked trip before a pending hold: `OVERTIME`, `PARKING`, `AWAITING_FINAL_PAYMENT`, `PENDING_CHECKIN`, then `PENDING_PAYMENT`. Within the same status, retain server order (newest first).
- Follow booking pagination so an older parked trip is not hidden by the first page of newer holds. Deduplicate IDs across pages. Count only `PARKING` and `OVERTIME` in the parked KPI.
- Read profile and queue data from their real endpoints. A failed optional queue read displays an unknown count instead of zero; a failed booking/vehicle read remains an error with retry.
- Render the chosen booking's actual plate, physical slot code, planned/actual times and amounts. Missing data stays unknown. Zero money values are preserved.
- Pending deposits show the numeric order reference and a payment link. Awaiting entry links to the existing check-in ticket; awaiting final payment links to payment. Only `PARKING`/`OVERTIME` can open a check-out QR.
- Generate `QRCodeSVG` using the exact `bookingCode`. Show and copy that same code without a suffix. Pin the open QR to its booking ID across dashboard refreshes; close/hide it if that booking is no longer eligible.
- Recent rows show their actual status, timestamps and reference. Unpaid codes remain hidden in both displayed content and search matching.
- Remove fixed slot C-12, trailer plate, electricity, container, ALPR match, arrival/duration/date, pricing and 22:00 deadline from operational UI. Sample data lives in test fixtures only.

## Contracts and preserved capabilities

Verified against `BookingController`, `BookingServiceImpl.getMyBookings`, `BookingDto`, `QueueController`, and `CheckInOutServiceImpl.checkOut` in the backend checkout.

| Read | Usage |
|---|---|
| `GET /api/v1/vehicles` | `totalElements` for registered fleet |
| `GET /api/v1/bookings?page=…&size=100` | Real bookings, full pagination, server-owned money/status/code |
| `GET /api/v1/users/me` | Current profile name/phone |
| `GET /api/v1/queues/me` | Current waiting queue or null |

The gate accepts an exact booking code only for `PARKING`/`OVERTIME`. No API, auth, role or payment/status transition changed. Search, shortcuts, directions, ticket navigation, empty/loading/error states and retry remain available. Queries use TanStack Query and cancellation; active dashboards refresh every 15 seconds. Only the selected QR ID is stored as local UI state.

## Verification and limits

- Full Vitest suite: **775 passed**, including dashboard regression cases for pagination, trip priority, zero prices, unavailable queue data, unpaid-code visibility, exact-code copy, and QR eligibility.
- Production build (`npm run build`): passed. ESLint: zero errors; one existing hook-dependency warning in `RegisterPage.tsx:198`.
- Chromium: **4 passed**, at 390px and 1440px. Both pending-only and parked-behind-a-newer-hold scenarios passed. ZXing decodes the actual rendered QR screenshot to the original server code.
- Screenshots: `.artifacts/playwright/dashboard-real-trip-*.png`, `dashboard-real-qr-*.png`, `dashboard-pending-*.png`.
- No real camera/gate operation or transfer was performed. Backend authorization and settlement remain authoritative. The API still returns pending booking codes; this change controls their UI visibility.
- The current driver API has no status-summary filter, so exact dashboard selection/counting requires reading its pages. A large booking history may benefit from a separately approved server summary endpoint.

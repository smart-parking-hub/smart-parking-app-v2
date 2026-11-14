# Dashboard recent bookings

- Owner: Frontend maintainers
- Last verified: 2026-11-15
- Scope: SCR-026, recent bookings on `/merchant/dashboard`.
- Authority: User requested a clearer, more attractive replacement for the supplied screenshot.

`RecentMerchantBookings` belongs to the dashboard feature. It reuses the existing `Badge`, brand colors, heading/body fonts and Lucide icons without adding dependencies or changing global styles.

At container widths of at least 640px, show a fixed-layout table with booking code, license plate, lot and status headers. Narrower containers show each booking as a stacked row. Codes longer than 20 characters show their first eight and last six characters; the original code remains in the link's accessible name and native title. Long lot names wrap to two lines with their full value in a title.

| Existing capability | Result |
| --- | --- |
| Five latest bookings, server order | Preserved, existing query |
| Booking code and detail link | Preserved, display abbreviation only |
| License plate and lot | Preserved, missing values remain `—` |
| Booking status | Existing Badge dictionary and semantic colors |
| View all bookings | Preserved in full-width footer link |
| Empty results | Styled inline empty state |
| Loading, failure, retry, refresh, permissions | Existing page and route behavior unchanged |

Contract evidence: `fetchMerchantDashboardData` still requests `/api/v1/merchant/bookings` with `page=0`, `size=5`, `sort=createdAt,desc`; its existing Zod schema provides every field. No API, authentication, routing, financial logic or booking transition changes.

Verification and fixture screenshots: `docs/09-audit/recent-merchant-bookings-report.md`.

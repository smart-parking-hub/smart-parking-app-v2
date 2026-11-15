# Quick booking payment polish and cancelled-QR recovery

Owner: SPH frontend. `last_verified`: 2026-11-15.

User scope: compact the quick-reservation payment state shown in the screenshot; fix reopening a PayOS QR after cancelling the first payment.

## Presentation and parity

ReservationFlow selects the compact BookingStatusPanel variant while the standard booking detail/QR states remain available. QuickBookingPaymentSummary stays in booking-flow: real lot/address, plate, expected schedule, prominent server deposit, original payment deadline, one-line full-copyable booking code, secondary estimated fee. No price/deposit/deadline rule or API was changed by the visual work.

Hosted PayOS no longer has an outer card inside another outer card. There is one primary action, with small status-check/close controls below. Tariff factors move to a native disclosure and Demo/cancel/bookings actions remain under Tác vụ khác. Development demo visibility and server validation are unchanged. The booking link opens the selected server ticket.

The hosted opener is a button that requests/revalidates the server URL; it exposes no old provider href that can be copied/middle-clicked after cancellation. Failure removes the opener and displays a status-check/recovery summary rather than leaving the cancelled URL available. Existing embedded SDK and authoritative sync behavior are preserved.

## Backend activation

The previous local database migration blocker was resolved with an explicitly selected compatible lineage preserving V1–V7 identity/checksums. The canonical chain remains unchanged. A full-copy MySQL upgrade proved unchanged financial records and strict validation before local activation; current payment-service health is UP. See the backend `docs/api-contracts/payos-local-lineage.md`. No Flyway repair, history relabelling, fake payment success or bank transfer was used.

## Verification

Targeted reservation, PayOS, QR and quick-booking component tests; desktop/mobile actual-router screenshots; cancelled→new-attempt journeys; scoped ESLint and production build. Exact final results are recorded in `D:/DuAnOjt/.artifacts/quick-payment-polish-*` and `.artifacts/payos-compatible-backend-tests.log`.

Provider calls in automated payment journeys are fixtures. The local service/image and migration activation were checked separately; no live bank settlement was claimed. Concurrent merchant/bank/withdrawal UI changes are outside this task.

Final observed results: 55 related component tests passed; 26 actual-router Chrome cases passed (including the two new modal screenshots); scoped ESLint has 0 errors/warnings; production build passed. Full payment-service suite: 163 cases, 160 passed and 3 conditional skips. Local payment image is `smartparking/payment-service:payos-recovery-20261115`, health UP; database is at V18 with original V1–V7 version/checksum rows unchanged. Port 3000 serves QuickBookingPaymentSummary. Desktop/mobile screenshots are under `.artifacts/quick-payment-polish/browser`.

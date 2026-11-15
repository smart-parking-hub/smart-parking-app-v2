# Unpaid hold restrictions

Owner: booking-flow. Last verified: 2026-11-15. Status: VERIFIED against backend implementation and automated tests.

`ReservationFlow` preserves the existing server booking/deposit/payment journey and now renders typed `BOOKING_HOLD_*` errors from `POST /api/v1/bookings`. `BookingHoldRestrictionNotice` validates the details with Zod; generic/malformed errors retain ordinary error handling.

The approved backend limits are one pending-payment booking per vehicle, three per driver, a 30-minute driver/lot cooldown after two confirmed unpaid releases within 60 minutes, and ten new-create attempts per 60 seconds. These are server rules; frontend state, vehicle selection or browser storage never authorizes a hold. Failed creation does not navigate to payment.

| Server reason | UI behavior |
| --- | --- |
| VEHICLE_LIMIT (409) | Message plus `Xem vé đang giữ` when the server supplies a caller-owned existingBookingId |
| ACCOUNT_LIMIT (409) | Message plus `Xem các vé chờ cọc` |
| COOLDOWN / RATE_LIMIT (429) | Original server retryAt in Vietnam time, disabled submit countdown until that deadline |
| PAYMENT_CHECK_PENDING (503) | Temporary verification message/deadline; no client-generated abuse finding |

The countdown updates each second and on browser focus. Reaching the deadline re-enables manual submission; it never auto-posts. Enter submission is also guarded while timed restriction or mutation is pending. Other form values remain visible. Backend authorization, payment confirmation and expiry remain authoritative on retry.

Evidence:

- `BookingHoldRestrictionNotice.test.tsx`: existing ticket/account links, Vietnam deadline, focus resume, malformed/generic errors.
- `ReservationFlow.test.tsx`: rejected create preserves form, prevents another timed submit and does not offer PayOS.
- `e2e/unpaid-hold-policy.spec.ts`: actual `/parking` router/dialog at 390px and 1440px, no payment calls on rejection, no automatic booking after clock advancement, horizontal overflow/page errors checked. API/provider responses are intercepted; no bank transfers occur.

Backend contract: `smart-parking-service-microservice/docs/api-contracts/unpaid-hold-policy.md`. No dependency was added to the frontend. Closing/cancelling a PayOS session is not itself a booking release or an abuse strike.

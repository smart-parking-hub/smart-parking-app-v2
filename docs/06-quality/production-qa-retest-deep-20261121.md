# Production retest: modal interaction and viewport coverage

Later booking acceptance and the follow-up modal fix are recorded in the final
section. Earlier backend/blocker findings below are historical observations.

- Owner: SmartParkingHub frontend/backend maintainers
- Last verified: 2026-11-21, UTC+7
- Baseline: FE `ca439a8` (PR #118); BE `6d59f46` (PR #84).
- Private input: `2026-11-21-vercel-qa-retest-report.md` and its original images.
  The report's 17:09 timestamp predates #118, merged at 17:52:14 UTC+7. Its
  historical findings must be retained and followed by a current acceptance matrix.

## Fresh production findings

The earlier desktop/static checks were insufficient to close the UI task. A
fresh authenticated browser audit covered Chrome and Edge, DRIVER and MERCHANT,
at 1440×900, 1366×768, 390×844, 320×568, 960×600 and 720×450. The final two viewport
sizes emulate the CSS space available at 150%/200% zoom on a 1440×900 display;
they are not tests of every browser's zoom UI or a physical mobile keyboard.

Both browsers reproduced:

- Withdrawal submit hidden at small/short viewports. At 390px it could initially
  fit but become clipped after validation added an error notice. The prior
  report's desktop PASS did not cover this state.
- Vehicle editor keyboard focus leaving the modal and failing to return to its
  trigger after closing. Its Add button is disabled while the editor is open,
  so capturing `document.activeElement` after opening loses the original trigger.

Cold `/parking` entry/reload, five mouse-open/close cycles of the account menu,
vehicle action visibility and computed select `appearance: none` passed in the
fresh audit. No vehicle or withdrawal writes were submitted: the audit prevents
mutating UI requests and confirmed zero attempted writes for invalid forms.
Raw account screenshots and JSON stay under local ignored
`.artifacts/qa-retest-deep-20261121/`.

## Patch boundaries

- `Modal` uses a native dialog top layer while retaining its panel, backdrop,
  sizes and existing actions. Its labelled heading is explicit. `Modal` and
  `Dialog` share a lifecycle hook for opening/closing, scroll restoration,
  keyboard focus wrapping and return focus. Cleanup does not steal focus from
  a newly opened dialog. Vehicle create/edit records the actual trigger before
  the Add action is disabled; focus is restored after the closing React commit.
- `Dialog` gains an optional footer. Existing callers without a footer retain
  their layout. Withdrawal fields scroll independently; validation/server error
  notices and submit remain in the footer. The submit button is associated with
  the original form using native `form`/`id` attributes. Default/other-account
  validation, amounts, pending state, request payload and approval flow remain
  unchanged. Validation also keeps the invalid field visible when footer height
  changes. An explicit after-close focus callback still runs after restoration.
- No API, permission, schema, dependency, wallet flag or production network
  change is included in this FE patch. Rollback is a revert and normal Vercel
  deployment.

## Regression evidence

- New 320px tests failed before the fix for both focus containment and withdrawal
  action visibility. Checking only `toBeVisible`/`click` would miss clipping,
  because the browser test can scroll a control into view before clicking.
- Browser coverage checks clipping before interaction and after invalid submit,
  then checks the exact successful withdrawal payload using mocked APIs. Vehicle
  cases check Tab/Shift+Tab, autocomplete Escape, modal Escape/Cancel and focus
  restoration for both create and edit.
- Focused component suites cover shared components, vehicles and merchant
  operations; the browser suites include existing vehicle create/edit and
  default/other-bank-account flows. Final head results are recorded on the PR
  and in the private retest report.
- CI includes the new regression file and the existing withdrawal browser suite.
  Final CI and production acceptance must refer to the released head/merge SHA.

## Backend production evidence and remaining blocker

The independent read-only verifier reported **7/7 CURRENT, pending=0** for
`6d59f46`; all three hosts had the expected running containers. This is a
deployment check, not booking acceptance.

One authorized real booking submission at **2026-11-21 18:55:22 UTC+7** used an
owned active container vehicle, Lot 1, a future date and a half-hour-aligned
interval. It returned **500 / ERR_500**. The driver's booking count stayed **9**,
with no new booking IDs and no payment. Current container logs again show
`OwnedVehicleClient.require` failing to connect to `localhost:8081`.

Fresh host/config inspection found:

- VPS1/VPS2 have Tailnet interfaces; VPS3 does not have Tailscale installed or a
  Tailnet interface. No other private host network was present on VPS3.
- Identity:8081 is bound only to VPS1 loopback. Booking has no Identity URL or
  internal service token; Payment and Parking also lack required internal token
  injection for their respective internal calls.
- The VPS3 deploy account has no noninteractive sudo or configured Tailnet auth
  environment. A configured administrative SSH connection or provisioned
  private/TLS endpoints are required to complete secure service routing.

Booking remains **OPEN/P0**. Do not restore #82's required URL variables until
the actual routes and credentials are provisioned and verified. Do not bypass
vehicle ownership or expose internal RPC endpoints publicly to make the UI pass.

## Follow-up: Booking works, detail modal held an outdated snapshot

Backend PR #85 released `a841f21` through successful CI/CD `44916304693`;
independent verification reports 7/7 CURRENT, pending=0. VPS3 is authenticated
into the expected Tailnet and the private Identity/Payment/Booking routes were
verified from the caller containers, including a real owned-vehicle read.

The live UI created booking 1236 with HTTP 201 / PENDING_PAYMENT. Cancellation
returned HTTP 200 / CANCELLED, refund 0 / NONE. Availability moved 4 to 3 and
back to 4. No payment was initiated. The open detail modal nevertheless retained
its old payment/cancel actions after the server had cancelled the booking.

`MyBookingsPage` passed the selected list snapshot as the authoritative `booking`
prop to `BookingStatusPanel`. That disables its detail query for a pending
booking; invalidating the query after cancellation cannot update the snapshot.
The modal now passes only `bookingId`, letting the existing TanStack detail query
read current state and participate in the existing invalidation/polling flow.
Its heading reads the same query cache, so the order/ticket reference changes
with server status too. Header and content observers share one query key.
Deep links and other callers are unchanged; no new state store, API, permission,
fee, refund rule or visual layout is introduced.

Two component regressions fail before the fix: cancellation while details stay
open, and opening a stale pending row that the server has already cancelled.
Browser regressions at 390px/1440px keep the list stale deliberately, assert the
fresh detail read, perform the existing confirmation flow and verify the stale
payment/cancel actions disappear. Final head CI and repeated live acceptance
are recorded in the follow-up PR receipt and private retest report.

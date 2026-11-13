# Merchant check-in confirmation

- Owner: frontend maintainers
- Last verified: 2026-11-13
- Route: `/merchant/qr-scanner` (XE VÀO)
- Evidence: `src/features/merchant/operations/ScannerPage.tsx`

## Behavior and parity

| Capability | Result |
| --- | --- |
| Manual check-in and automatic QR submission | Preserved; both use the same mutation |
| Successful check-in feedback | Changed from an inline notice to a centered success dialog showing the submitted booking code |
| Repeated check-in for the same lot and code during this session | Preserved request deduplication; reopens the dialog without another API call |
| Failed check-in | Preserved inline error; no success dialog |
| Close dialog | Đã hiểu, close button, backdrop or Escape; submitted form values remain available |
| Check-out and cash settlement | Preserved |

The existing `Dialog` primitive supplies native modal focus handling, its accessible title, Escape handling and focus restoration. The success dialog appears only after `POST /api/v1/merchant/check-in` succeeds, or for a previously successful lot/code pair in the current page session. The request still contains `parkingLotId` and `bookingCode`; backend authorization remains authoritative. No API, permission or backend changes.

## Completion report

- Scope: success feedback in the merchant QR scanner only.
- Modified: scanner component, existing operations component tests, check-in E2E and full booking lifecycle E2E.
- Created: this module note; no source files deleted or dependencies added.
- `npm run test -- src/features/merchant/operations/operations.test.tsx`: 20 passed, including dialog dismissal/reopening, duplicate request prevention and server rejection.
- `npm run build`: passed, including TypeScript project checks.
- `npm run lint`: passed with zero errors and zero warnings on the synchronized main baseline.
- `npx playwright test e2e/test-02-merchant-qr-checkin.spec.ts e2e/core-booking-gate-flow.spec.ts e2e/test-03-merchant-qr-checkout-cash.spec.ts`: 3 passed in Chromium with mocked API responses on the PR branch after synchronization with main.
- Visual verification: inspected screenshots at 1440×900 and 390×844; the mobile dialog is 352px wide and fits the viewport. Browser Escape dismissal passed.
- Limitations: browser checks use mocked APIs; no live gate hardware or backend operation was triggered.

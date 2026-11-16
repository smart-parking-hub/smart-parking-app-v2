# UI consistency and check-in code visibility

- Owner: SPH frontend
- Last verified: 2026-11-17
- Scope: vehicle form, login/password/profile notifications, merchant lot actions and statuses, capacity notifications, gate scanner, booking/payment references.

## Requested behavior and implementation

| Request | Result | Evidence |
|---|---|---|
| Align vehicle select and brand input | 48px controls, matching chevrons, labels and field spacing; editable brand suggestions and native select keyboard behavior preserved | `VehicleEditor`, `Autocomplete`, `e2e/ui-consistency.spec.ts` |
| Remove visible “Đóng” from login notification | Shared success toast at the top right with an accessible × button and five-second timeout, following the user's positioning correction | `AuthSession`, `Toast`, `ToastContainer` |
| Make successful document upload a modal | Centered success dialog, dismissible by ×, Escape or backdrop; focus returns to file input after closing | `ProfileDocuments` |
| Standardize notification modals | Same `NotificationDialog` composition over existing native `Dialog` for password changes, merchant profile/contact/documents, capacity saves and scanner outcomes; login uses a top-right toast as requested | `NotificationDialog`; no new dependency |
| Replace underlined merchant lot actions | Bordered buttons with icons for details/edit; navigation and approved-lot actions preserved | `MerchantParkingLotsPage` |
| Replace raw status enum | `CHANGES_REQUESTED` displays “Cần bổ sung hồ sơ” with warning styling; lot filters contain Vietnamese labels | `Badge`, `MerchantParkingLotsFilterBar` |
| Show invalid/early scans in the middle | Dismissible warning dialog using the actual API message; closing returns focus to code input and permits another scan | `ScannerPage`, `operations.test.tsx`, `e2e/ui-consistency.spec.ts` |
| Hide check-in code during deposit payment | `PENDING_PAYMENT` uses the existing numeric order ID; driver and merchant lists/details, compact payment and return/cancel views do not render/copy the check-in code or put it in attributes/QR navigation links | `bookingReference`, booking/payment components and regression tests |
| Keep save reachable on mobile | Capacity page leaves room below its save controls for the floating assistant | `MerchantSlotsPage.css`, `e2e/merchant-slots.spec.ts` |

## Preserved contracts and behavior

- No API, DTO, authentication, role, payment amount, deposit deadline or status transition changes.
- Native vehicle select remains registered with React Hook Form; optional brand/model remains free text.
- The QR remains available for `PENDING_CHECKIN`, following authoritative server state. Final payment retains the existing ticket reference.
- Verified backend evidence: `CheckInOutServiceImpl.checkIn` verifies the merchant/lot, requires `PENDING_CHECKIN`, then enforces the early-entry window and expiry. The frontend displays the server error without inventing a new time rule.
- The pending booking API still returns `bookingCode`. This task hides it in the affected UI; it does not claim to remove it from the network payload or replace backend authorization.
- Native dialogs restore body scrolling and focus after closing. Success and settlement dialogs no longer stack for the same checkout result.

## Verification

- Full Vitest suite: 764 tests passed; subsequent focused regression run: 127 tests passed (includes one additional merchant pending-payment case).
- Production build (`tsc -b && vite build`): passed.
- ESLint: zero errors; one existing `react-hooks/exhaustive-deps` warning in `RegisterPage.tsx:198`, outside this change.
- Browser checks use mocked API/PayOS responses on local Chromium at 390px and 1440px; PayOS recovery also covers 768px. No real transfer, camera hardware, or production write was performed.
- Visual artifacts: `.artifacts/playwright/ui-vehicles-*.png`, `ui-documents-*.png`, `ui-scanner-*.png`, `ui-lot-actions-*.png`, `ui-payment-*.png`, `ui-capacity-*.png`.

- Browser regression: 30 unique cases across UI/capacity/PayOS passed (25 in acceptance run, five after updating pending-deposit assertions and mobile footer spacing). Existing gate check-in and cash checkout cases also passed: 32 unique browser cases in total.
- `git diff --check`: passed.

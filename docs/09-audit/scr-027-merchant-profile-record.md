# Screen Implementation Record: SCR-027 Merchant Legal & Banking Profile

- Screen: `SCR-027 Merchant Profile Page (Hồ sơ pháp lý & Tài khoản nhận tiền chủ bãi)`
- Route: `/merchant/profile`
- Owning feature: `features/merchant/profile`
- Stitch source supplied: Yes (`SMARTTRUCK HUB MERCHANT OPS` HTML/CSS web_dashboard shell)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_MERCHANT`
- Legacy screen reference: `MOD-04: Merchant Operations Portal`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Layout & Shell | Fixed 260px desktop sidebar with 8 merchant navigation links, active highlight on `Hồ sơ bến bãi`, top control header with live ticker | `MerchantLayout.tsx`, `MerchantSidebar.tsx`, `MerchantHeader.tsx` | Verified |
| Typography | Sora (headlines, balance amounts), Inter (body/labels), Mono (timestamps, STK, MST, #MCH-88219) | Tailwind v4 @theme, font-sora, font-mono | Verified |
| Colors/surfaces | `#131b2e` (primary-container), `#d95f00` (tertiary accent), `#eff4ff` (surface-container-low), `#0d1c2e` (on-surface text) | Industrial freight color tokens in Tailwind v4 | Verified |
| Identity Ribbon | Eyebrow `#MCH-88219`, page title H1, Verified E-KYC dual-border badge with ISO 27001 • Cục ĐKVN certificate info dialog | `MerchantProfileHeaderRibbon.tsx` | Verified |
| Left Column (40%) | 1. Corporate Identity summary card (Tân Cảng Saigon logo, hotline OTP verified, GPKD, 3 yards)<br>2. Available Revenue Balance card (`42.800.000 ₫`, `25.000.000 ₫` 72h hold, fast cashout CTA)<br>3. Platform fee (5.0%) and VAT invoice statement card | `MerchantIdentitySummaryCard.tsx`, `MerchantWalletSummaryCard.tsx`, `MerchantPolicyCard.tsx` | Verified |
| Right Column (60%) | 1. Block 01: Legal Information & digital archived dossiers (GPKD & PCCC preview & upload zone)<br>2. Block 02: MB Bank Napas247 account with Masking Toggle (`0882****9999` <=> `0882199999999`) and 24h fraud warning<br>3. Block 03: 3 Realtime notification switches (Web Push Horn, SMS 95%, Zalo OA 23h30)<br>4. Profile actions footer (Reset defaults & Save changes) | `LegalInfoFormCard.tsx`, `BankingProfileCard.tsx`, `NotificationChannelsConfigCard.tsx`, `ProfileActionsFooter.tsx` | Verified |
| Interactive Modals | Fast cashout modal (SCR-MOD-05 Napas247 simulation with `TẤT CẢ` shortcut) + Document Dossier Preview modal with CA Viettel certificate | `FastWithdrawModal.tsx`, `DocumentPreviewModal.tsx` | Verified |
| Feedback & Toast | Persistent bottom floating toast notifications for saving, resets, and cashout dispatching | `MerchantProfilePage.tsx` | Verified |

## Verification
- [x] Typecheck: `tsc --noEmit` / `tsc -b` -> 0 Errors
- [x] Unit/component tests: `vitest run` -> 8/8 Profile Tests Passed (100%), 16/16 Test Files Passed (100%)
- [x] Production build: `npm run build` (`tsc -b && vite build`) -> Built successfully (`dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css`)
- [x] Accessibility & Keyboard navigation: Semantic buttons, ARIA labels, responsive scrollbars, accessible color contrasts

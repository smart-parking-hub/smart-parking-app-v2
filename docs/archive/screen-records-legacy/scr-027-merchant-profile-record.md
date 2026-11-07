# SCR-027 — Simplified merchant profile (current implementation)

Last verified: 2026-11-05. Owner: project maintainers. Route: `/merchant/profile`.

## Scope and design

User explicitly authorized a clearer layout, readable fonts and removal of unsupported/demo functionality. This supersedes the visual specification and simulated behavior recorded below. No backend code, auth contract or unrelated screen was changed.

Direction: restrained editorial profile; DFII 13/15 (impact 3 + fit 5 + feasibility 4 + performance 4 - consistency risk 3). Be Vietnam Pro headings and Source Sans 3 body use existing locally hosted fonts. Body and form controls use 16px, with semantic brand tokens, a single orange heading rule, neutral surfaces, generous spacing and no decorative motion. Profile-only compact header replaces mock yard selector, notification count, ALPR status and fake user name. The sidebar's unverified ISO/version footer is hidden only on this route.

## Contract and capability parity

Verified against identity-service `MerchantProfileController`, `MerchantProfileResponse`, `UpdateMerchantProfileRequest` and `MerchantProfileServiceImpl`.

| Capability | Current behavior |
| --- | --- |
| View profile | Real GET /api/v1/merchant/profile; nullable response gives empty state; no local/demo fallback |
| Contact edits | Real PUT /api/v1/merchant/profile with RHF/Zod; dirty state, cancel, pending lock and success/error feedback |
| Legal documents | POST /api/v1/merchant/profile/documents with multipart data; PDF/JPEG/PNG/WEBP up to 5MB; license-only update supported |
| Document list/preview | Removed: response contains no document URLs or catalog; no fake archived PDFs rendered |
| Bank details | Server bank name and masked account; reveal/hide preserved; no invented account holder or branch |
| Wallet | Server balance only; link to existing /merchant/withdrawals replaces simulated fast payout |
| Verification | Server verificationLabel only; removed ISO/OTP/certificate claims and fake audit deadline |
| Notifications/tax | Removed local-only SMS/Zalo switches, fee percentage and tax policy with no corresponding profile contract |
| API failure | Visible error and retry; mutations never report successful local fallback |

Components stay within features/merchant/profile. Generic shared components reused: Notice, central Axios client. No new dependency, API endpoint, global state or database change. Data is not persisted to localStorage.

## Verification evidence

- Feature component tests: 7/7 passed (API data only, loading/empty, retry, validation/cancel, PUT failure/success, account masking, upload validation/multipart).
- ESLint: 0 errors / 0 warnings.
- Production build and TypeScript: passed.
- Isolated Playwright checks with mocked HTTP: desktop 1440px, mobile 390px, no horizontal overflow, mobile menu open/close and invalid email validation passed; no pageerror events.
- Screenshots: D:/DuAnOjt/merchant-profile-desktop.png and D:/DuAnOjt/merchant-profile-mobile.png. Data shown in these screenshots is test data, not live API evidence.
- Full suite: 222 passed, 2 failed out of 224. Failures outside this screen: App.test.tsx expects Blog filters to have tab roles; router.test.tsx reports duplicate route shapes. Not changed in this task.
- Remaining: live backend mutation/upload verification and user visual acceptance. Backend contract inspected from source; screenshots do not prove backend availability.

---

## Historical implementation record (superseded)

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


### Follow-up — compact navigation and logout polish (2026-11-05)

Driver Profile and Vehicles now share ProfileSidebarNav compact variant (260px card, common account heading/links, active-page indication, no placeholder counts). The unbacked fleet operations sidebar card is no longer rendered on Vehicles. Other consumers retain their existing variant. Profile section links are available through the form headings; security navigation targets /profile#bao-mat. Merchant logout now uses an icon, soft red border, hover/active and keyboard focus styles; logout behavior is unchanged. Related suites: 51 tests passed; ESLint and production build passed. Sibling network-test stderr remains as documented above.

# Lot profile navigation

- Objective: replace scattered management links with one consistent navigation for Tổng quan, Cấu hình chỗ đỗ and Bảng giá.
- Owner: frontend maintainers. Last verified: 2026-11-08.
- Files: entity component MerchantLotNavigation; overview page; operations pricing/configuration page; slots header; overview CSS; navigation E2E; inventory and parity records.
- Placement: navigation belongs in entities/parking-lot because it is reused by the parking-lot profile, capacity and operations editors. No dependency added.
- Existing route URLs, form validation, API calls, image upload, location display, QR query parameter and status-dependent action visibility are preserved. Only the active route's content renders.
- VERIFIED: npm run typecheck passed; npm run lint passed; npm run build passed. npm run test: 48 files / 344 tests passed. Some existing tests emitted network AggregateError stderr; passing tests do not imply a warning-free full-suite console.
- VERIFIED: npx playwright test e2e/merchant-lot-navigation.spec.ts: 2 passed at 1440px and 390px. Covered active state, overview → capacity → pricing → overview, pricing reload, keyboard activation, no document horizontal overflow and no pageerror events. API data was mocked; live backend mutation verification was not part of this UI change.
- Browser tests initially failed to launch Edge in the sandbox; running Edge and Vite outside the sandbox resolved this. The runner also emitted an environment NO_COLOR/FORCE_COLOR warning.
- Evidence: lot-navigation-1440.png, lot-navigation-390.png, lot-navigation-pricing-1440.png, lot-navigation-pricing-390.png.
- Existing working tree edits were retained. No commit was created.
- Final validation briefly encountered a concurrent MerchantLayout/MerchantHeader prop mismatch outside this task. The header props were updated in the existing working tree; no layout edits were made for this navigation task.

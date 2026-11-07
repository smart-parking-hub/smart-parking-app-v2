# 42. Đầu Vào Thực Thi Cho Từng Batch Triển Khai (Execution Batch Inputs)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** PLANNING ONLY (Tuân thủ PROJECT UNIFICATION MASTER RULES — **Không sửa code**)  
> **Thời điểm xác lập:** 07/11/2026  
> **Mục đích:** Cung cấp các khối nội dung Prompt chuẩn hóa (Ready-to-Copy Execution Inputs) để lập trình viên hoặc AI Agent có thể sao chép và kích hoạt triển khai từng Batch độc lập một cách an toàn tuyệt đối  
> **Trạng thái:** DRAFT FOR ARCHITECTURAL APPROVAL

---

## MỤC LỤC CÁC KHỐI ĐẦU VÀO THỰC THI (READY-TO-COPY PROMPTS)

* [Khối Đầu Vào BATCH 01: Zero-Risk Design Tokens](#khoi-thuc-thi-batch-01-zero-risk-design-tokens)
* [Khối Đầu Vào BATCH 02: Critical Navigation & Interactive Links](#khoi-thuc-thi-batch-02-critical-navigation--interactive-links)
* [Khối Đầu Vào BATCH 03: Core UI Primitives & Orphan Clean-up](#khoi-thuc-thi-batch-03-core-ui-primitives--orphan-clean-up)
* [Khối Đầu Vào BATCH 04: Shared Compounds & Workspace Decoupling](#khoi-thuc-thi-batch-04-shared-compounds--workspace-decoupling)
* [Khối Đầu Vào BATCH 05: State Desync & React Query Invalidation](#khoi-thuc-thi-batch-05-state-desync--react-query-invalidation)
* [Khối Đầu Vào BATCH 06: High-Value Backend API Integrations](#khoi-thuc-thi-batch-06-high-value-backend-api-integrations)
* [Khối Đầu Vào BATCH 07: Page-by-Page Polish & Form Standardization](#khoi-thuc-thi-batch-07-page-by-page-polish--form-standardization)
* [Khối Đầu Vào BATCH 08: Full Workflow Verification & Regression Suite](#khoi-thuc-thi-batch-08-full-workflow-verification--regression-suite)

---

### KHỐI THỰC THI BATCH 01: ZERO-RISK DESIGN TOKENS

```text
# TASK: EXECUTE IMPLEMENTATION BATCH-01 — ZERO-RISK DESIGN TOKENS & GLOBAL STYLES

- BATCH ID: BATCH-01
- BATCH NAME: Khai Báo Toàn Diện Semantic Tokens Trong Tailwind v4 @theme
- OBJECTIVE: Khai báo toàn bộ Semantic Color, Typography vi mô và Merchant Palette vào src/styles/globals.css theo đúng đặc tả Doc 30 & 31. Triệt tiêu hoàn toàn mã drift #b85000.
- EXACT SCOPE: Chỉ chỉnh sửa khối @theme trong src/styles/globals.css. Không sửa bất kỳ file component logic nào.
- TARGET FILES:
  * smart-parking-app-v2/src/styles/globals.css
- COMPONENTS INVOLVED: Toàn bộ hệ thống kế thừa CSS variables.
- TARGET ROUTES: Tất cả 56 màn hình (SCR-01 đến SCR-56).
- ISSUE IDS ADDRESSED: ISSUE-TOK-01, ISSUE-TOK-02, ISSUE-TOK-03, ISSUE-TOK-04.
- PRECONDITIONS: Đã được phê duyệt tài liệu Doc 30 và Doc 31.
- IMPLEMENTATION INSTRUCTIONS:
  1. Mở file src/styles/globals.css.
  2. Bổ sung các biến ngữ nghĩa:
     --color-brand-primary: #d95f00;
     --color-brand-primary-hover: #b84e00;
     --color-brand-primary-active: #9e4300;
     --color-brand-secondary: #060d1a;
     --color-merchant-navy: #0d1c2e;
     --color-merchant-muted: #455f87;
     --color-merchant-card-dark: #131b2e;
     --color-merchant-surface-subtle: #eff4ff;
     --color-background: #f8f9ff;
     --color-surface: #ffffff;
     --text-2xs: 0.6875rem;
     --text-3xs: 0.625rem;
  3. Đảm bảo giữ nguyên các alias cũ (--color-brand-orange, --color-brand-navy) để duy trì 100% backward compatibility.
- ACCEPTANCE CRITERIA:
  * [ ] File globals.css chứa đầy đủ danh mục token chuẩn hóa.
  * [ ] Không có class CSS nào bị vỡ hoặc mất màu.
  * [ ] Lệnh `npm run build` chạy thành công không có cảnh báo.
- REGRESSION TEST COMMAND:
  cd smart-parking-app-v2; npm run build; npm run test
```

---

### KHỐI THỰC THI BATCH 02: CRITICAL NAVIGATION & INTERACTIVE LINKS

```text
# TASK: EXECUTE IMPLEMENTATION BATCH-02 — CRITICAL NAVIGATION & INTERACTIVE LINK FIXES

- BATCH ID: BATCH-02
- BATCH NAME: Sửa Lỗi Nút Bấm Liệt, Link 404 & SPA Router Navigation
- OBJECTIVE: Khắc phục các khuyết tật điều hướng nghiêm trọng trên Landing Page và trang Hủy thanh toán theo Doc 18 & 22.
- EXACT SCOPE: Sửa 4 files giao diện Marketing và Payment.
- TARGET FILES:
  * smart-parking-app-v2/src/features/landing/components/HomeTestimonials.tsx
  * smart-parking-app-v2/src/features/landing/components/LandingNavbar.tsx
  * smart-parking-app-v2/src/features/landing/components/LandingFooter.tsx
  * smart-parking-app-v2/src/features/payment-cancel/pages/PaymentCancelPage.tsx
- COMPONENTS INVOLVED: HomeTestimonials, LandingNavbar, LandingFooter, PaymentCancelPage.
- TARGET ROUTES: SCR-01 (`/`), SCR-02 (`/solutions`), SCR-03 (`/pricing`), SCR-55 (`/payment/cancel`).
- ISSUE IDS ADDRESSED: ISSUE-INT-01, ISSUE-NAV-01, ISSUE-NAV-02, ISSUE-NAV-03, ISSUE-NAV-06.
- PRECONDITIONS: BATCH-01 đã hoàn tất.
- IMPLEMENTATION INSTRUCTIONS:
  1. Trong HomeTestimonials.tsx: Thêm useState quản lý `activeIndex`; gắn handler `onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}` cho nút Prev và tương tự cho nút Next; thêm `aria-label` và chuyển động mượt.
  2. Trong LandingNavbar.tsx: Sửa các liên kết 404 (`/company/about` -> `/about`, `/company/contact` -> `/contact`, `/company/blog` -> `/careers`). Thay thế neo `#lien-he` chết bằng `/contact` khi không ở trang chủ.
  3. Trong LandingFooter.tsx: Thay toàn bộ thẻ `<a>` nội bộ bằng `<Link to="...">` từ `react-router-dom` để loại bỏ việc tải lại toàn trang.
  4. Trong PaymentCancelPage.tsx: Thêm 2 nút bấm điều hướng an toàn: "Thử thanh toán lại" và "Quay lại danh sách bãi xe".
- ACCEPTANCE CRITERIA:
  * [ ] Hai nút Prev/Next carousel hoạt động mượt mà khi click.
  * [ ] Không còn bất kỳ link nào trên Navbar bị văng ra trang 404.
  * [ ] Bấm link ở Footer chuyển trang tức thì (Single Page Navigation), không reload.
  * [ ] Trang `/payment/cancel` có nút thoát an toàn, không còn là ngõ cụt.
- REGRESSION TEST COMMAND:
  cd smart-parking-app-v2; npm run test -- features/landing
```

---

### KHỐI THỰC THI BATCH 03: CORE UI PRIMITIVES & ORPHAN CLEAN-UP

```text
# TASK: EXECUTE IMPLEMENTATION BATCH-03 — CORE UI PRIMITIVES & ORPHAN CLEAN-UP

- BATCH ID: BATCH-03
- BATCH NAME: Chuẩn Hóa Bộ Primitives Dùng Chung & Dọn Dẹp Bản Sao
- OBJECTIVE: Nâng cấp Button, kích hoạt Input, hợp nhất Badge API, chuẩn hóa Skeleton, bổ sung Checkbox/Radio/Switch, và dọn dẹp file DashboardSkeleton thừa.
- EXACT SCOPE: Thư mục `src/shared/components/` và `features/dashboard/`.
- TARGET FILES:
  * smart-parking-app-v2/src/shared/components/Button.tsx
  * smart-parking-app-v2/src/shared/components/Input.tsx
  * smart-parking-app-v2/src/shared/components/Badge.tsx
  * smart-parking-app-v2/src/shared/components/Skeleton.tsx
  * smart-parking-app-v2/src/shared/components/Checkbox.tsx (New)
  * smart-parking-app-v2/src/shared/components/RadioGroup.tsx (New)
  * smart-parking-app-v2/src/shared/components/Switch.tsx (New)
  * smart-parking-app-v2/src/features/dashboard/components/DashboardSkeleton.tsx (Refactor to Re-export)
- ISSUE IDS ADDRESSED: ISSUE-CMP-01, ISSUE-CMP-02, ISSUE-CMP-03, ISSUE-A11Y-01, ISSUE-A11Y-02, ISSUE-RES-01.
- PRECONDITIONS: BATCH-01 đã hoàn tất.
- IMPLEMENTATION INSTRUCTIONS:
  1. Cập nhật Button.tsx: Thêm size `lg` (h-11, px-6, 44px touch target); chuẩn hóa `focus-visible:ring-2 focus-visible:ring-[#d95f00]/40`.
  2. Cập nhật Input.tsx: Bổ sung variant search, password toggle, gán `aria-invalid` và `aria-describedby` chuẩn khi có error prop.
  3. Hợp nhất Badge.tsx: Hỗ trợ cả 2 prop: `variant` và `value` (tự parse regex chuỗi trạng thái từ Workspace cũ).
  4. Tạo Checkbox.tsx, RadioGroup.tsx, Switch.tsx theo đúng hợp đồng Doc 33.
  5. Trong features/dashboard/.../DashboardSkeleton.tsx: Thay ruột bằng `export { DashboardSkeleton } from '../../driver/components/DashboardSkeleton'`.
- ACCEPTANCE CRITERIA:
  * [ ] Badge.tsx biên dịch thành công với cả 2 cách gọi cũ và mới.
  * [ ] Bộ test suite 43 files (322 tests) tiếp tục PASS 100%.
  * [ ] `npx tsc --noEmit` đạt 0 lỗi type.
- REGRESSION TEST COMMAND:
  cd smart-parking-app-v2; npx tsc --noEmit; npm run test
```

---

### KHỐI THỰC THI BATCH 04: SHARED COMPOUNDS & WORKSPACE DECOUPLING

```text
# TASK: EXECUTE IMPLEMENTATION BATCH-04 — SHARED COMPOUNDS & WORKSPACE DECOUPLING

- BATCH ID: BATCH-04
- BATCH NAME: Tách Workspace Monolith & Xây Dựng Shared UI Patterns
- OBJECTIVE: Tách DataTable, Select, Dropdown ra khỏi Workspace.tsx và biến Workspace.tsx thành Re-export Facade an toàn; tạo mới Breadcrumb.tsx và DialogBase.tsx.
- EXACT SCOPE: `src/shared/components/` và các thư mục con.
- TARGET FILES:
  * smart-parking-app-v2/src/shared/components/Workspace.tsx (Facade)
  * smart-parking-app-v2/src/shared/components/patterns/DataTable.tsx (Generic <T>)
  * smart-parking-app-v2/src/shared/components/compound/Select.tsx
  * smart-parking-app-v2/src/shared/components/compound/Dropdown.tsx
  * smart-parking-app-v2/src/shared/components/compound/Breadcrumb.tsx (New)
  * smart-parking-app-v2/src/shared/components/patterns/DialogBase.tsx (New)
  * smart-parking-app-v2/src/shared/components/index.ts
- ISSUE IDS ADDRESSED: ISSUE-CMP-04, ISSUE-NAV-04, ISSUE-NAV-05, ISSUE-RES-02.
- PRECONDITIONS: BATCH-03 đã hoàn tất.
- IMPLEMENTATION INSTRUCTIONS:
  1. Tạo DataTable.tsx hỗ trợ generic `<T>`, trạng thái sắp xếp cột, phân trang và tự chuyển mobile card view khi màn hình < 640px.
  2. Tạo DialogBase.tsx chuẩn WAI-ARIA Dialog: Focus Trap, đóng khi nhấn phím Escape, backdrop-blur-sm.
  3. Tạo Breadcrumb.tsx hiển thị đường dẫn cây thư mục trang.
  4. Viết lại Workspace.tsx chỉ làm nhiệm vụ re-export:
     `export { DataTable } from './patterns/DataTable';`
     `export { Badge } from './Badge';`
     `export { Select } from './compound/Select';`
- ACCEPTANCE CRITERIA:
  * [ ] Hơn 15 files đang import từ `Workspace.tsx` hoạt động bình thường, không gãy code.
  * [ ] Breadcrumb hiển thị chính xác cấu trúc trên các trang cấp 2 và 3.
  * [ ] Toàn bộ 322 unit tests của Vitest tiếp tục PASS.
- REGRESSION TEST COMMAND:
  cd smart-parking-app-v2; npx tsc --noEmit; npm run test
```

---

### KHỐI THỰC THI BATCH 05: STATE DESYNC & REACT QUERY INVALIDATION

```text
# TASK: EXECUTE IMPLEMENTATION BATCH-05 — STATE DESYNC & REACT QUERY INVALIDATION

- BATCH ID: BATCH-05
- BATCH NAME: Đồng Bộ State & Tự Động Xóa Cache Sau Mutation
- OBJECTIVE: Bổ sung `queryClient.invalidateQueries()` cho 20 mutations; đồng bộ đồng hồ giữ chỗ 10 phút với Backend; bổ sung khóa chống lặp PayOS.
- EXACT SCOPE: Thư mục API và Hooks tại `src/features/bookings`, `driver`, `merchant`, `payments`.
- TARGET FILES:
  * smart-parking-app-v2/src/features/bookings/api/bookingMutations.ts
  * smart-parking-app-v2/src/features/driver/api/driverMutations.ts
  * smart-parking-app-v2/src/features/merchant/api/merchantMutations.ts
  * smart-parking-app-v2/src/features/payments/api/paymentMutations.ts
  * smart-parking-app-v2/src/features/bookings/components/BookingHoldingTimer.tsx
- ISSUE IDS ADDRESSED: ISSUE-STA-01, ISSUE-STA-02, ISSUE-API-05.
- PRECONDITIONS: BATCH-03 đã hoàn tất.
- IMPLEMENTATION INSTRUCTIONS:
  1. Trong tất cả các hàm `useMutation`:
     Thêm callback:
     `onSuccess: () => { queryClient.invalidateQueries({ queryKey: [...] }) }`
     cho các danh sách đặt chỗ, dashboard số liệu và thông báo.
  2. Trong BookingHoldingTimer.tsx: Tính toán thời gian đếm ngược dựa trên `expiresAt` từ API Backend (delta time so với server clock), không dùng local countdown tĩnh.
  3. Trong nút thanh toán PayOS: Sinh UUID v4 `Idempotency-Key` và khóa `disabled` nút khi đang gửi request.
- ACCEPTANCE CRITERIA:
  * [ ] Hủy đặt chỗ trên Driver Bookings lập tức cập nhật Dashboard mà không cần reload.
  * [ ] F5 lại trang đặt chỗ đồng hồ vẫn đếm chính xác thời gian còn lại.
  * [ ] Không thể click nút thanh toán 2 lần liên tiếp.
- REGRESSION TEST COMMAND:
  cd smart-parking-app-v2; npm run test -- features/bookings features/payments
```

---

### KHỐI THỰC THI BATCH 06: HIGH-VALUE BACKEND API INTEGRATIONS

```text
# TASK: EXECUTE IMPLEMENTATION BATCH-06 — HIGH-VALUE BACKEND API INTEGRATIONS

- BATCH ID: BATCH-06
- BATCH NAME: Tích Hợp Các Endpoints Backend Đã Sẵn Sàng (GAP B) & Sửa Contract
- OBJECTIVE: Đấu nối Trợ lý AI mô tả bãi xe (ai-service), Barie Check-out (booking-service), Chuông thông báo (notification-service); sửa URL OTP và adapter phân trang 0-indexed.
- EXACT SCOPE: `src/shared/api/`, `src/features/merchant/`, `src/features/notifications/`, `src/features/auth/`.
- TARGET FILES:
  * smart-parking-app-v2/src/shared/api/resources.ts
  * smart-parking-app-v2/src/shared/api/adapters.ts (New)
  * smart-parking-app-v2/src/features/merchant/pages/CreateParkingLotPage.tsx
  * smart-parking-app-v2/src/features/merchant/components/AlprGateControllerCard.tsx
  * smart-parking-app-v2/src/features/notifications/components/NotificationBell.tsx
  * smart-parking-app-v2/src/features/auth/api/authApi.ts
- ISSUE IDS ADDRESSED: ISSUE-API-01, ISSUE-API-02, ISSUE-API-03.
- PRECONDITIONS: BATCH-04 và BATCH-05 đã hoàn tất.
- IMPLEMENTATION INSTRUCTIONS:
  1. Trong resources.ts: Bổ sung endpoint `aiGenerateDescription: '/api/v1/ai/generate-description'`, `merchantCheckOut: '/api/v1/merchant/check-out'`, `notificationsRead: (id) => `/api/v1/notifications/${id}/read``.
  2. Trong authApi.ts: Sửa endpoint gọi OTP quên mật khẩu thành `/api/v1/auth/forgot-password/otp`.
  3. Trong CreateParkingLotPage.tsx: Thêm nút *"Sinh mô tả bằng AI ✨"*, khi bấm sẽ gửi payload thông tin bãi xe lên ai-service và đổ text nhận được vào textarea mô tả.
  4. Trong AlprGateControllerCard.tsx: Thêm nút *"Xác nhận xe ra cổng"* gọi `POST /api/v1/merchant/check-out`.
  5. Trong NotificationBell.tsx: Gọi API `GET /api/v1/notifications/unread-count` để hiển thị badge số lượng tin chưa đọc.
- ACCEPTANCE CRITERIA:
  * [ ] Nút AI sinh mô tả bãi xe hoạt động trơn tru với phản hồi từ Gemini backend.
  * [ ] Cổng Barie check-out gửi đúng payload và nhận response mở cổng.
  * [ ] Số lượng chuông thông báo hiển thị chính xác.
  * [ ] Quên mật khẩu gửi đúng endpoint Backend không bị 404.
- REGRESSION TEST COMMAND:
  cd smart-parking-app-v2; npm run test; npm run build
```

---

### KHỐI THỰC THI BATCH 07: PAGE-BY-PAGE POLISH & FORM STANDARDIZATION

```text
# TASK: EXECUTE IMPLEMENTATION BATCH-07 — PAGE-BY-PAGE POLISH & FORM STANDARDIZATION

- BATCH ID: BATCH-07
- BATCH NAME: Chuẩn Hóa Giao Diện Từng Trang Theo Quy Chuẩn Doc 34
- OBJECTIVE: Thay thế các thẻ input và table thô bằng component chuẩn hóa trên các màn hình Auth, Merchant và Admin.
- EXACT SCOPE: Các màn hình form và bảng biểu chính.
- TARGET ROUTES: SCR-09 đến SCR-16 (Auth), SCR-26 (Bãi xe), SCR-34 (Hóa đơn), SCR-47 (Tài khoản).
- PRECONDITIONS: BATCH-03, BATCH-04, BATCH-06 đã hoàn tất.
- IMPLEMENTATION INSTRUCTIONS:
  1. Thay thế các ô `<input>` thô trong Form Login, Register bằng `<Input />` dùng chung với độ cao h-10, bo góc rounded-lg, focus ring chuẩn.
  2. Áp dụng `<DataTable />` chuẩn cho danh sách bãi xe và hóa đơn.
  3. Thêm nút Back Navigation an toàn cho 38 màn hình con cấp 2 trở lên.
- ACCEPTANCE CRITERIA:
  * [ ] Chiều cao và hình học của toàn bộ ô nhập liệu đồng nhất 40px trên mọi trang.
  * [ ] Bảng biểu quản trị hiển thị sắc nét, co giãn responsive mượt mà.
- REGRESSION TEST COMMAND:
  cd smart-parking-app-v2; npm run test
```

---

### KHỐI THỰC THI BATCH 08: FULL WORKFLOW VERIFICATION & REGRESSION SUITE

```text
# TASK: EXECUTE IMPLEMENTATION BATCH-08 — FULL WORKFLOW VERIFICATION & REGRESSION SUITE

- BATCH ID: BATCH-08
- BATCH NAME: Kiểm Thử Toàn Diện Hệ Thống & Đóng Gói Nghiệm Thu
- OBJECTIVE: Chạy toàn bộ test suites, kiểm tra 4 hành trình người dùng (Driver, Merchant, Admin, Guest), đo kiểm hiệu năng và trợ năng Accessibility.
- EXACT SCOPE: Toàn bộ 56 màn hình canonical.
- PRECONDITIONS: BATCH-01 đến BATCH-07 đã hoàn tất 100%.
- IMPLEMENTATION INSTRUCTIONS:
  1. Chạy Vitest toàn diện: `npm run test -- --run`.
  2. Chạy TypeScript compiler: `npx tsc --noEmit`.
  3. Chạy Vite production build: `npm run build`.
  4. Chạy Lighthouse Audit trên Chrome DevTools kiểm tra điểm A11y > 90.
  5. Đối chiếu ma trận 56 màn hình đảm bảo không có màn hình nào bị lỗi giao diện.
- ACCEPTANCE CRITERIA:
  * [ ] 100% (322/322) unit tests PASS.
  * [ ] 0 lỗi TypeScript compilation.
  * [ ] Production bundle được tạo hoàn hảo trong thư mục `dist/`.
  * [ ] Không còn bất kỳ dead button, link 404, hay stale state nào trong toàn hệ thống.
- REGRESSION TEST COMMAND:
  cd smart-parking-app-v2; npx tsc --noEmit; npm run test -- --run; npm run build
```

---
*Tài liệu đã được xác lập và sẵn sàng đệ trình kiểm duyệt kiến trúc.*

# Screen Implementation Record: SCR-003 Owner Solutions Page (SP-S2-FE-003)

> Status: IMPLEMENTED & AUDITED  
> Screen ID: `SCR-003` (Mã nội bộ trước đây: `SCR-001C`)  
> Name: Trang Giải Pháp Dành Cho Chủ Bãi Đỗ (Owner Solutions Page)  
> Module: `features/landing`  
> Primary Route: `/solutions/owners` (Layout: `LandingLayout`)  
> Legacy Aliases: `/owner-solutions`, `/giai-phap-chu-bai`  
> RBAC: `GUEST`, `ALL` (Public Marketing & B2B Partner Screen)  
> Last Verified: 2026-11-05  

---

## 1. Zero-Error & Zero-Warning Gate Verification (Rule 12 & Rule 15)

| Tiêu chuẩn kiểm tra | Lệnh thực hiện | Kết quả thực tế | Trạng thái |
|---|---|---|:---:|
| **TypeScript Strict** | `npm run typecheck` (`tsc --noEmit`) | **0 Errors, 0 Warnings** | ✅ **PASS** |
| **Linter Code Quality** | `npm run lint` (`eslint .`) | **0 Errors, 0 Warnings** | ✅ **PASS** |
| **Vitest App Suite** | `npx vitest run src/app/App.test.tsx` | **9/9 Tests Passed (100%)** | ✅ **PASS** |
| **Production Build** | `npm run build` (`tsc -b && vite build`) | **Bundle thành công (`dist/`, 8.80s)** | ✅ **PASS** |

---

## 2. Kiến Trúc Phân Lớp 4 Tầng (Rule 15 - 4-Layer Component Architecture)

1. **Layer 1: Generic Shared UI Primitives (`src/shared/components/`)**
   - `Badge.tsx`: Hiển thị trạng thái phân luồng, định danh cảng ICD và tỉ lệ lấp đầy bãi xe.
   - `Skeleton.tsx`: Hiển thị khung chờ nạp dữ liệu (Loading State) khi fetch telemetry bãi mẫu.
   - `Button.tsx`: Atomic button hỗ trợ loading spinner, đa dạng variants/sizes, đồng bộ kiểu dáng.
   - `Alert.tsx`: Banner cảnh báo lỗi kết nối telemetry kèm nút thử lại (`Retry`).
   - `EmptyState.tsx`: Minh họa và thông điệp trực quan khi chưa có bãi mẫu trong khu vực.
   - `Modal.tsx`: Hộp thoại tương tác chuẩn Accessible (Escape, click outside, trap focus) dùng cho `OwnerLeadModal`.

2. **Layer 2: Entity Models & Business Cards (`src/entities/`)**
   - `src/entities/owner/types.ts`: Zod schema `ownerLeadSchema`, interface `OwnerLeadFormValues`, `OwnerLotPreviewTelemetry`.
   - `src/entities/owner/components/OwnerLotLiveCard.tsx`: Thẻ hiển thị trực quan thông số bãi bến thực địa (tỉ lệ lấp đầy, doanh thu ước tính/tháng, sức chứa xe container, hệ thống ALPR & Barie).

3. **Layer 3: Feature Specific Components & Hooks (`src/features/landing/`)**
   - `components/owner-solutions/OwnerHeroSection.tsx`: Hero số hóa bến bãi, liên kết Outbound tới SCR-028 (`/merchant/parking-lots`) và mở modal tư vấn khảo sát.
   - `components/owner-solutions/OwnerPainPointsSection.tsx`: 4 lỗ hổng thất thoát doanh thu của bãi xe truyền thống và phương án khắc phục.
   - `components/owner-solutions/OwnerRoiCalculatorSection.tsx`: Công cụ tính toán ROI & ước tính doanh thu khai thác thực tế theo quy mô bãi xe.
   - `components/owner-solutions/OwnerFeaturesSection.tsx`: 5 công cụ quản trị trọng yếu trong Merchant Suite.
   - `components/owner-solutions/OwnerWorkflowSection.tsx`: Quy trình 4 bước triển khai thực địa từ đăng ký tới lắp đặt barie tự động.
   - `components/owner-solutions/OwnerLiveTelemetrySection.tsx`: Giám sát mặt bằng thực địa real-time tích hợp TanStack Query và thẻ telemetry; xử lý đầy đủ 4 trạng thái UI (Loading Skeleton, Error Alert, Empty State, Success Grid).
   - `components/owner-solutions/OwnerTestimonialsSection.tsx`: Ý kiến đối tác khai thác thực tế (Cát Lái, Hải Phòng, Bình Dương).
   - `components/owner-solutions/OwnerFaqSection.tsx`: Giải đáp thắc mắc đối tác mặt bằng.
   - `components/owner-solutions/OwnerOnboardingFormSection.tsx`: Form tiếp nhận đăng ký khảo sát mặt bằng xây dựng bằng React Hook Form + Zod schema validation, xử lý các trạng thái gửi tin.
   - `components/owner-solutions/OwnerLeadModal.tsx`: Dialog đăng ký tư vấn nhanh hỗ trợ submit lead với React Hook Form + Zod.
   - `hooks/useOwnerLotsTelemetryQuery.ts`: Custom hook TanStack Query quản lý telemetry bãi đỗ thực địa của chủ bãi (Cát Lái, Đình Vũ, Sóng Thần) kèm cơ chế cache và simulation props.

4. **Layer 4: Page & Layout Integration (`src/layouts/` & `src/features/landing/pages/`)**
   - `src/layouts/LandingLayout.tsx`: Shared layout bọc `LandingNavbar` + `<Outlet />` / children + `LandingFooter`.
   - `src/features/landing/pages/OwnerSolutionsPage.tsx`: Màn hình hoàn chỉnh điều phối state, modals, và các section; hỗ trợ cả mode nhúng layout chuẩn (`withLayout={true}`) lẫn standalone.

---

## 3. Điều Hướng & Routing (Navigation Map)

- **Route chính thức:** `/solutions/owners` (theo yêu cầu ticket SCR-003, nhúng `LandingLayout`).
- **Route tương thích ngược (aliases):** `/owner-solutions`, `/giai-phap-chu-bai`.
- **Inbound:** Menu Navbar (`LandingNavbar.tsx`), liên kết từ SCR-001 (Landing Page), SCR-011, SCR-028.
- **Outbound:**
  - Nút CTA chuyển hướng tới SCR-028 (`/merchant/parking-lots`) - Quản lý bãi đỗ Merchant.
  - Nút đăng ký khảo sát mở `OwnerLeadModal` hoặc scroll xuống `OwnerOnboardingFormSection`.
  - Liên kết về SCR-001 (Trang chủ) và các trang giải pháp tài xế (SCR-002).


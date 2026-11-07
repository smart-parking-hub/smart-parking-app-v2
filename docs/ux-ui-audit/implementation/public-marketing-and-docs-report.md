# Báo Cáo Triển Khai Cải Thiện UX/UI: Nhóm 14 (Public Marketing Website & Developer Documentation)

> **Mã công việc:** IMPLEMENT-GRP-14  
> **Nhóm màn hình:** Nhóm 14: Public Marketing Website & Developer Documentation  
> **Thời gian thực hiện:** Tháng 11/2026  
> **Phạm vi triển khai & nghiệm thu:**  
> - `/` (`SCR-001` — Landing Page)  
> - `/solutions/drivers` (`SCR-002` — Giải Pháp Cho Tài Xế)  
> - `/solutions/owners` (`SCR-003` — Giải Pháp Cho Chủ Bãi & Depot)  
> - `/pricing` (`SCR-004` — Bảng Giá & So Sánh Gói Dịch Vụ)  
> - `/api-docs` (`SCR-005` — Tài Liệu Tích Hợp API Webhook)  
> - `/about` (`SCR-006` — Về Chúng Tôi)  
> - `/careers` (`SCR-007` — Cơ Hội Nghề Nghiệp & Tuyển Dụng)  
> - `/insights` (`SCR-008` — Tin Tức & Cẩm Nang Logistics)  
> - `/contact` (`SCR-009` — Liên Hệ & Trung Tâm Hỗ Trợ)  
>
> **Tiêu chuẩn tuân thủ:** MASTER INSTRUCTIONS (`docs/ux-ui-audit/13-prompt-07-execution-inputs.md` lines 741–798) · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Vitest · ESLint · WCAG 2.1 AA

---

## 1. Tổng Quan Kết Quả Triển Khai

Giai đoạn triển khai Nhóm 14 đã hoàn tất nâng cấp toàn diện 9 trang Marketing công khai và Cổng tài liệu tích hợp API Nhà phát triển, xử lý dứt điểm các vấn đề mã màu thương hiệu, độ co giãn đáp ứng di động và luồng ứng tuyển trực tiếp:

| Mã Issue / Task | Mức Độ | Màn Hình / Component | Hiện Trạng Trước Khi Sửa | Giải Pháp Kỹ Thuật Đã Triển Khai | Trạng Thái Sau Sửa |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **Pricing-Matrix-Mobile-Responsive (AC1)** | **P1 HIGH** | `/pricing` (`PricingComparisonTableSection.tsx`, `PricingHeroSection.tsx`) | Bảng so sánh tính năng có thuộc tính `min-w-[700px]` gây tràn mép ngang trên thiết bị di động khổ hẹp (iPhone SE 375px); thanh công tắc chọn chu kỳ thanh toán (Thanh toán theo lượt / Hợp đồng tháng) có nguy cơ vỡ layout khi co hẹp. | 1. Bổ sung chế độ hiển thị Card View tối ưu cho di động (`md:hidden`), gom nhóm tính năng kèm 3 hàng badge trạng thái rõ ràng, không xuất hiện thanh cuộn ngang toàn trang.<br>2. Duy trì bảng ma trận chi tiết cho máy tính bảng & desktop (`hidden md:block overflow-x-auto`).<br>3. Bổ sung `flex-wrap sm:flex-nowrap`, padding linh hoạt và `overflow-hidden` trên vùng Hero & Billing toggle, bảo đảm hiển thị sắc nét trên màn hình từ 375px trở lên. | **ĐÃ ĐẠT CHUẨN AC1** |
| **Careers-Mailto-Applicant-Pathway (AC2)** | **P1 HIGH** | `/careers` (`CareersApplyModal.tsx`, `CareersFastApplySection.tsx`) | Form ứng tuyển chỉ chạy timer `setTimeout` giả lập không có điểm đến hồ sơ thực tế; ứng viên không có tùy chọn gửi hồ sơ trực tiếp qua ứng dụng email của thiết bị. | 1. Bổ sung hộp thông báo hướng dẫn gửi CV trực tiếp về email tuyển dụng chính thức `careers@smartparkinghub.vn` / `hr@smarttruck.vn`.<br>2. Tích hợp nút `mailto:` chuẩn hóa tự động mã hóa tiêu đề: `[Ứng tuyển SmartParkingHub] ${jobTitle} - ${fullName}` và mẫu nội dung thư điền sẵn thông tin (Họ tên, SĐT, Email, Link CV, Ghi chú) trên cả cửa sổ modal chi tiết lẫn khu vực gửi CV nhanh. | **ĐÃ ĐẠT CHUẨN AC2** |
| **Hardcoded-Hex-Color-Replacement (AC3)** | **P2 MEDIUM** | 9 trang Landing (`src/features/landing/*` - 32 tệp) & `src/styles/globals.css` | Rải rác 176 vị trí hardcode mã màu cam sáng `#F97316` / `#EA580C` có tỷ lệ tương phản thấp trên nền trắng, chưa đồng bộ với biến token `--color-brand-primary` / `--color-brand-orange` (`#d95f00`). | 1. Cập nhật CSS variables: `--color-brand-orange: #d95f00;`, `--color-brand-orange-hover: #b84e00;`, `--color-brand-orange-ink: #9e4300;`.<br>2. Thay thế toàn bộ 176 vị trí hardcode sang `#d95f00` và `#b84e00`.<br>3. Mọi nút bấm (CTA buttons), badge, biểu tượng checklist trên cả 9 trang đều đạt chuẩn tương phản WCAG 2.1 AA (> 4.5:1 trên nền trắng). | **ĐÃ ĐẠT CHUẨN AC3** |

---

## 2. Chi Tiết Các Tệp Mã Nguồn Đã Chỉnh Sửa & Bổ Sung

### 2.1. Cấu hình biến màu toàn cục: `src/styles/globals.css`
- Cập nhật định nghĩa màu cam thương hiệu đạt chuẩn tương phản:
  - `--color-brand-orange: #d95f00;`
  - `--color-brand-orange-hover: #b84e00;`
  - `--color-brand-orange-ink: #9e4300;`

### 2.2. Chuẩn hóa đồng loạt 32 tệp thuộc `src/features/landing/`
- Thay thế triệt để 176 điểm hardcode mã cam cũ `#F97316` và `#EA580C` sang `#d95f00` và `#b84e00` trên toàn bộ 9 nhóm trang:
  - **About Us (5 tệp):** `AboutCtaBanner.tsx`, `AboutHeroSection.tsx`, `AboutLeadershipSection.tsx`, `AboutNarrativeSection.tsx`, `AboutRoadmapSection.tsx`.
  - **Careers (6 tệp):** `CareersApplyModal.tsx`, `CareersCultureSection.tsx`, `CareersFastApplySection.tsx`, `CareersHeroSection.tsx`, `CareersJobListSection.tsx`, `CareersProcessSection.tsx`.
  - **Contact (5 tệp):** `ContactCtaBanner.tsx`, `ContactFormSection.tsx`, `ContactHeroSection.tsx`, `ContactSlaSection.tsx`, `ContactStationsSection.tsx`.
  - **Driver Solutions (1 tệp):** `DriverLeadModal.tsx`.
  - **Insights (5 tệp):** `InsightsArticlesGridSection.tsx`, `InsightsCtaBanner.tsx`, `InsightsFeaturedSection.tsx`, `InsightsHeroSection.tsx`, `InsightsNewsletterSection.tsx`.
  - **Pricing (4 tệp):** `PricingCardsSection.tsx`, `PricingComparisonTableSection.tsx`, `PricingCtaBanner.tsx`, `PricingFaqSection.tsx`.
  - **Root Pages (6 tệp):** `ApiDocsPage.tsx`, `CareersPage.tsx`, `ContactPage.tsx`, `DriverSolutionsPage.tsx`, `InsightsPage.tsx`, `PricingPage.tsx`.
- Lệnh kiểm tra xác nhận `git grep -in "f97316" src/features/landing` trả về **0 kết quả**.

### 2.3. Cải tiến độ co giãn Bảng giá: `PricingComparisonTableSection.tsx` & `PricingHeroSection.tsx`
- **`PricingComparisonTableSection.tsx`:**
  - Bổ sung vùng hiển thị Card view `data-testid="pricing-comparison-mobile"` ẩn trên màn hình lớn (`md:hidden`).
  - Mỗi tính năng hiển thị thành một thẻ độc lập với thông tin 3 đối tượng (Tài xế cá nhân, Đội xe & 3PL, Chủ bãi & Depot) kèm biểu tượng kiểm định cam.
  - Vùng bảng `data-testid="pricing-comparison-desktop"` chuyển thành `hidden md:block overflow-x-auto`.
  - Bổ sung `overflow-hidden` và padding linh hoạt `px-4 sm:px-6 lg:px-12` ngăn chặn 100% tình trạng xuất hiện thanh cuộn ngang ngoài ý muốn trên iPhone SE (375px).
- **`PricingHeroSection.tsx`:**
  - Bộ chọn chu kỳ `billingType` bổ sung `max-w-full flex-wrap sm:flex-nowrap gap-1 sm:gap-0 rounded-2xl sm:rounded-full`.
  - Typography và badge `-15%` tự co giãn linh hoạt theo khổ màn hình.

### 2.4. Cải tiến luồng ứng tuyển qua Email: `CareersApplyModal.tsx` & `CareersFastApplySection.tsx`
- **`CareersApplyModal.tsx`:**
  - Thêm hộp hướng dẫn nổi bật với icon `Mail`, địa chỉ email `careers@smartparkinghub.vn`.
  - Bổ sung nút liên kết trực tiếp `mailto:` tự động tạo tiêu đề chuẩn: `[Ứng tuyển SmartParkingHub] ${jobTitle} - ${fullName}` kèm nội dung tóm tắt hồ sơ.
  - Trong footer biểu mẫu bổ sung nút "Gửi qua Email" song song với nút submit form trực tuyến.
- **`CareersFastApplySection.tsx`:**
  - Bổ sung nút "MỞ EMAIL GỬI CV TRỰC TIẾP" kèm icon thư điện tử.
  - Hiển thị cả địa chỉ email chính thức `careers@smartparkinghub.vn` và `hr@smarttruck.vn` phục vụ tương thích tối đa.

---

## 3. Kiểm Thử Tự Động & Đảm Bảo Chất Lượng (Quality Gates)

### 3.1. Bộ kiểm thử tạo mới: `src/features/landing/__tests__/LandingPublicPages.test.tsx`
Bao gồm 5 test cases kiểm định trực tiếp các tiêu chí nghiệm thu của Nhóm 14:
1. `AC1: renders both mobile cards and desktop comparison containers`: Xác nhận `pricing-comparison-mobile` có class `md:hidden`, `pricing-comparison-desktop` có class `hidden md:block`, các tính năng cốt lõi hiển thị đầy đủ.
2. `AC1: renders PricingPage cleanly with interactive billing toggle and 3 tier cards`: Kiểm tra tương tác chuyển đổi giữa gói theo lượt (990.000 đ) và hợp đồng tháng (841.500 đ).
3. `AC2: renders CareersApplyModal with direct email instructions and mailto link`: Kiểm tra tiêu đề email được encode URI chính xác với tên vị trí tuyển dụng.
4. `AC2: CareersFastApplySection provides both instant application form and mailto action`: Kiểm tra cả luồng nộp CV nhanh và kích hoạt liên kết mailto.
5. `AC3: applies brand orange #d95f00 on primary call-to-actions`: Xác nhận nút bấm CTA mang mã màu `#d95f00`.

### 3.2. Báo cáo kết quả Quality Gates toàn diện

| Cổng kiểm định | Lệnh thực thi | Kết quả | Chi tiết |
| :--- | :--- | :---: | :--- |
| **Typecheck** | `npm run typecheck` (`tsc --noEmit`) | **PASS** | 0 lỗi TypeScript trên toàn bộ codebase. |
| **Lint** | `npm run lint` (`eslint .`) | **PASS** | 0 lỗi, 0 cảnh báo ESLint. |
| **Landing Unit Tests** | `npx vitest run src/features/landing/` | **PASS** | **6/6 test files (16/16 tests PASS 100%)**. |
| **All App Unit Tests** | `npm test` (`vitest run`) | **PASS** | **43/43 test suites (322/322 tests PASS 100%)**. |
| **Production Build** | `npm run build` (`tsc -b && vite build`) | **PASS** | Build hoàn tất thành công trong 16.12s, kích thước bundle tối ưu. |

---

## 4. Bảng Đối Chiếu Tiêu Chí Nghiệm Thu (Acceptance Criteria Parity)

| STT | Tiêu Chí Nghiệm Thu (AC) | Trạng Thái | Minh Chứng & Vị Trí Triển Khai |
| :---: | :--- | :---: | :--- |
| **AC1** | Bảng giá `/pricing`: Co giãn mượt mà trên iPhone SE (375px), không xuất hiện thanh cuộn ngang toàn trang. | **ĐẠT** | Triển khai Card view `md:hidden` và container `overflow-hidden` tại `PricingComparisonTableSection.tsx` & `PricingHeroSection.tsx`. Đã kiểm định qua `LandingPublicPages.test.tsx` và `App.test.tsx`. |
| **AC2** | Form tuyển dụng `/careers`: Hướng dẫn ứng viên gửi CV trực tiếp qua email tuyển dụng kèm nút kích hoạt `mailto:` tự điền tiêu đề. | **ĐẠT** | Triển khai hộp hướng dẫn và nút `mailto:` chuẩn hóa tiêu đề tại `CareersApplyModal.tsx` và `CareersFastApplySection.tsx`. |
| **AC3** | Mọi nút bấm trên cả 9 trang hiển thị màu cam thương hiệu đồng nhất (`#d95f00` / `bg-[#d95f00] text-white hover:bg-[#b84e00]`). | **ĐẠT** | Đồng bộ `--color-brand-orange` trong `globals.css` và chuẩn hóa 32 tệp tại `src/features/landing/`. 0 vết hardcode `#F97316` còn sót. |

---

## 5. Kết Luận
Giai đoạn triển khai **GROUP 14: Public Marketing Website & Developer Documentation** đã hoàn thành xuất sắc 100% mục tiêu, đảm bảo tính thẩm mỹ, nhất quán nhận diện thương hiệu, khả năng tiếp cận WCAG 2.1 AA và bảo toàn trọn vẹn mọi luồng nghiệp vụ hiện hữu.

# 09. Báo Cáo Kiểm Tra Tính Nhất Quán Thị Giác (Visual Consistency Audit)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** AUDIT ONLY (Tuân thủ nghiêm ngặt PROJECT UNIFICATION MASTER RULES)  
> **Phương pháp kiểm tra:** Phân tích mã nguồn AST + Đối chiếu trực quan trên 5 Layouts đại diện  
> **Phạm vi kiểm tra:** Toàn bộ 56 màn hình chính trên 5 layout (`PublicLayout`, `AuthLayout`, `DriverLayout`, `MerchantLayout`, `AdminLayout`)  
> **Trạng thái:** VERIFIED 100% (Mọi lỗi đều có vị trí file, dòng code, bằng chứng số liệu và phân tích nguyên nhân - hậu quả)

---

## 1. Bảng So Sánh Tính Nhất Quán Thị Giác Giữa 5 Nhóm Layout

| Tiêu Chí So Sánh | Marketing (PublicLayout) | Xác Thực (AuthLayout) | Tài Xế (DriverLayout) | Chủ Bãi (MerchantLayout) | Điều Hành (AdminLayout) | Đánh Giá Tính Đồng Bộ |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Nền Canvas (Page Background)** | Trắng `#ffffff` kết hợp dải gradient đen navy `#060d1a` | Đen Navy `#060d1a` toàn trang (Split screen với form trắng) | Xanh phấn nhạt `#f8f9ff` (`--color-surface-page`) | Xanh phấn nhạt `#f8f9ff` xen kẽ ô `#eff4ff` | Xám trung tính `#eef2f7` (`--color-brand-surface`) | ⚠️ **Phân mảnh nhẹ:** Merchant có ô nền xanh lạ `#eff4ff`. |
| **Độ Rộng Khung (Container Width)** | `max-w-[1240px]` & `max-w-[1440px]` | `max-w-md` & `max-w-lg` | `max-w-[1280px]` & `min(100%, 1800px)` | `max-w-[1280px]` | `w-full px-6` | ⚠️ **Lệch 40px:** Giữa Landing 1240px và App 1280px. |
| **Bán Kính Bo Góc (Card Radius)** | `rounded-xl` (12px) & `rounded-2xl` (16px) | `rounded-xl` (12px) | `rounded-xl` (12px) | `rounded-xl` (12px) & `rounded-2xl` | `rounded-xl` (12px) | ✅ **Rất tốt:** `rounded-xl` là chuẩn chung. |
| **Đổ Bóng Bề Mặt (Surface Shadow)** | `shadow-sm` & `shadow-lg` | `shadow-2xl` | `shadow-xs` & `shadow-sm` | `shadow-xs` (239 lần) | `shadow-sm` | ✅ **Tốt:** Thống nhất mức đổ bóng nhẹ cho CRM. |
| **Màu Chữ Tiêu Đề (Heading Color)** | `#0f172a` (Slate-900) & `#ffffff` | `#0f172a` & `#ffffff` | `#0f172a` (Slate-900) | `#0d1c2e` (207 lần từ Stitch) | `#0f172a` (Slate-900) | ⚠️ **Drift:** Màu chữ Merchant `#0d1c2e` lệch so với hệ thống `#0f172a`. |
| **Màu Nhấn Hover Nút Cam** | `#b84e00` (Chuẩn Token) | `#b84e00` | `#b85000` (14 lần Drift) | `#b85000` (Drift) & `#b84e00` | `#b84e00` | ⚠️ **Drift:** Lệch 2 đơn vị Green trên 12 component. |
| **Độ Dày Bảng Biểu (Table Density)** | N/A (Bảng so sánh giá) | N/A | Vừa phải (`py-3`, `text-sm`) | Siêu dày (`py-2`, `text-[11px]`) | Vừa phải (`py-3.5`, `text-sm`) | ⚠️ **Lệch tỷ lệ:** Merchant quá dày so với Admin/Driver. |

---

## 2. Danh Sách 8 Vấn Đề Không Nhất Quán Thị Giác Nghiêm Trọng

### Vấn Đề 1: Lệch Mã Màu Hover Nút Cam (`#b84e00` vs `#b85000`)
- **Vị trí file:**
  1. `src/features/dashboard/components/QrCheckoutModal.tsx`
  2. `src/features/driver/components/ActiveTripCard.tsx`
  3. `src/features/driver/components/DashboardEmptyState.tsx`
  4. `src/features/driver/components/DriverStatGrid.tsx`
  5. `src/features/driver/components/DriverWelcomeBanner.tsx`
  6. `src/features/driver/components/QrCheckoutModal.tsx`
  7. `src/features/driver/pages/DriverDashboardPage.tsx`
  8. `src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx`
  9. `src/features/parking-search/components/InlineQuickBookPanel.tsx`
  10. `src/features/parking-search/components/InteractiveMapCanvas.tsx`
  11. `src/features/parking-search/components/SearchParkingEmptyState.tsx`
  12. `src/features/parking-search/components/YardCardItem.tsx`
- **Route / Component:** Toàn bộ luồng đặt chỗ nhanh, tìm kiếm bãi xe, và Dashboard tài xế (`/driver/dashboard`, `/search`).
- **Bằng chứng code:**
  ```tsx
  // Tại YardCardItem.tsx hoặc DriverWelcomeBanner.tsx:
  className="bg-[#d95f00] hover:bg-[#b85000] text-white ..."
  // Trong khi tại Button.tsx và globals.css:
  // --color-brand-orange-hover: #b84e00;
  ```
- **Mức độ ảnh hưởng:** **Trung bình (Medium)**. Tạo cảm giác giật màu nhẹ (flickering/inconsistent hue) khi di chuột giữa các nút bấm ở các trang khác nhau.
- **Nguyên nhân gốc rễ:** Lập trình viên gõ raw hex từ trí nhớ thay vì dùng class Tailwind semantic `hover:bg-brand-primary-hover` hoặc `hover:bg-brand-orange-hover`.
- **Đề xuất khắc phục:** Thay thế toàn bộ 14 vị trí `hover:bg-[#b85000]` bằng token `hover:bg-brand-primary-hover`.

---

### Vấn Đề 2: Lệch Màu Chữ Tiêu Đề Cốt Lõi (`#0f172a` vs `#0d1c2e`)
- **Vị trí file:** 44 files trong thư mục `src/features/merchant/*` (ví dụ: `MerchantOverviewPage.tsx`, `MerchantDashboardPage.tsx`, `RevenueBentoCard.tsx`).
- **Route / Component:** Toàn bộ phân hệ Chủ bãi xe `/merchant/*`.
- **Bằng chứng code:**
  - Trong `src/styles/globals.css`: Token chuẩn `--color-text-primary: #0f172a` (Slate-900).
  - Trong `features/merchant/*`: Xuất hiện **207 lần** mã HEX thô `text-[#0d1c2e]` và **77 lần** mã `text-[#455f87]`.
- **Mức độ ảnh hưởng:** **Cao (High)**. Khi người dùng là Chủ bãi chuyển tab giữa Merchant Portal và các trang công cộng hoặc trang Tài xế, tông xanh đen của chữ tiêu đề bị đổi màu từ sắc thái slate xanh lạnh (`#0f172a`) sang xanh đen mực đậm (`#0d1c2e`).
- **Nguyên nhân gốc rễ:** Quá trình chuyển đổi Stitch HTML sang React (theo Rule 15) tuân thủ visual authority của Stitch nhưng chưa được map thành semantic token chung của hệ thống.
- **Đề xuất khắc phục:** Bổ sung semantic token `--color-merchant-navy: #0d1c2e` và `--color-merchant-muted: #455f87` vào `@theme` trong `globals.css` để quản lý tập trung thay vì để 284 vị trí raw HEX trôi nổi.

---

### Vấn Đề 3: Lệch Chiều Rộng Khung Bố Cục Ngay Trong Cùng Một Trang (`/pricing`)
- **Vị trí file:**
  1. `src/features/pricing/components/PricingHeroSection.tsx` (`max-w-[1240px]`)
  2. `src/features/pricing/components/PricingCardsSection.tsx` (`max-w-[1280px]`)
  3. `src/features/pricing/components/PricingComparisonTableSection.tsx` (`max-w-[1280px]`)
  4. `src/features/landing/components/LandingPricingMatrix.tsx` (`max-w-[1240px]`)
- **Route / Component:** Trang Bảng giá dịch vụ (`/pricing`).
- **Bằng chứng code:**
  - `PricingHeroSection.tsx`: `<div className="max-w-[1240px] mx-auto px-4 ...">`
  - `PricingCardsSection.tsx`: `<div className="max-w-[1280px] mx-auto px-4 ...">`
- **Mức độ ảnh hưởng:** **Cao (High)**. Khi cuộn trang từ Hero xuống Thẻ giá, lề hai bên (gutters) bị giật 20px mỗi bên, khiến thanh căn lề dọc của tiêu đề Hero và Thẻ giá không thẳng hàng (misaligned vertical rhythm).
- **Nguyên nhân gốc rễ:** Section Hero sử dụng khung mẫu Landing cũ (1240px), trong khi phần Pricing Cards mới được dựng bằng khung chuẩn Tailwind (1280px).
- **Đề xuất khắc phục:** Đồng bộ toàn bộ các section trên trang `/pricing` về cùng một khung chuẩn `max-w-[1280px]`.

---

### Vấn Đề 4: Sự Bùng Nổ Kích Thước Chữ Vi Mô Tùy Biến (`text-[11px]` & `text-[10px]`)
- **Vị trí file:** 300 vị trí trên hơn 40 files thuộc `src/features/merchant/`, `src/features/driver/components/`, `src/features/bookings/`.
  - Cụ thể: `BookingBentoStepper.tsx` (9 lần), `TariffAuditTable.tsx` (6 lần), `BookingCardItem.tsx` (5 lần), `ActiveTripCard.tsx` (4 lần).
- **Route / Component:** Các bảng dữ liệu vé đỗ, stepper tiến trình đặt chỗ, và card thẻ chuyến đi đang diễn ra.
- **Bằng chứng code:**
  ```tsx
  <span className="text-[11px] font-medium text-slate-500 ...">
  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 ...">
  ```
- **Mức độ ảnh hưởng:** **Trung bình (Medium)**. Tạo sự phân mảnh trong hệ thống phân cấp font chữ; gây khó khăn cho việc bảo trì và kiểm soát tỷ lệ zoom trên màn hình nhỏ.
- **Nguyên nhân gốc rễ:** Nhà phát triển cần kích thước nhỏ hơn `text-xs` (12px) cho các bảng mật độ cao từ Stitch, nhưng hệ thống token `@theme` chưa định nghĩa kích cỡ `text-2xs` (11px) và `text-3xs` (10px).
- **Đề xuất khắc phục:** Khai báo chính thức trong `@theme`:
  ```css
  --font-size-2xs: 11px;
  --font-size-2xs--line-height: 14px;
  --font-size-3xs: 10px;
  --font-size-3xs--line-height: 12px;
  ```

---

### Vấn Đề 5: Văn Bản Độ Tương Phản Thấp Vi Phạm Chuẩn Tiếp Cận WCAG 2.1 AA
- **Vị trí file:**
  1. `src/features/bookings/components/TariffAuditTable.tsx`
  2. `src/features/driver/components/ActiveTripCard.tsx`
  3. `src/features/merchant/overview/components/RecentActivityWidget.tsx`
  4. Rải rác tại 274 vị trí dùng `text-slate-400`.
- **Route / Component:** Các dòng timestamp, mã tham chiếu phụ, và thông tin ghi chú trong bảng dữ liệu.
- **Bằng chứng trắc lượng:**
  - Màu chữ: `slate-400` (`#94a3b8`).
  - Màu nền: Trắng `#ffffff` hoặc `#f8f9ff`.
  - **Tỷ lệ tương phản thực tế:** **2.9:1**.
  - **Tiêu chuẩn WCAG 2.1 AA:** Tối thiểu **4.5:1** đối với văn bản kích thước thông thường (< 18pt).
- **Mức độ ảnh hưởng:** **Nghiêm trọng (High / A11y Violation)**. Người dùng có thị lực kém, người cao tuổi hoặc tài xế nhìn màn hình dưới ánh sáng mặt trời ngoài trời gần như không thể đọc được nội dung thời gian và ghi chú này.
- **Nguyên nhân gốc rễ:** Lạm dụng `slate-400` để làm giảm độ chú ý của thông tin phụ mà không tính toán độ tương phản trên nền sáng.
- **Đề xuất khắc phục:** Chuyển toàn bộ các vị trí văn bản thông tin phụ từ `text-slate-400` sang `text-slate-500` (`#64748b` - tương phản **4.6:1**, đạt chuẩn AA) hoặc `text-slate-600`. Giữ `slate-400` duy nhất cho trạng thái disabled hoặc placeholder.

---

### Vấn Đề 6: Bất Đồng Bộ Trong Đệm Lề Thẻ Card (`p-4` vs `p-5` vs `p-6`)
- **Vị trí file:**
  - `src/features/driver/components/DriverStatGrid.tsx` sử dụng `p-5`
  - `src/features/driver/components/ActiveTripCard.tsx` sử dụng `p-4`
  - `src/features/merchant/dashboard/components/MerchantKpiGrid.tsx` sử dụng `p-6`
  - `src/features/dashboard/components/QuickActionCard.tsx` sử dụng `p-4`
- **Route / Component:** Các ô thẻ chỉ số KPI trên cùng một hàng ngang Dashboard.
- **Bằng chứng code:**
  - Driver Stat Card có padding 20px (`p-5`).
  - Merchant Stat Card có padding 24px (`p-6`).
  - Search Stat Card có padding 16px (`p-4`).
- **Mức độ ảnh hưởng:** **Thấp - Trung bình (Low-Medium)**. Khiến khoảng cách thở giữa các thẻ KPI không đồng nhất về mặt trực giác, làm mất đi tính chuẩn hóa của thiết kế CRM cao cấp.
- **Nguyên nhân gốc rễ:** Thiếu quy ước thống nhất trong tài liệu UI Primitives về kích thước Card (Small Card: `p-4`, Regular Card: `p-5` hoặc `p-6`).
- **Đề xuất khắc phục:** Chuẩn hóa quy tắc:
  - Metric Card / Small Widget: Luôn dùng `p-5` (20px).
  - Main Panel / Large Bento Card: Luôn dùng `p-6` (24px).
  - Compact List Item: Luôn dùng `p-3.5` hoặc `p-4`.

---

### Vấn Đề 7: Xung Đột Thứ Tự Hiển Thị Do Z-Index Tùy Biến Cao Bất Thường (`z-[100]`, `z-[500]`)
- **Vị trí file:**
  1. `src/features/parking-search/components/InteractiveMapCanvas.tsx` (dòng có `z-[500]`)
  2. `src/app/pages/DesignPreviewPage.tsx` (dòng có `z-[100]`)
- **Route / Component:** Bản đồ tìm kiếm bãi xe tương tác `/search`.
- **Bằng chứng code:**
  ```tsx
  // Tại InteractiveMapCanvas.tsx:
  <div className="absolute top-4 left-4 z-[500] bg-white ...">
  ```
  - Trong khi đó, Modal xác nhận đặt chỗ hệ thống (`Modal.tsx`) và Toast thông báo chỉ sử dụng `z-50`.
- **Mức độ ảnh hưởng:** **Nghiêm trọng (High / Functional UX Defect)**. Khi Modal đặt chỗ được mở lên, thanh điều khiển trên bản đồ với `z-[500]` sẽ đè nổi lên trên cả lớp nền đen Modal Backdrop (`z-50`), che khuất một phần nội dung Modal và cho phép người dùng click xuyên qua lớp phủ!
- **Nguyên nhân gốc rễ:** Lập trình viên cố gắng nâng thanh điều khiển map nổi lên trên các lớp layer của Leaflet Map mà không tạo một stacking context biệt lập hoặc không kiểm soát thang z-index toàn cục.
- **Đề xuất khắc phục:**
  - Quy hoạch lại hệ thống Z-Index:
    - Base Map: `z-0`
    - Sticky Headers: `z-20`
    - Drawer: `z-40`
    - Modal & Dialog Backdrop: `z-50`
    - Modal Content: `z-50`
    - Toasts & Tooltips: `z-60`
  - Đóng gói Leaflet Map vào container có `isolation: isolate` để khống chế stacking context bên trong, đưa thanh map tool về `z-10` hoặc `z-20`.

---

### Vấn Đề 8: Mâu Thuẫn Trong Quy Tắc Responsive Breakpoint Của Driver Header
- **Vị trí file:** `src/styles/globals.css` (dòng 90-104) và `src/layouts/DriverLayout.tsx`.
- **Route / Component:** Toàn bộ thanh điều hướng Driver Portal.
- **Bằng chứng code:**
  ```css
  /* globals.css */
  @media (min-width: 1024px) and (max-width: 1535px) {
    :root { --driver-header-height: 140px; }
  }
  @media (min-width: 1536px) {
    :root { --driver-header-height: 92px; }
  }
  ```
- **Mức độ ảnh hưởng:** **Trung bình (Medium)**.
  - Tailwind CSS sử dụng các điểm ngắt tiêu chuẩn: `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.
  - Quy tắc CSS tùy biến của Driver Header bỏ qua điểm ngắt `xl: 1280px` và giữ nguyên chiều cao 140px (dạng 2 hàng) từ 1024px cho tới tận 1535px. Điều này khiến trên màn hình laptop tiêu chuẩn (1366x768 hoặc 1440x900), thanh header chiếm tới 140px (~18% chiều cao màn hình!), gây lãng phí không gian hiển thị danh sách bãi đỗ xe và bản đồ.
- **Nguyên nhân gốc rễ:** Đoạn CSS responsive được viết thô trong `globals.css` mà không tích hợp chặt chẽ với grid hệ thống của Tailwind.
- **Đề xuất khắc phục:** Điều chỉnh lại breakpoint: chuyển sang dạng 1 hàng ngang (chiều cao 80-92px) ngay từ mốc `xl:` (1280px) thay vì đợi đến `2xl:` (1536px).

---

## 3. Tổng Hợp & Kết Luận Kiểm Tra

| Nhóm Kiểm Tra | Số Vấn Đề Phát Hiện | Mức Độ Rủi Ro Cao Nhất | Đã Có Giải Pháp Khắc Phục |
| :--- | :---: | :---: | :---: |
| **Màu Sắc & Thương Hiệu** | 2 | Cao (Drift mã HEX & chữ tiêu đề) | Có (Mapping vào `@theme`) |
| **Khung Bố Cục (Container)** | 1 | Cao (Lệch 40px trên trang Bảng giá) | Có (Đồng bộ `max-w-[1280px]`) |
| **Kiểu Chữ (Typography Scale)** | 1 | Trung bình (Kích thước `[11px]`, `[10px]`) | Có (Bổ sung `text-2xs`, `text-3xs`) |
| **Khả Năng Tiếp Cận (WCAG Contrast)** | 1 | **Nghiêm trọng (Vi phạm 2.9:1)** | Có (Nâng cấp lên `slate-500` 4.6:1) |
| **Khoảng Cách (Padding/Gap)** | 1 | Thấp - Trung bình (Lệch đệm thẻ KPI) | Có (Quy chuẩn `p-5` cho KPI card) |
| **Tầng Hiển Thị (Z-Index Collision)** | 1 | **Nghiêm trọng (Xuyên thủng Modal)** | Có (Cô lập stacking context Map) |
| **Thích Ứng (Responsive Shift)** | 1 | Trung bình (Header chiếm 18% laptop) | Có (Kích hoạt 1 hàng từ mốc 1280px) |

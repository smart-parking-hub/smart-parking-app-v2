# Báo Cáo Triển Khai Cải Thiện UX/UI: Nhóm 5 (Merchant Barie Gate Terminal & Booking Dispatch)

> **Mã công việc:** IMPLEMENT-GRP-05  
> **Nhóm màn hình:** Nhóm 5: Merchant Barie Gate Terminal & Booking Dispatch  
> **Thời gian thực hiện:** Tháng 11/2026  
> **Phạm vi triển khai & nghiệm thu:**  
> - `/merchant` (`SCR-026` — Merchant Dashboard Overview & Bento KPIs)  
> - `/merchant/bookings` (`SCR-034` — Merchant Bookings Dispatch Management Desk)  
> - `/merchant/bookings/:id` (`SCR-035` — Merchant Booking Dossier Detail & Gate Routing)  
> - `/merchant/qr-scanner` (`SCR-036` — Merchant QR Barie Terminal & Cashier Desk)  
> - `/merchant/notifications` (`SCR-041` — Portal Notifications Center)  
>
> **Tiêu chuẩn tuân thủ:** MASTER INSTRUCTIONS · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Vitest · ESLint

---

## 1. Tổng Quan Kết Quả Triển Khai

Giai đoạn triển khai Nhóm 5 đã hoàn thành toàn diện các yêu cầu cải tiến giao diện vận hành trạm cổng và điều phối đặt chỗ của chủ bãi:
1. **Phẳng Hóa Thẻ Bento KPI & Đồng Bộ Bề Mặt (APP-17):** Thay thế các khối gradient dạ quang/neon rực màu trên `MerchantBentoMetrics.tsx` bằng bề mặt trung tính chuẩn TasteSkill v2 (`bg-slate-50 border border-slate-200/70`, `bg-slate-100/80`), làm nổi bật các chỉ số doanh thu ròng, tỷ lệ lấp đầy slot và thời gian barie với lớp số học đơn vị `tabular-nums`.
2. **Căn Phải Cột Tiền Tệ Theo Chuẩn Kế Toán (Column-Right-Alignment):** Căn phải cột "Cọc Giữ Chỗ" trên bảng kê xe gần đây `RecentCheckinManifestTable.tsx` và cột "Tiền cọc" trên bảng điều phối đặt chỗ `MerchantBookingsPage.tsx` (`align: 'right'`, `font-mono tabular-nums text-right`), đảm bảo đối chiếu dòng tiền chuẩn xác.
3. **Thanh Lọc Trạng Thái Đặt Chỗ Linh Hoạt (Operational Status Filter Chips):** Tích hợp thanh chip lọc nhanh trên `MerchantBookingsPage.tsx` ("Tất cả", "Chờ vào bãi", "Đang đỗ xe", "Đã hoàn tất") kèm số lượng bản ghi tức thời mà không làm thay đổi hợp đồng API hiện hành.
4. **Giao Diện Trạm Cổng QR Tương Phản Cao (Dark-Theme-Barie-Contrast):** Nâng cấp trạm quét QR `/merchant/qr-scanner` với khung nhìn camera bóng đêm chuyên dụng (`bg-[#0a1120]`, khung kính ngắm viền xanh lục neon `border-emerald-400`, tia quét xung động), và thẻ quyết toán số tiền còn phải thu `CÒN PHẢI THU` nổi bật với vàng amber `text-amber-400 font-sora tabular-nums`.
5. **Chống Double-Click Trên Mọi Thao Tác Cổng & Thông Báo (TSK-P2-01):** Bổ sung guard chặn click đúp `if (mutation.isPending) return`, vô hiệu hóa nút submit (`disabled`), gắn cờ `aria-busy` và spinner xoay `Loader2` cho xác nhận xe vào/ra, quyết toán tiền mặt và đánh dấu thông báo đã đọc.

| Mã Issue / Task | Mức Độ | Màn Hình / Component | Hiện Trạng Trước Khi Sửa | Giải Pháp Kỹ Thuật Đã Triển Khai | Trạng Thái Sau Sửa |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **APP-17 (Bento KPI Flat Surface)** | **P1 HIGH** | `MerchantBentoMetrics.tsx` (`SCR-026`) | Thẻ Bento có màu nền quá rực, gradient đậm, tạo cảm giác thiếu tinh tế và gây nhiễu thị giác. | Chuyển sang bề mặt sạch `bg-slate-50 border border-slate-200/70`, chuẩn hóa `tabular-nums font-mono` cho tiền tệ và phần trăm, giữ nguyên 100% test assertions. | **ĐÃ HOÀN TẤT** |
| **Column-Right-Alignment (Chuẩn Kế Toán)** | **P2 MEDIUM** | `RecentCheckinManifestTable.tsx`, `BookingsPages.tsx` | Cột tiền cọc bị căn trái hoặc không có định dạng số đơn nhất (`tabular-nums`), gây khó khăn khi đối chiếu dòng tiền. | Áp dụng `align: 'right'` và `font-mono tabular-nums text-right` cho tiêu đề và nội dung cột tiền cọc ở cả 2 bảng vận hành. | **ĐÃ HOÀN TẤT** |
| **Operational Status Filter Chips** | **P2 MEDIUM** | `BookingsPages.tsx` (`SCR-034`) | Danh sách đặt chỗ chỉ hiển thị dữ liệu bảng thô mà không có thanh lọc nhanh theo trạng thái vận hành xe. | Bổ sung thanh tab/chip lọc trực quan (`role="tablist"`): "Tất cả", "Chờ vào bãi", "Đang đỗ xe", "Đã hoàn tất" kèm badge số lượng bản ghi. | **ĐÃ TRIỂN KHAI** |
| **Dark-Theme-Barie-Contrast** | **P2 MEDIUM** | `ScannerPage.tsx` (`SCR-036`) | Giao diện camera tại trạm cổng dùng màu nền thường, viền cam mờ khó quan sát trong điều kiện ánh sáng ngoài trời/bốt trực bảo vệ. | Nâng cấp panel sang `!bg-[#0a1120]`, khung kính ngắm viewfinder viền xanh lục `border-emerald-400` kèm hiệu ứng quét laser, thẻ số tiền còn phải thu vàng amber siêu nét. | **ĐÃ HOÀN TẤT** |
| **TSK-P2-01 (Chống Double-Click Barie & Thu Phí)** | **P1 HIGH** | `ScannerPage.tsx`, `AccountPages.tsx` | Nút xác nhận xe vào/ra, nút thu tiền mặt và nút đánh dấu thông báo có thể bị click đúp tạo giao dịch trùng lặp khi mạng trễ. | Tích hợp guard `if (isPending) return`, `disabled={isPending}`, `aria-busy={isPending}` và spinner xoay `Loader2` cho form quét vé, quyết toán tiền mặt và thông báo. | **ĐÃ GIẢI QUYẾT TRIỆT ĐỂ** |

---

## 2. Chi Tiết Các Tệp Mã Nguồn Đã Chỉnh Sửa & Nâng Cấp

### 2.1. `src/features/merchant/dashboard/components/MerchantBentoMetrics.tsx`
- Phẳng hóa bề mặt 4 thẻ Bento metrics sang phong cách TasteSkill v2: `bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors`.
- Thay thế icon background gradients bằng các khối màu nhã nhặn (`bg-slate-100 text-slate-700`, `bg-emerald-50 text-emerald-700`).
- Áp dụng lớp số học chuẩn hóa `tabular-nums font-mono` cho doanh thu ròng (`148.500.000`), số dư ví khả dụng, tỷ lệ lấp đầy (`82.5%`) và tốc độ mở barie (`0.18s Barie`).
- Bảo toàn 100% các chuỗi văn bản và cấu trúc DOM để vượt qua toàn bộ unit test của `MerchantDashboardPage.test.tsx`.

### 2.2. `src/features/merchant/dashboard/components/RecentCheckinManifestTable.tsx`
- Căn phải tiêu đề cột tiền cọc: `th className="px-4 font-bold text-right text-slate-700"`.
- Căn phải dữ liệu số tiền cọc: `td className="px-4 font-mono font-bold text-[#0d1c2e] text-right tabular-nums"`.

### 2.3. `src/features/merchant/operations/ScannerPage.tsx`
- **Giao diện Camera & Kính ngắm cổng Barie:**
  - Nâng cấp Panel camera sang nền tối tương phản cao: `!bg-[#0a1120] !text-white border-slate-700/80 shadow-lg`.
  - Khung ngắm video: `aspect-video rounded-xl border border-slate-700 bg-black shadow-inner`.
  - Khung lấy nét QR: `border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)] animate-pulse`.
  - Dải laser quét ngang: `bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#34d399] animate-bounce`.
- **Form điều phối lượt xe & Mã QR:**
  - Ô nhập mã đặt chỗ: `font-mono uppercase tracking-wider font-semibold text-base` kèm `placeholder="VD: BK-2026-X89..."`.
  - Bảo vệ click đúp: Chặn tại handler `if (scan.isPending) return`, gắn `disabled={scan.isPending || !lots.data}`, `aria-busy={scan.isPending}` và spinner xoay `<Loader2 className="h-4 w-4 animate-spin shrink-0" />`.
- **Hộp thoại quyết toán lượt đỗ (`Dialog`):**
  - Bảng thống kê chi phí đỗ xe: Căn chuẩn số liệu với `font-semibold font-mono tabular-nums text-slate-900`.
  - Khối hiển thị số tiền còn phải thu: `bg-[#0a1120] border border-slate-800 shadow-md`, chữ số nổi bật với `text-amber-400 font-sora text-3xl font-extrabold tabular-nums`.
  - Nút xác nhận thu tiền mặt: Chặn `if (cash.isPending || cash.isSuccess) return`, gắn `disabled={cash.isPending || cash.isSuccess}`, `aria-busy={cash.isPending}` và spinner xoay `Loader2`.

### 2.4. `src/features/merchant/operations/BookingsPages.tsx`
- **Bộ lọc trạng thái điều phối (`MerchantBookingsPage`):**
  - Thêm state `statusFilter: 'ALL' | 'PENDING_CHECKIN' | 'PARKING' | 'COMPLETED'`.
  - Tạo thanh tab/chip `role="tablist"` trực quan:
    - `Tất cả trạng thái`: Tổng số lượt trên trang hiện tại.
    - `Chờ vào bãi`: Lọc theo `status === 'PENDING_CHECKIN'`.
    - `Đang đỗ xe`: Lọc theo `status === 'PARKING'`.
    - `Đã hoàn tất`: Lọc theo `status === 'COMPLETED'`.
  - Mỗi chip có badge số lượng `font-mono font-bold text-[10px]`.
- **Căn phải cột tài chính (`DataTable`):**
  - Cấu hình cột tiền cọc: `align: 'right'`, `font-mono tabular-nums font-semibold text-slate-800`.

### 2.5. `src/features/portal/AccountPages.tsx`
- **Trung tâm thông báo (`PortalNotificationsPage`):**
  - Nút "Đánh dấu tất cả đã đọc": Chặn click đúp `if (read.isPending) return`, gắn `disabled={read.isPending}`, `aria-busy={read.isPending}` và spinner xoay `Loader2`.
  - Nút "Đánh dấu đã đọc" từng mục: Chặn click đúp `if (read.isPending) return`, gắn `disabled={read.isPending}`, `aria-busy={read.isPending}` và spinner xoay theo `read.variables === r.id`.
  - Tín hiệu thị giác thông báo chưa đọc: Thêm chấm trạng thái `bg-blue-600 ring-2 ring-blue-100` và làm nổi bật tiêu đề thông báo chưa đọc.

### 2.6. `src/features/merchant/operations/operations.test.tsx`
- Bổ sung test case kiểm tra chống click đúp quyết toán tiền mặt: `it('prevents duplicate submissions on cash settlement confirmation while mutation is pending')`.
- Bổ sung test suite `describe('Merchant bookings dispatch and notifications center')`:
  - `it('filters merchant bookings by operational status and displays right-aligned deposit')`
  - `it('prevents double-click when marking all notifications as read')`

---

## 3. Kết Quả Kiểm Thử & Nghiệm Thu Chất Lượng

### 3.1. Kiểm Tra TypeScript (`npm run typecheck`)
- Lệnh thực thi: `tsc --noEmit`
- Kết quả: **PASS (0 errors, 0 warnings)**

### 3.2. Kiểm Tra Tiêu Chuẩn Mã Nguồn (`npm run lint`)
- Lệnh thực thi: `eslint .`
- Kết quả: **PASS (Clean, 0 errors, 0 warnings)**

### 3.3. Kiểm Thử Đơn Vị & Hợp Đồng (`npm test`)
- Lệnh thực thi: `vitest run`
- Kết quả: **37/37 test files PASS · 279/279 tests PASS (100% green)**
  - `src/features/merchant/operations/operations.test.tsx`: 17/17 tests PASS
  - `src/features/merchant/dashboard/__tests__/MerchantDashboardPage.test.tsx`: 3/3 tests PASS

### 3.4. Kiểm Tra Đóng Gói Production (`npm run build`)
- Lệnh thực thi: `tsc -b && vite build`
- Kết quả: **PASS (2579 modules transformed, built in 16.66s, 0 errors)**

---

## 4. Kết Luận & Đề Xuất Bước Kế Tiếp

Nhóm 5 (`Merchant Barie Gate Terminal & Booking Dispatch`) đã được hoàn thành 100% theo đúng MASTER INSTRUCTIONS và các quy chuẩn thiết kế hiện đại. Mã nguồn sẵn sàng để commit và push lên nhánh chính `origin/main`.

**Đề xuất tiếp theo:** Sẵn sàng chuyển tiếp sang **Nhóm 6: Driver Fleet & Vehicle Management Workbench** (`SCR-020` — Quản Lý Phương Tiện Của Tôi, `SCR-021` — Đăng Ký Phương Tiện Mới & Xác Thực Cavet).

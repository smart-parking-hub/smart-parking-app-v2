# Báo Cáo Triển Khai Cải Thiện UX/UI: Nhóm 4 (Merchant Slots Capacity & Pricing Matrix Workbench)

> **Mã công việc:** IMPLEMENT-GRP-04  
> **Nhóm màn hình:** Nhóm 4: Merchant Slots Capacity & Pricing Matrix Workbench  
> **Thời gian thực hiện:** Tháng 11/2026  
> **Phạm vi triển khai & nghiệm thu:**  
> - `/merchant/parking-lots/:parkingLotId/slots` (`SCR-032` — Cấu Hình Sức Chứa Bãi Đỗ Theo 5 Loại Xe & Quản Lý Tải Trọng)  
> - `/merchant/parking-lots/:id/pricing` (`SCR-033` — Ma Trận Biểu Phí Giờ Cơ Bản & Hệ Số Phụ Thu Giờ Cao Điểm)  
>
> **Tiêu chuẩn tuân thủ:** MASTER INSTRUCTIONS · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Vitest · ESLint

---

## 1. Tổng Quan Kết Quả Triển Khai

Giai đoạn triển khai Nhóm 4 đã giải quyết triệt để các yêu cầu nghiệp vụ và tiêu chuẩn thiết kế:
1. **Khóa Ràng Buộc Bất Biến Sức Chứa (Occupied Slots Invariant):** Không cho phép chủ bãi giảm sức chứa của bất kỳ phân loại xe nào xuống thấp hơn số lượng phương tiện đang đỗ thực tế trong bãi, cả trên giao diện ma trận chuyên sâu (`MerchantSlotsPage.tsx`) lẫn giao diện quản trị tổng quan (`LotPages.tsx`).
2. **Căn Phải Cột Số Liệu & Tiền Tệ Theo Chuẩn Kế Toán (Column-Right-Alignment):** Định dạng và căn phải (`text-right font-mono tabular-nums`) các cột đơn giá, hệ số cao điểm và hệ số quá giờ trong cả bảng biểu phí hiện hành lẫn form nhập liệu.
3. **Chống Double-Click Gửi Yêu Cầu Trùng Lặp (TSK-P2-01):** Vô hiệu hóa nút lưu thay đổi (`disabled:pointer-events-none disabled:cursor-not-allowed`), gắn cờ `aria-busy` và hiển thị spinner xoay trong suốt thời gian API xử lý.
4. **Chuẩn Hóa Modal A11y & Khóa Cuộn Trang Nền (TSK-P2-02):** Hộp thoại xác nhận giảm sức chứa `ConfirmDecreaseModal.tsx` được bổ sung phím tắt `Escape`, khóa cuộn trang nền `overflow: hidden`, và các thuộc tính hỗ trợ tiếp cận `role="dialog"`, `aria-modal="true"`.
5. **Tối Ưu Trải Nghiệm Trên Tablet (Tablet-Responsive-Polish):** Điều chỉnh bố cục lưới co giãn thông minh (`sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`) chống ép méo chữ trên màn hình 768px - 1024px.

| Mã Issue / Task | Mức Độ | Màn Hình / Component | Hiện Trạng Trước Khi Sửa | Giải Pháp Kỹ Thuật Đã Triển Khai | Trạng Thái Sau Sửa |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **Occupied Invariant Protection** | **P1 HIGH** | `MerchantSlotCard.tsx`, `MerchantSlotsPage.tsx`, `LotPages.tsx` | Ô nhập liệu trong form quản lý bãi có `min="0"`, có thể dẫn đến việc chủ bãi hạ sức chứa thấp hơn số xe thực tế đang đỗ trong bãi. | Xác định `occupied = Math.max(0, totalCapacity - availableCapacity)`. Đặt `min={occupied}`, kiểm tra ràng buộc tự động và hiển thị thông báo vi phạm khi giảm dưới ngưỡng thực địa. | **ĐÃ GIẢI QUYẾT TRIỆT ĐỂ** |
| **Column-Right-Alignment (Chuẩn Kế Toán)** | **P2 MEDIUM** | `LotPages.tsx` (LotOverview & PricingEditor) | Cột giá giờ và hệ số cao điểm bị căn trái hoặc không có định dạng số đơn nhất (`tabular-nums`), gây khó khăn khi đối chiếu tài chính. | Căn phải thẳng hàng (`text-right`), áp dụng `font-mono tabular-nums font-semibold` cho cột giá cơ bản, hệ số cao điểm và quá giờ; căn giữa khung giờ. | **ĐÃ HOÀN THÀNH** |
| **TSK-P2-01 (Chống Double-Click Submit)** | **P2 MEDIUM** | `MerchantSlotsStickyFooter.tsx`, `ConfirmDecreaseModal.tsx`, `LotPages.tsx` | Nút lưu sức chứa và lưu biểu phí có thể bị click liên tiếp khi mạng chậm hoặc API trễ. | Tích hợp kiểm tra `if (isPending) return`, vô hiệu hóa nút submit (`disabled={isSaving}`), kích hoạt hiệu ứng xoay spinner `Loader2`, gắn `disabled:pointer-events-none` và `aria-busy`. | **ĐÃ GIẢI QUYẾT** |
| **TSK-P2-02 (Modal A11y & Scroll Lock)** | **P2 MEDIUM** | `ConfirmDecreaseModal.tsx` | Thiếu listener phím `Escape`, không khóa cuộn trang nền `overflow: hidden`, thiếu ARIA dialog landmarks. | Bổ sung `Escape` key listener, khóa cuộn `document.body.style.overflow = 'hidden'`, hoàn trả khi unmount, bổ sung `role="dialog"` và `aria-modal="true"`. | **ĐÃ HOÀN THÀNH** |
| **Tablet-Responsive-Polish** | **P2 MEDIUM** | `MerchantSlotCard.tsx`, `LotPages.tsx` | Bố cục 5 cột co ép trên màn hình tablet (768px - 1024px) khiến nhãn trường và nút bấm bị chồng lấn. | Điều chỉnh lưới phản hồi linh hoạt: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`, tối ưu kích thước touch target lên chuẩn tối thiểu `40x40px`. | **ĐÃ TỐI ƯU HÓA** |

---

## 2. Chi Tiết Các Tệp Mã Nguồn Đã Chỉnh Sửa & Nâng Cấp

### 2.1. `src/features/merchant/slots/components/ConfirmDecreaseModal.tsx`
- Bổ sung `useEffect` lắng nghe sự kiện phím tắt `Escape` để đóng modal an toàn khi không đang lưu (`!isSaving`).
- Tích hợp khóa cuộn trang nền: `document.body.style.overflow = 'hidden'` khi mở và hoàn trả `overflow = originalOverflow` khi unmount.
- Gắn đầy đủ thuộc tính ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="confirm-decrease-modal-title"`.
- Bổ sung bảo vệ click đúp: `disabled:pointer-events-none disabled:cursor-not-allowed`, `aria-busy={isSaving}`, hiển thị spinner xoay `<Loader2 className="w-4 h-4 animate-spin" />`.

### 2.2. `src/features/merchant/slots/components/MerchantSlotCard.tsx`
- Tối ưu hóa phản hồi bố cục Tablet: Chuyển cấu trúc linh hoạt sang `flex-col md:flex-row md:items-center justify-between gap-5 lg:gap-6`.
- Cải thiện vùng bấm tương tác (Touch Target): Mở rộng nút bấm stepper tăng/giảm sức chứa lên `w-9 h-9 sm:w-10 sm:h-10` kèm `disabled:cursor-not-allowed disabled:pointer-events-none`.
- Ô nhập liệu sức chứa được bổ sung lớp số học chuẩn hóa: `tabular-nums font-mono text-center` và khóa chặn tối thiểu `min={occupied}`.

### 2.3. `src/features/merchant/slots/components/MerchantSlotsStickyFooter.tsx`
- Thêm lớp trạng thái vô hiệu hóa: `disabled:cursor-not-allowed disabled:pointer-events-none` cho cả hai nút "Khôi Phục Gốc" và "Lưu Cấu Hình Hàng Loạt".
- Bổ sung thuộc tính `aria-busy={isSaving}` và hiệu ứng spinner xoay `Loader2` trong khi gửi API `PUT /api/v1/merchant/parking-lots/{lotCode}/slots/bulk`.

### 2.4. `src/features/merchant/slots/pages/MerchantSlotsPage.tsx`
- Bổ sung guard chặn click đúp tại `handleSaveClick`: `if (saveMutation.isPending) return`.
- Bổ sung guard tại `executeBulkSave`: `if (saveMutation.isPending) return`.

### 2.5. `src/features/merchant/operations/LotPages.tsx`
- **Biểu phí hiện hành (`LotOverview`):**
  - Căn phải (`text-right font-mono tabular-nums font-semibold`) cho cột "Giá giờ".
  - Căn phải (`text-right font-mono tabular-nums`) cho cột "Hệ số cao điểm" và "Hệ số quá giờ".
  - Căn giữa (`text-center font-mono`) cho cột "Khung cao điểm".
- **Cấu hình sức chứa (`SlotEditor`):**
  - Tính toán số xe đang đỗ thực tế: `occupied = Math.max(0, currentSlot.totalCapacity - currentSlot.availableCapacity)`.
  - Hiển thị badge: `Đang đỗ thực tế: {occupied} xe (Khóa tối thiểu: {occupied})` khi có xe trong bãi.
  - Khóa giá trị tối thiểu của ô nhập: `min={occupied}` kèm validation rule `min: { value: occupied, message: '...' }`.
  - Căn phải ô nhập liệu: `text-right font-mono tabular-nums`.
- **Ma trận biểu phí 5 loại xe (`PricingEditor`):**
  - Tối ưu lưới trên màn hình tablet: `grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`.
  - Căn phải cho các trường số liệu: `basePricePerHour`, `surgeMultiplier`, `overtimePenaltyMultiplier` (`text-right font-mono tabular-nums`).
- **Nút Lưu trạng thái (`SaveState`):**
  - Chống double-click: `disabled:cursor-not-allowed disabled:pointer-events-none`, `aria-busy={pending}`.
  - Hiển thị spinner xoay `<Loader2 className="w-4 h-4 animate-spin" />` khi `pending`.

---

## 3. Kết Quả Kiểm Thử & Nghiệm Thu Chất Lượng

### 3.1. Kiểm Tra TypeScript (`npm run typecheck`)
- Lệnh: `tsc --noEmit`
- Kết quả: **PASS (0 lỗi)**

### 3.2. Kiểm Tra Tiêu Chuẩn Mã Nguồn (`npm run lint`)
- Lệnh: `eslint .`
- Kết quả: **PASS (0 lỗi, 0 cảnh báo)**

### 3.3. Kiểm Thử Đơn Vị & Tích Hợp (`npm run test`)
- Lệnh: `vitest run`
- Kết quả: **37/37 Test Files PASS, 276/276 Tests PASS (100%), 0 Unhandled Errors**
- **Test suite `MerchantSlotsPage.test.tsx` (7/7 tests passed):**
  1. `FN-032-01`: Hiển thị đầy đủ thông tin bãi đỗ, KPI và 5 loại xe chuẩn
  2. `FN-032-02 & FN-032-03`: Kiểm tra Khóa Ràng Buộc Bất Biến (Occupied Invariant)
  3. `FN-032-04`: Tăng sức chứa qua Stepper `[+]` và cập nhật Realtime KPI
  4. `FN-032-05`: Khôi phục gốc khi bấm Hủy thay đổi
  5. `FN-032-06`: Lưu cấu hình hàng loạt (Bulk Save)
  6. `FN-032-07`: Mở `ConfirmDecreaseModal` khi giảm sức chứa, đóng modal bằng phím `Escape` và khóa cuộn trang nền (`TSK-P2-02 A11y`)
  7. `FN-032-08`: Ngăn chặn gửi 2 request trùng lặp (double-click) khi đang lưu cấu hình hàng loạt (`TSK-P2-01`)
- **Test suite `operations.test.tsx` (14/14 tests passed):**
  - Bảo toàn 5 loại xe và hợp đồng gửi API biểu phí thực tế (`PUT /pricing/bulk`).
  - Ràng buộc bất biến sức chứa xe đang đỗ (`SlotEditor` min={occupied}).
  - Chống double-click submit khi đang lưu biểu phí.

### 3.4. Kiểm Tra Đóng Gói Production (`npm run build`)
- Lệnh: `tsc -b && vite build`
- Kết quả: **PASS (2579 modules transformed, hoàn thành trong 17.81s)**

---

## 4. Tóm Tắt Trạng Thái Các Lô Triển Khai (Progress Tracker)

- [x] **BATCH 00**: Shared Design System & Core Primitives
- [x] **BATCH 01**: Driver Booking Core & Operations Desk (`SCR-014`–`SCR-017`)
- [x] **BATCH 02**: Merchant Finance & Wallet Desk (`SCR-038`, `SCR-037`, `SCR-027`)
- [x] **BATCH 03**: Merchant Parking Facilities Directory & Onboarding (`SCR-028`–`SCR-031`)
- [x] **BATCH 04**: Merchant Slots Capacity & Pricing Matrix Workbench (`SCR-032`, `SCR-033`) — **HOÀN TẤT**
- [ ] **BATCH 05**: Merchant Barie Gate Terminal & Booking Dispatch (`SCR-026`, `SCR-034`–`SCR-036`, `SCR-041`)
- [ ] **BATCH 06**: Driver Fleet Management & ALPR Synchronization (`SCR-020`)
- [ ] **BATCH 07**: Driver Payments, VAT Invoicing & Callback Hubs (`SCR-019`, `SCR-023`, `SCR-024`)
- [ ] **BATCH 08**: Driver Virtual Queues & Driver Disputes (`SCR-018`, `SCR-040`)
- [ ] **BATCH 09**: Driver Profile, Security & Notifications (`SCR-021`, `SCR-022`, `SCR-025`)
- [ ] **BATCH 10**: Admin Parking Lots Moderation Queue & Dashboard (`SCR-042`–`SCR-044`)
- [ ] **BATCH 11**: Admin User Governance & Financial Settlement Ledger (`SCR-045`–`SCR-048`)
- [ ] **BATCH 12**: Admin Disputes Docket, Audit Trail & Security Profile (`SCR-049`–`SCR-053`)
- [ ] **BATCH 13**: Authentication & Access Control Guards Hardening (`SCR-010`–`SCR-013`, `403`, `404`)
- [ ] **BATCH 14**: Public Marketing Website & Developer Documentation (`SCR-001`–`SCR-009`)

---

> **Kết luận:** Nhóm 4 đã hoàn tất 100% các tiêu chí nghiệm thu mà không gây bất kỳ hồi quy nào. Dừng tại đây chờ phê duyệt của người dùng trước khi tiến hành nhóm tiếp theo theo đúng MASTER INSTRUCTIONS.

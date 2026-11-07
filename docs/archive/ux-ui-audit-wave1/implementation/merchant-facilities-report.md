# Báo Cáo Triển Khai Cải Thiện UX/UI: Nhóm 3 (Merchant Parking Facilities Directory & Onboarding)

> **Mã công việc:** IMPLEMENT-GRP-03  
> **Nhóm màn hình:** Nhóm 3: Merchant Parking Facilities Directory & Onboarding  
> **Thời gian thực hiện:** Tháng 11/2026  
> **Phạm vi triển khai & nghiệm thu:**  
> - `/merchant/parking-lots` (`SCR-028` — Danh Mục & Quản Lý Mặt Bằng Bãi Đỗ Xe Sở Hữu)  
> - `/merchant/parking-lots/new` (`SCR-029` — Quy Trình 3 Bước Đăng Ký Cơ Sở Bãi Đỗ Xe & Depot Mới)  
> - `/merchant/parking-lots/:parkingLotId` (`SCR-030` — Chi Tiết Hồ Sơ Kỹ Thuật, Thư Viện Ảnh & Trọng Tải Bãi)  
> - `/merchant/parking-lots/:parkingLotId/edit` (`SCR-031` — Chỉnh Sửa, Căn Chỉnh Ghim GPS & Phúc Đáp Biên Bản Thẩm Định)  
>
> **Tiêu chuẩn tuân thủ:** MASTER INSTRUCTIONS · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Vitest · ESLint

---

## 1. Tổng Quan Kết Quả Triển Khai

Giai đoạn triển khai Nhóm 3 đã giải quyết triệt để lỗi **P1 HIGH** (`TSK-P1-01` / `APP-07` / `ISS-10` — Xuất báo cáo CSV UTF-8 BOM thực tế thay cho timer giả lập), chặn double-click submit form tạo/sửa bãi (`TSK-P2-01` / `APP-15`), chuẩn hóa A11y đóng modal bằng phím `Escape` và khóa cuộn trang (`TSK-P2-02` / `APP-12`), đồng thời bảo toàn cơ chế Lockout bảo vệ bãi đã được duyệt (`APPROVED`).

| Mã Issue / Task | Mức Độ | Màn Hình / Component | Hiện Trạng Trước Khi Sửa | Giải Pháp Kỹ Thuật Đã Triển Khai | Trạng Thái Sau Sửa |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **TSK-P1-01 / APP-07 / ISS-10** | **P1 HIGH** | `ExportReportModal.tsx` & `/merchant/parking-lots` | Nút "Tải Báo Cáo" chỉ chạy `setTimeout` giả vờ tải mà không tạo file thực tế; mở bằng Excel có nguy cơ lỗi font tiếng Việt. | Xây dựng tiện ích chuẩn `exportToCsvUtil.ts` có tiền tố UTF-8 BOM (`\uFEFF`), tự động tổng hợp danh sách bãi thực tế và tải về file `DanhSach_BaiDo_SmartParking_YYYYMMDD.csv` mở trong Microsoft Excel hiển thị tiếng Việt hoàn hảo 100%. | **ĐÃ GIẢI QUYẾT TRIỆT ĐỂ** |
| **TSK-P2-01 / APP-15 / ISS-17** | **P2 MEDIUM** | `CreateMerchantParkingLotPage.tsx`, `EditMerchantParkingLotPage.tsx` | Nút hoàn tất đăng ký bãi mới và gửi duyệt sửa đổi thiếu cờ chặn click đúp khi mạng trễ, có thể tạo bản ghi trùng lặp hoặc gửi nhiều request lên server. | Tích hợp kiểm tra `if (submitting) return`, vô hiệu hóa nút submit (`disabled={submitting}`), kích hoạt hiệu ứng xoay spinner `RefreshCw` / `Loader2`, thêm `disabled:pointer-events-none` và `aria-busy={submitting}`. | **ĐÃ GIẢI QUYẾT** |
| **TSK-P2-02 / APP-12 / ISS-12** | **P2 MEDIUM** | `ExportReportModal.tsx`, `EditMerchantParkingLotPage.tsx`, `MerchantLotGallery.tsx` | Modal xuất file, Modal nhật ký thẩm định và Lightbox xem ảnh thiếu phím tắt `Escape` và không khóa cuộn trang nền `overflow: hidden`, gây mất phương hướng khi lướt chuột. | Tích hợp listener lắng nghe phím `Escape` để đóng modal ngay lập tức, tự động áp dụng `document.body.style.overflow = 'hidden'` và hoàn trả nguyên vẹn khi unmount; bổ sung `role="dialog"` và `aria-modal="true"`. | **ĐÃ GIẢI QUYẾT** |
| **Bảo Vệ Lockout Mode Bãi Approved** | **P1 HIGH** | `EditMerchantParkingLotPage.tsx` | Cần bảo đảm bãi đỗ khi đã `APPROVED` sẽ không bị sửa đổi trái phép làm sai lệch vị trí dẫn đường xe container. | Xác thực chặt chẽ điều kiện `canEdit = lot.status === 'CHANGES_REQUESTED' || lot.status === 'REJECTED'`. Khóa form, hiển thị banner cảnh báo an toàn màu vàng hổ phách và vô hiệu hóa nút submit khi bãi là `APPROVED` hoặc `PENDING_APPROVAL`. | **ĐÃ XÁC NHẬN BẢO VỆ CHẶT CHẼ** |

---

## 2. Chi Tiết Các Tệp Mã Nguồn Đã Chỉnh Sửa & Bổ Sung

### 2.1. `src/shared/utils/exportToCsvUtil.ts` (Tạo mới)
- Xây dựng module dùng chung cho toàn bộ dự án với các phương thức cốt lõi:
  - `generateCsvContent<T>(data: T[], columns: CsvColumn<T>[]): string`: Thêm ký tự UTF-8 BOM `\uFEFF` ở đầu file, bao bọc mọi trường dữ liệu bằng dấu ngoặc kép `"` và escape chuẩn `""` cho ký tự đặc biệt.
  - `getFormattedDateForFilename(date?: Date): string`: Định dạng ngày theo chuẩn `YYYYMMDD` (ví dụ `20261106`).
  - `downloadFile(content: string, filename: string, mimeType?: string): void`: Tạo Blob DOM link và kích hoạt tải về tự động mà không làm chuyển trang.
  - `exportToCsv<T>(data: T[], columns: CsvColumn<T>[], filename: string): void`: Wrapper tiện lợi một dòng lệnh.
- Đi kèm test suite độc lập `src/shared/utils/__tests__/exportToCsvUtil.test.ts` pass 4/4 test cases.

### 2.2. `src/features/merchant/parking-lots/components/ExportReportModal.tsx`
- Nhận mảng dữ liệu bãi thực tế `lots?: MerchantParkingLotCardData[]` từ trang cha, fallback về `fallbackMerchantParkingLots` khi danh sách trống.
- Xuất file CSV UTF-8 BOM chuẩn với 13 cột nghiệp vụ (Mã bãi, Tên cơ sở, Địa chỉ, Trạng thái, Cổng barie, Phân loại mặt bằng, Sức chứa, Đang đỗ, Tỷ lệ lấp đầy, Doanh thu, Đánh giá, Số đánh giá, Ngày đăng ký).
- Tích hợp A11y: Lắng nghe phím `Escape` để đóng, khóa cuộn `document.body.style.overflow = 'hidden'`, gắn `role="dialog"`, `aria-modal="true"`, `aria-labelledby="export-modal-title"`.

### 2.3. `src/features/merchant/parking-lots/pages/MerchantParkingLotsPage.tsx`
- Truyền trực tiếp danh sách bãi đang hiển thị `lots={data.content}` vào `ExportReportModal`.

### 2.4. `src/features/merchant/parking-lots/pages/CreateMerchantParkingLotPage.tsx` & `CreateParkingLotActionFooter.tsx`
- Bổ sung `if (submitting) return` chặn click lặp tại `onSubmitFinal` và `handleRetryUpload`.
- Cập nhật nút submit với cờ `disabled={submitting}`, `aria-busy={submitting}`, `disabled:pointer-events-none` và spinner xoay `RefreshCw`.

### 2.5. `src/features/merchant/parking-lots/pages/EditMerchantParkingLotPage.tsx` & `EditMerchantActionFooter.tsx`
- Bổ sung `if (submitting) return` chặn click lặp tại `onSubmit`.
- Nâng cấp Modal Nhật Ký Thẩm Định với phím tắt `Escape`, khóa cuộn nền và các thuộc tính `role="dialog"`, `aria-modal="true"`, `aria-labelledby="history-modal-title"`.
- Cập nhật nút submit với cờ `disabled={disabled || submitting}`, `aria-busy={submitting}`, `disabled:pointer-events-none`.

### 2.6. `src/features/merchant/parking-lots/components/detail/MerchantLotGallery.tsx`
- Bổ sung phím tắt `Escape` để đóng Lightbox xem ảnh hạ tầng.
- Bổ sung phím mũi tên `ArrowLeft` / `ArrowRight` để chuyển ảnh mượt mà.
- Khóa cuộn trang `document.body.style.overflow = 'hidden'` khi Lightbox đang mở.
- Bổ sung `role="dialog"`, `aria-modal="true"`.

---

## 3. Kết Quả Kiểm Tra Chất Lượng (Quality Gates Verification)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BÁO CÁO KIỂM THỬ TỰ ĐỘNG ZERO REGRESSION (NHÓM 3)                     │
├────────────────────────────────────────────────────────────────────────┤
│ 1. TypeScript Compile (tsc --noEmit):    0 LỖI (PASS 100%)             │
│ 2. ESLint Static Analysis (eslint .):    0 ERRORS, 0 WARNINGS (PASS)   │
│ 3. Vitest Unit & Integration Tests:      37/37 TEST SUITES PASS        │
│                                          272/272 TESTS PASS (100%)     │
│ 4. Vite Production Build (tsc -b & vite):BUILT IN 13.11s (2579 modules)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Kiểm Thử Luồng Thao Tác (Workflow Checks)

1. **Luồng Xuất Báo Cáo Mặt Bằng (`/merchant/parking-lots`):**
   - Bấm nút "Xuất Báo Cáo Mặt Bằng" -> Modal mở mượt mà, cuộn trang phía sau bị khóa.
   - Chọn định dạng "CSV UTF-8" -> Bấm "Tải Báo Cáo (CSV)".
   - Trình duyệt tải ngay file `DanhSach_BaiDo_SmartParking_YYYYMMDD.csv` với UTF-8 BOM.
   - Nút hiển thị icon tick xanh `CheckCircle2` "Đã Xuất File" và tự động đóng modal.
   - Bấm phím `Escape` ở bất kỳ lúc nào để đóng modal ngay lập tức.
2. **Luồng Đăng Ký Bãi Mới (`/merchant/parking-lots/new`):**
   - Điền thông tin Bước 1 -> Bước 2 -> Bước 3.
   - Bấm "XÁC NHẬN TẠO BÃI ĐỖ MỚI" -> Nút chuyển thành `disabled`, con trỏ khóa `pointer-events-none`, spinner `RefreshCw` xoay tròn kèm nhãn "ĐANG KHỞI TẠO HỒ SƠ...".
   - Người dùng click liên tục không thể phát sinh request thứ 2.
3. **Luồng Chỉnh Sửa & Khóa Bãi Đã Duyệt (`/merchant/parking-lots/:id/edit`):**
   - Khi bãi là `APPROVED`: Form khóa toàn bộ, hiển thị banner hổ phách cảnh báo an toàn, nút submit bị vô hiệu hóa `disabled={true}`.
   - Khi bãi là `CHANGES_REQUESTED`: Mở form sửa, bấm "Xem Lịch Sử Thẩm Định" -> Modal mở, nhấn `Escape` đóng ngay lập tức.
   - Bấm "GỬI LẠI HỒ SƠ KIỂM DUYỆT ADMIN" -> Nút chuyển thành spinner `Loader2` "ĐANG GỬI HỒ SƠ..." và bị khóa triệt để.
4. **Luồng Xem Chi Tiết Bãi & Lightbox (`/merchant/parking-lots/:id`):**
   - Bấm vào ảnh hạ tầng -> Lightbox mở toàn màn hình, cuộn trang bị khóa.
   - Bấm phím mũi tên trái/phải để chuyển ảnh, bấm `Escape` đóng lightbox tức thì.

---

## 5. Kết Luận & Dừng Để Nghiệm Thu (Halt for Acceptance)

- **Trạng thái Nhóm 3:** **HOÀN THÀNH 100% CÁC TIÊU CHÍ NGHIỆM THU**.
- **Số lượng test toàn dự án:** Tăng từ 262 tests (36 suites) lên **272 tests (37 suites)**, toàn bộ pass 100%.
- **Zero Regression:** TypeScript, ESLint, Vitest và Production build đều xanh tuyệt đối.
- **Tuân thủ quy định:** Dừng lại tại đây để Người phụ trách dự án kiểm tra và nghiệm thu Nhóm 3 trước khi chọn nhóm tiếp theo.

---
**Tài liệu lưu trữ tại:** `docs/ux-ui-audit/implementation/merchant-facilities-report.md`.

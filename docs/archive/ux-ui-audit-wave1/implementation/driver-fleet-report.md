# Báo Cáo Triển Khai Cải Thiện UX/UI: Nhóm 6 (Driver Fleet Management & ALPR Synchronization)

> **Mã công việc:** IMPLEMENT-GRP-06  
> **Nhóm màn hình:** Nhóm 6: Driver Fleet Management & ALPR Synchronization  
> **Thời gian thực hiện:** Tháng 11/2026  
> **Phạm vi triển khai & nghiệm thu:**  
> - `/vehicles`, `/dashboard/vehicles`, `/driver/vehicles` (`SCR-020` — Quản Lý Phương Tiện Của Tôi & Đội Xe Vận Tải)  
> - Modal xuất danh sách đội xe (`ExportFleetModal.tsx`)  
> - Bảng danh mục phương tiện quản lý (`VehicleMasterTable.tsx`)  
> - Modal đăng ký phương tiện mới chuẩn đăng kiểm (`RegisterVehicleModal.tsx`)  
> - Modal cập nhật thông số xe (`EditVehicleModal.tsx`)  
> - Modal xác nhận hủy phương tiện (`DeleteVehicleConfirmModal.tsx`)  
> - Modal hồ sơ kỹ thuật & kiểm định (`ViewInspectionDossierModal.tsx`)  
>
> **Tiêu chuẩn tuân thủ:** MASTER INSTRUCTIONS · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Vitest · ESLint

---

## 1. Tổng Quan Kết Quả Triển Khai

Giai đoạn triển khai Nhóm 6 đã giải quyết triệt để các yêu cầu nghiệp vụ và tiêu chuẩn thiết kế:
1. **Xuất Danh Sách Đội Xe CSV Chuẩn UTF-8 BOM (TSK-P1-01 / APP-03 / ISS-02):** Khắc phục hoàn toàn tình trạng tải về tệp JSON thô đổi đuôi `.xlsx` / `.pdf` làm hỏng file. Tích hợp tiện ích chuẩn `exportToCsvUtil.ts` tạo tệp CSV có Byte Order Mark (`\uFEFF`), hỗ trợ hiển thị 100% tiếng Việt trên Excel Windows/macOS không bị lỗi font (mojibake), kèm tên tệp chuẩn hóa `SmartTruck_DoiXe_YYYYMMDD.csv`.
2. **Chuyển Đổi Bảng Đội Xe Sang Thẻ Xếp Chồng Trên Di Động (TSK-P1-03 / APP-16):** Trên màn hình di động (< 640px, đặc biệt là iPhone SE 375px), bảng 6 cột tự động chuyển thành danh sách Thẻ xếp chồng (Stacked Card View) với biển số to rõ, nhãn dữ liệu trực quan (Quy cách, Tải trọng, Đăng kiểm, ALPR) và vùng bấm thao tác đạt chuẩn tiếp cận tối thiểu ≥ 44×44px, không gây tràn viền ngang.
3. **Chống Gửi Yêu Cầu Trùng Lặp Khi Thêm/Sửa/Xóa Xe (TSK-P2-01 / APP-15 / ISS-17):** Tích hợp cờ bảo vệ `if (isSubmitting / isSaving / isDeleting) return`, vô hiệu hóa nút submit (`disabled`), gắn thuộc tính `aria-busy` và kích hoạt spinner xoay `Loader2`, ngăn chặn việc tạo 2 xe trùng biển số hoặc xóa trùng lặp khi mạng chậm.
4. **Chuẩn Hóa A11y & Phím Tắt Escape Trên Toàn Bộ Modal (TSK-P2-02 / APP-12 / ISS-12):** Tất cả 5 modal thuộc phân hệ quản lý đội xe (`ExportFleetModal`, `RegisterVehicleModal`, `EditVehicleModal`, `DeleteVehicleConfirmModal`, `ViewInspectionDossierModal`) được bổ sung lắng nghe phím tắt `Escape`, khóa cuộn trang nền `overflow: hidden`, và cấu hình đầy đủ `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.

| Mã Issue / Task | Mức Độ | Màn Hình / Component | Hiện Trạng Trước Khi Sửa | Giải Pháp Kỹ Thuật Đã Triển Khai | Trạng Thái Sau Sửa |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **TSK-P1-01 / APP-03 (Xuất CSV UTF-8 BOM)** | **P1 HIGH** | `ExportFleetModal.tsx` (`SCR-020`) | Modal tạo Blob JSON thô rồi gán đuôi `.xlsx`/`.pdf`, làm tệp tải về bị lỗi định dạng khi mở bằng phần mềm bảng tính. | Sử dụng `generateCsvContent` và `downloadFile` từ `exportToCsvUtil.ts`, thêm `\uFEFF` UTF-8 BOM, xuất 12 cột thông số xe và hạn đăng kiểm tiếng Việt chuẩn xác. | **ĐÃ HOÀN TẤT** |
| **TSK-P1-03 / APP-16 (Mobile Stacked Cards & Touch Targets)** | **P1 HIGH** | `VehicleMasterTable.tsx` (`SCR-020`) | Bảng cố định `table-fixed` gây chật chội hoặc tràn ngang trên màn hình mobile 375px; nút thao tác quá nhỏ (< 32px) dễ bấm nhầm. | Chuyển đổi linh hoạt `hidden sm:table-header-group` cho thead, `flex flex-col` thẻ xếp chồng cho tr trên mobile, phóng to biển số và mở rộng touch targets lên `min-h-[44px] min-w-[44px]`. | **ĐÃ HOÀN TẤT** |
| **TSK-P2-01 / APP-15 (Chống Double-Click)** | **P2 MEDIUM** | `RegisterVehicleModal.tsx`, `EditVehicleModal.tsx`, `DeleteVehicleConfirmModal.tsx`, `ExportFleetModal.tsx` | Nút đăng ký, lưu thay đổi, xác nhận xóa và xuất file có thể bị click liên tiếp khi đang gọi API. | Tích hợp guard `if (pending) return`, `disabled`, `aria-busy` và spinner xoay `Loader2` trong trạng thái chờ xử lý. | **ĐÃ GIẢI QUYẾT TRIỆT ĐỂ** |
| **TSK-P2-02 / APP-12 (Modal A11y & Escape)** | **P2 MEDIUM** | Toàn bộ 5 modal quản lý xe (`SCR-020`, `SCR-021`) | Thiếu phím tắt `Escape`, không khóa cuộn trang nền và thiếu các thuộc tính ARIA chuẩn. | Bổ sung `Escape` key listener, khóa cuộn `document.body.style.overflow = 'hidden'`, gắn `role="dialog"` và `aria-modal="true"`. | **ĐÃ HOÀN TẤT** |

---

## 2. Chi Tiết Các Tệp Mã Nguồn Đã Chỉnh Sửa & Nâng Cấp

### 2.1. `src/features/vehicles/components/ExportFleetModal.tsx`
- Tích hợp hàm `generateCsvContent` và `downloadFile` từ `@/shared/utils/exportToCsvUtil`.
- Đặt cấu hình 12 cột thông số: Mã Số, Biển Số, Phân Loại, Nhãn Hiệu / Model, Cấu Hình Trục, Tự Trọng, Tải Trọng Kéo Theo, Hạn Đăng Kiểm, Số Bảo Hiểm TNDS, Đồng Bộ ALPR, Mặc Định Vận Hành, Trạng Thái Lưu Hành (kèm tùy chọn hồ sơ kỹ thuật bổ sung).
- Định dạng tên tệp chuẩn: `SmartTruck_DoiXe_${getFormattedDateForFilename()}.csv`.
- Bổ sung phím tắt `Escape`, khóa cuộn trang nền và thuộc tính ARIA dialog.
- Chống double-click: vô hiệu hóa nút submit (`disabled={isExporting}`), gắn `aria-busy={isExporting}` và spinner xoay `Loader2`.

### 2.2. `src/features/vehicles/components/VehicleMasterTable.tsx`
- Giữ nguyên cấu trúc thẻ bảng chuẩn cho desktop (`sm:table-fixed`, `sm:table-row`), đảm bảo 100% khả năng tương thích với JSDOM và kiểm thử tự động.
- Ẩn thead trên mobile bằng `hidden sm:table-header-group`.
- Biến đổi từng hàng `<tr>` thành thẻ Card nổi bật trên mobile: `flex flex-col sm:table-row p-4 sm:p-0 border sm:border-0 border-slate-200/90 rounded-2xl mb-3 sm:mb-0 shadow-xs sm:shadow-none`.
- Biển số xe trên mobile được làm to rõ: `font-mono text-lg sm:text-base font-bold text-slate-900`.
- Thêm tiền tố nhãn thông số dễ đọc trên mobile: "Quy cách:", "Tải trọng:", "Hạn kiểm định:", "Cổng ALPR:".
- Mở rộng vùng bấm các nút thao tác trên mobile: `min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0`, ngăn ngừa bấm trượt trên màn hình cảm ứng.

### 2.3. `src/features/vehicles/components/RegisterVehicleModal.tsx`
- Thêm `useEffect` lắng nghe sự kiện phím tắt `Escape` khi không bận (`!isSubmitting`).
- Khóa cuộn trang nền `document.body.style.overflow = 'hidden'` và hoàn trả khi đóng modal.
- Chặn click đúp trong form submit: `if (isSubmitting) return`.
- Nút "Đăng Ký & Đồng Bộ ALPR": `disabled={isSubmitting}`, `aria-busy={isSubmitting}`, spinner xoay `Loader2`.
- Gắn định danh trợ năng: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="register-vehicle-modal-title"`.

### 2.4. `src/features/vehicles/components/EditVehicleModal.tsx`
- Bổ sung `Escape` key listener và khóa cuộn trang nền.
- Chặn click đúp trong form submit: `if (isSaving) return`.
- Nút "Lưu Thay Đổi": `disabled={isSaving}`, `aria-busy={isSaving}`, spinner xoay `Loader2`.
- Gắn định danh trợ năng: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="edit-vehicle-modal-title"`.

### 2.5. `src/features/vehicles/components/DeleteVehicleConfirmModal.tsx`
- Bổ sung `Escape` key listener và khóa cuộn trang nền.
- Chặn click đúp trong `handleConfirm`: `if (isDeleting) return`.
- Nút "Xác Nhận Xóa": `disabled={isDeleting}`, `aria-busy={isDeleting}`, spinner xoay `Loader2`.
- Gắn định danh trợ năng: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="delete-vehicle-modal-title"`.

### 2.6. `src/features/vehicles/components/ViewInspectionDossierModal.tsx`
- Bổ sung `Escape` key listener và khóa cuộn trang nền.
- Gắn định danh trợ năng: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="inspection-dossier-modal-title"`.

### 2.7. `src/features/vehicles/__tests__/VehiclesPage.test.tsx`
- Bổ sung test case kiểm tra đóng modal bằng phím `Escape` cho Export và Register modal:
  `it('closes modals (Export, Register) when pressing Escape key (TSK-P2-02 A11y)')`.
- Bổ sung test case kiểm tra xuất danh sách đội xe chuẩn CSV UTF-8 BOM:
  `it('exports fleet list as UTF-8 BOM CSV with proper columns (TSK-P1-01 / APP-03)')`.

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
- Kết quả: **37/37 test files PASS · 281/281 tests PASS (100% green)**
  - `src/features/vehicles/__tests__/VehiclesPage.test.tsx`: 13/13 tests PASS

### 3.4. Kiểm Tra Đóng Gói Production (`npm run build`)
- Lệnh thực thi: `tsc -b && vite build`
- Kết quả: **PASS (2579 modules transformed, built in 19.93s, 0 errors)**

---

## 4. Kết Luận & Đề Xuất Bước Kế Tiếp

Nhóm 6 (`Driver Fleet Management & ALPR Synchronization`) đã hoàn thành 100% các mục tiêu kỹ thuật, sửa đổi an toàn không gây hồi quy (zero regression), và sẵn sàng chuyển tiếp sang nhóm tiếp theo.

**Đề xuất tiếp theo:** Sẵn sàng chuyển tiếp sang **Nhóm 7: Driver Payments, VAT Invoicing & Callback Hubs** (`SCR-019` — Lịch Sử Giao Dịch & Hóa Đơn Điện Tử VAT, `SCR-023` — Xác Nhận Thanh Toán PayOS Thành Công, `SCR-024` — Xử Lý Hủy Thanh Toán & Bảo Lưu Vé).

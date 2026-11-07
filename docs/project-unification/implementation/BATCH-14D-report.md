# BÁO CÁO TRIỂN KHAI ĐỒNG BỘ: BATCH-14D — MERCHANT YARD INFRASTRUCTURE (HẠ TẦNG BẾN BÃI, HỒ SƠ CHỦ BÃI, ĐĂNG KÝ BÃI ĐỖ & CẤU HÌNH SỨC CHỨA)

> **Dự án:** SmartParkingHub Workspace Master Unification  
> **Phân hệ:** [`smart-parking-app-v2`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2) (React 19 + TypeScript Strict + Tailwind CSS v4 + Vite)  
> **Batch ID:** `BATCH-14D`  
> **Nhóm phân hệ:** `GROUP 04: MERCHANT YARD INFRASTRUCTURE (BẾN BÃI, HỒ SƠ PHÁP LÝ & CẤU HÌNH SỨC CHỨA THỰC ĐỊA)`  
> **Trạng thái:** HOÀN TẤT & ĐÃ XÁC THỰC 100% (Build 0 Errors, TypeScript 0 Errors, 8/8 Test Suites Green, 57/57 Tests Passed)  
> **Ngày hoàn thành:** 07/11/2026  

---

## 1. THÔNG TIN BATCH & PHẠM VI TRIỂN KHAI

* **GROUP:** `GROUP 04: MERCHANT YARD INFRASTRUCTURE`
* **BATCH ID:** `BATCH-14D`
* **PAGES:**
  - `SCR-026`: [`MerchantDashboardPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx) — Bảng Điều Khiển Doanh Thu & Lưu Lượng Chủ Bãi (Merchant Operations Command Surface)
  - `SCR-027`: [`MerchantProfilePage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/profile/pages/MerchantProfilePage.tsx) — Hồ Sơ Pháp Lý Chủ Bãi, Mã Số Thuế & Mặt Nạ Tài Khoản Ngân Hàng Qr Code
  - `SCR-028`: [`MerchantParkingLotsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/pages/MerchantParkingLotsPage.tsx) — Danh Mục Cơ Sở Bãi Đỗ Xe Sở Hữu, 3 Thẻ Bento KPI & Xuất Báo Cáo Mặt Bằng
  - `SCR-029`: [`CreateMerchantParkingLotPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/pages/CreateMerchantParkingLotPage.tsx) — Quy Trình Khai Báo Mở Bến Bãi 3 Bước (Wizard Stepper, GPS Finder & Trợ Lý AI Fretrix-Dispatch-V3)
  - `SCR-030`: [`MerchantParkingLotDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/pages/MerchantParkingLotDetailPage.tsx) — Hồ Sơ Kỹ Thuật Chi Tiết Cơ Sở, Thư Viện Ảnh Lightbox, Ma Trận Tải Trọng & Giám Sát Xe Đang Đỗ Thực Tế
  - `SCR-031`: [`EditMerchantParkingLotPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/pages/EditMerchantParkingLotPage.tsx) — Chỉnh Sửa Hồ Sơ Bãi Đỗ, Tiếp Nhận Biên Bản Thẩm Định Admin, Hiệu Chỉnh Tọa Độ RTK & Lưu Bản Nháp Nội Bộ
  - `SCR-032`: [`MerchantSlotsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/slots/pages/MerchantSlotsPage.tsx) — Ma Trận Phân Bổ Sức Chứa Slot 5 Loại Xe, Khóa Bất Biến Thực Địa (Occupied Invariant) & Modal Xác Nhận Giảm Sức Chứa
* **ROUTES CHÍNH:**
  - `/merchant`, `/merchant/dashboard`
  - `/merchant/profile`
  - `/merchant/parking-lots`
  - `/merchant/parking-lots/new`
  - `/merchant/parking-lots/:parkingLotId`
  - `/merchant/parking-lots/:parkingLotId/edit`
  - `/merchant/parking-lots/:parkingLotId/slots`
* **ISSUE IDS ĐÃ GIẢI QUYẾT:**
  - `TSK-P2-02 / ISSUE-A11Y-04`: Chuẩn hóa khả năng tiếp cận (Accessibility) chuẩn WAI-ARIA cho toàn bộ hệ thống modal, popup và dialog trong quản trị bến bãi:
    - `ExportReportModal` (SCR-028): `role="dialog"`, `aria-modal="true"`, lắng nghe phím `Escape` và tự động khôi phục thanh cuộn nền.
    - `Gallery Lightbox` (SCR-030): Đóng bằng phím `Escape`, khóa cuộn `overflow: hidden` khi mở ảnh phóng to chi tiết.
    - `InspectionHistoryModal` (SCR-031): Xem nhật ký thẩm định mặt bằng, đóng bằng `Escape` và phím bấm chuẩn a11y.
    - `ConfirmDecreaseModal` (SCR-032): Hộp thoại cảnh báo giảm sức chứa slot, hỗ trợ bàn phím, focus trap và đóng bằng phím `Escape`.
  - `TSK-P2-01 / APP-08`: Chống trùng lặp yêu cầu gửi lên máy chủ (Double-Click Prevention) bằng cách vô hiệu hóa button (`disabled={submitting}`) khi đang gửi request tại các trang:
    - `CreateMerchantParkingLotPage` (SCR-029)
    - `EditMerchantParkingLotPage` (SCR-031)
    - `MerchantSlotsPage` (SCR-032)
  - `TSK-P1-01 / APP-07`: Xuất báo cáo mặt bằng bến bãi định dạng file CSV chuẩn UTF-8 BOM (`\uFEFF`), hỗ trợ Excel đọc ngay font tiếng Việt không bị lỗi font ký tự.
  - `ISSUE-NUM-02 / SAFE-01`: Khóa ràng buộc bất biến thực địa (Occupied Invariant):
    - Ngăn chặn triệt để tình trạng giảm cấu hình sức chứa (`totalCapacity`) xuống dưới số lượng xe đang đỗ thực tế (`occupiedCapacity`).
    - Nút giảm `[-]` tự động disabled khi `totalCapacity === occupiedCapacity`.
    - Input nhập số tự động ép về ngưỡng tối thiểu và hiển thị cảnh báo giải trình nếu người dùng nhập tay số nhỏ hơn lượng xe đang lưu bãi.
    - Khắc phục lỗi `toFixed` tiềm ẩn khi `occupancyRate` là undefined bằng fallback an toàn `(metrics.occupancyRate ?? 0).toFixed(1)`.
  - `ISSUE-AI-01`: Tích hợp trợ lý AI logistics Fretrix-Dispatch-V3 tạo mô tả tự động 3 phân đoạn (Khả năng tiếp vận, Nội quy PCCC, Phân luồng tiếp cận), bổ sung `timerRef` dọn dẹp bộ nhớ trên `useEffect` chống memory leak khi unmount.
* **COMPONENTS VÀ MODALS CHÍNH:**
  - [`MerchantDashboardPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx)
  - [`RevenueVolumeComboChart.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/dashboard/components/RevenueVolumeComboChart.tsx)
  - [`MerchantParkingLotsMetrics.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/components/MerchantParkingLotsMetrics.tsx)
  - [`CreateParkingLotAiWidget.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/components/CreateParkingLotAiWidget.tsx)
  - [`MerchantLotGallery.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/components/detail/MerchantLotGallery.tsx)
  - [`MerchantLotCapacitySection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/components/detail/MerchantLotCapacitySection.tsx)
  - [`MerchantLotLiveVehiclesTable.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/components/detail/MerchantLotLiveVehiclesTable.tsx)
  - [`EditMerchantLockoutWarning.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/components/edit/EditMerchantLockoutWarning.tsx)
  - [`EditMerchantInspectionHistoryModal.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/parking-lots/components/edit/EditMerchantInspectionHistoryModal.tsx)
  - [`SlotCategoryCard.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/slots/components/SlotCategoryCard.tsx)
  - [`ConfirmDecreaseModal.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/slots/components/ConfirmDecreaseModal.tsx)

---

## 2. KẾT QUẢ TRIỂN KHAI CHI TIẾT THEO CÁC PHASE

### PHASE 1 — PRECHECK & CONTRACT VALIDATION
- Đã kiểm tra tính toàn vẹn của mã nguồn thuộc 4 module lõi:
  - `src/features/merchant/dashboard`
  - `src/features/merchant/profile`
  - `src/features/merchant/parking-lots`
  - `src/features/merchant/slots`
- Đối chiếu toàn diện hợp đồng giao tiếp API Backend Spring Boot:
  - `/api/v1/merchant/dashboard/*`
  - `/api/v1/merchant/profile` & `/api/v1/merchant/profile/documents`
  - `/api/v1/merchant/parking-lots` & `/api/v1/merchant/parking-lots/metrics`
  - `/api/v1/merchant/parking-lots/:id` & `/api/v1/merchant/parking-lots/:id/images`
  - `/api/v1/merchant/parking-lots/:id/slots/bulk`

### PHASE 2 — SCREEN-BY-SCREEN AUDIT & CAPABILITY MATRIX
1. **`SCR-026: MerchantDashboardPage` (`/merchant`, `/merchant/dashboard`):**
   - **Mục đích:** Trung tâm chỉ huy vận hành và giám sát doanh thu tổng thể của đối tác chủ bãi.
   - **Capabilities:**
     - 4 thẻ Bento KPI tài chính: Tổng Doanh Thu Tháng (Net), Tỷ Lệ Lấp Đầy Trung Bình, Lượt Check-in Hôm Nay, Lệnh Rút Tiền Đang Chờ.
     - Biểu đồ kết hợp cột & đường phân tích doanh thu và lưu lượng xe ra vào theo thời gian thực (`RevenueVolumeComboChart`).
     - Bảng kê danh sách xe đang lưu bãi (`LiveManifestMiniTable`) kèm biển số, mã slot và trạng thái nợ phí/quá giờ.
     - Điều khiển trạm quét Barie ALPR và điều hướng một chạm tới đăng ký bãi đỗ mới.
2. **`SCR-027: MerchantProfilePage` (`/merchant/profile`):**
   - **Mục đích:** Quản lý thông tin định danh pháp lý chủ bãi, giấy phép kinh doanh bến bãi và thông tin tài khoản thụ hưởng thanh toán.
   - **Capabilities:**
     - Form chỉnh sửa thông tin liên hệ và người liên hệ khẩn cấp 24/7.
     - Tải lên giấy tờ pháp lý (GPKD, chứng nhận PCCC) với cơ chế kiểm soát dung lượng file (< 5MB) và định dạng PDF/hình ảnh.
     - Bảo vệ thông tin tài khoản ngân hàng bằng mặt nạ (`******34567`), hỗ trợ nút bấm một chạm chuyển đổi hiển thị/ẩn số tài khoản thụ hưởng.
3. **`SCR-028: MerchantParkingLotsPage` (`/merchant/parking-lots`):**
   - **Mục đích:** Danh mục quản lý mặt bằng và năng lực tiếp nhận phương tiện.
   - **Capabilities:**
     - 3 thẻ Bento KPI: Tổng Cơ Sở Khai Thác, Năng Lực Tiếp Nhận (tổng slot, slot đang sử dụng, chỗ trống), Doanh Thu Tích Lũy Hôm Nay.
     - Hỗ trợ chuyển đổi chế độ xem Grid (lưới trực quan) và Table (danh sách chi tiết).
     - Bộ lọc tìm kiếm thời gian thực theo từ khóa bãi xe, địa chỉ và trạng thái phê duyệt (`ALL`, `APPROVED`, `PENDING_APPROVAL`, `CHANGES_REQUESTED`, `REJECTED`).
     - Xuất báo cáo mặt bằng hạ tầng hỗ trợ tải tệp CSV UTF-8 BOM chuẩn.
4. **`SCR-029: CreateMerchantParkingLotPage` (`/merchant/parking-lots/new`):**
   - **Mục đích:** Quy trình 3 bước khai báo và gửi thẩm định cơ sở bãi đỗ xe thương mại mới.
   - **Capabilities:**
     - Bước 1 (Thông Tin Cơ Bản & Tiện Ích): Khai báo tên thương mại, địa chỉ, tiện ích (sạc điện 380V, trạm cân 100T, bảo vệ 24/7), album ảnh hiện trường kiểm định.
     - Trợ lý AI Fretrix-Dispatch-V3: Tự động tổng hợp 3 phân đoạn mô tả chuyên nghiệp và nút đồng bộ một chạm vào form.
     - Bước 2 (Tọa Độ GPS & Ranh Giới Mặt Bằng): Nhập tọa độ chuẩn WGS-84 RTK, ghim vị trí cổng vào Barie ALPR trên bản đồ trực quan.
     - Bước 3 (Hồ Sơ PCCC & Xác Nhận Gửi Duyệt): Kiểm tra toàn bộ hồ sơ, cam kết quy chuẩn PCCC và nộp duyệt lên hội đồng Admin.
     - Hỗ trợ lưu nháp cục bộ vào `localStorage` tự động khôi phục khi tải lại trang.
5. **`SCR-030: MerchantParkingLotDetailPage` (`/merchant/parking-lots/:parkingLotId`):**
   - **Mục đích:** Hồ sơ kỹ thuật và trung tâm điều hành bãi đỗ thực địa.
   - **Capabilities:**
     - Băng thông tin nhận diện: Mã định danh quốc tế (`VN-SGN-CLG2-09`), nhãn trạng thái phê duyệt và các nút tác vụ nhanh.
     - Thư viện ảnh thực tế hạ tầng với cơ chế Lightbox phóng to ảnh chất lượng cao kèm điều khiển bàn phím phím `Escape`.
     - Phân bổ tải trọng & sức chứa slot theo từng phân khu mặt bằng.
     - Biểu phí niêm yết đang áp dụng (giờ cơ bản, cao điểm, qua đêm, cọc giữ chỗ).
     - Giám sát luồng xe đang đỗ thực tế (Live Telemetry) cảnh báo phương tiện đỗ quá hạn.
     - Khóa chức năng chỉnh sửa sức chứa/biểu phí nếu bãi chưa được phê duyệt (`PENDING_APPROVAL`).
6. **`SCR-031: EditMerchantParkingLotPage` (`/merchant/parking-lots/:parkingLotId/edit`):**
   - **Mục đích:** Chỉnh sửa và cập nhật hồ sơ bãi đỗ theo yêu cầu bổ sung từ hội đồng thẩm định Admin.
   - **Capabilities:**
     - Lockout Mode: Khóa form và hiển thị cảnh báo an toàn nếu bãi đã ở trạng thái `APPROVED` (không cho phép tự ý sửa đổi khi đã thẩm định chính thức).
     - Tiếp nhận biên bản yêu cầu bổ sung từ hội đồng thẩm định Admin (`CHANGES_REQUESTED`), hiển thị chi tiết các hạng mục cần khắc phục.
     - Hiệu chỉnh tọa độ ghim GPS Barie (+15m tim đường) và khôi phục tọa độ ban đầu.
     - Hỗ trợ lưu bản nháp nội bộ vào `localStorage` có thông báo phản hồi người dùng.
     - Hộp thoại xem lịch sử thẩm định qua các đợt xét duyệt (`InspectionHistoryModal`) hỗ trợ phím `Escape`.
7. **`SCR-032: MerchantSlotsPage` (`/merchant/parking-lots/:parkingLotId/slots`):**
   - **Mục đích:** Ma trận cấu hình sức chứa bãi đỗ phân bổ theo 5 chủng loại phương tiện.
   - **Capabilities:**
     - 5 phân lớp phương tiện quy chuẩn:
       1. `Container 40FT / 45FT Reefer & Khô`
       2. `Xe Tải Nặng 3-4 Chân & Đầu Kéo Bobtail`
       3. `Xe Tải Trung & Nhẹ`
       4. `Xe Khách & Xe Đưa Đón Chuyên Dụng`
       5. `Xe Ô Tô Con & Xe Hỗ Trợ Kỹ Thuật`
     - Khóa ràng buộc bất biến thực địa: Vô hiệu hóa nút giảm khi `totalCapacity === occupiedCapacity`, ngăn chặn phát sinh xung đột chỗ đỗ thực địa.
     - Tăng/giảm linh hoạt qua bộ điều khiển Stepper `[-] / [+]` và cập nhật KPI tổng tải trọng mặt bằng theo chuẩn TCVN 4054:2005.
     - Nút "Khôi Phục Gốc (Hủy Thay Đổi)" khôi phục ma trận về trạng thái ban đầu.
     - Khi giảm sức chứa, hệ thống tự động kích hoạt `ConfirmDecreaseModal` yêu cầu xác nhận trước khi lưu hàng loạt (`LƯU CẤU HÌNH SỨC CHỨA HÀNG LOẠT`).

---

## 3. BẢNG TỔNG HỢP KIỂM THỬ TỰ ĐỘNG (VERIFICATION SUITE)

Đã khởi chạy toàn bộ 8 test suite đơn vị và tích hợp cho toàn bộ phân hệ Merchant Yard Infrastructure:

| STT | File Test Suite | Số Test | Kết Quả | Ghi Chú |
|:---:|:---|:---:|:---:|:---|
| 1 | `Batch14DMerchantYardIntegration.test.tsx` | 7 | **7/7 PASSED** | Kiểm thử tích hợp luồng toàn diện SCR-026 đến SCR-032 |
| 2 | `MerchantDashboardPage.test.tsx` | 3 | **3/3 PASSED** | Kiểm thử 4 Bento KPIs, biểu đồ lưu lượng và danh sách xe |
| 3 | `MerchantProfilePage.test.tsx` | 7 | **7/7 PASSED** | Kiểm thử xác thực hồ sơ, mask tài khoản ngân hàng và upload giấy tờ |
| 4 | `MerchantParkingLotsPage.test.tsx` | 11 | **11/11 PASSED** | Kiểm thử 3 Bento KPIs, lọc bãi xe, modal xuất CSV UTF-8 BOM và phím Escape |
| 5 | `CreateMerchantParkingLotPage.test.tsx` | 7 | **7/7 PASSED** | Kiểm thử wizard 3 bước, AI Fretrix Copilot, lưu nháp và chống duplicate submit |
| 6 | `MerchantParkingLotDetailPage.test.tsx` | 6 | **6/6 PASSED** | Kiểm thử chi tiết hồ sơ, thư viện ảnh Lightbox Escape key và khóa duyệt |
| 7 | `EditMerchantParkingLotPage.test.tsx` | 9 | **9/9 PASSED** | Kiểm thử lockout mode APPROVED, lưu nháp nội bộ, hiệu chỉnh GPS và modal lịch sử |
| 8 | `MerchantSlotsPage.test.tsx` | 7 | **7/7 PASSED** | Kiểm thử ma trận 5 loại xe, khóa ràng buộc bất biến occupied, bulk save và confirm modal |
| **TỔNG** | **8 Test Suites** | **57** | **57/57 PASSED (100%)** | **Hoàn toàn sạch lỗi (Zero Unhandled Errors)** |

---

## 4. KẾT QUẢ KIỂM TRA TYPE & PRODUCTION BUILD

1. **Kiểm tra TypeScript (`npx tsc -b`):**
   ```text
   > tsc -b
   Exit Code: 0 (Zero Errors)
   ```
2. **Kiểm tra Production Build (`npm run build`):**
   ```text
   vite v6.4.5 building for production...
   ✓ 2585 modules transformed.
   rendering chunks...
   computing gzip size...
   dist/assets/MerchantSlotsPage-CagT-zYs.js              39.45 kB │ gzip: 10.87 kB
   dist/assets/MerchantParkingLotsPage-CnLDbTGd.js        44.25 kB │ gzip: 11.12 kB
   dist/assets/CreateMerchantParkingLotPage-z8TC7u_E.js   49.63 kB │ gzip: 12.71 kB
   dist/assets/EditMerchantParkingLotPage-C1C1Glre.js     50.28 kB │ gzip: 12.58 kB
   dist/assets/MerchantParkingLotDetailPage-C20ukwUd.js   50.52 kB │ gzip: 11.43 kB
   ✓ built in 14.98s
   Exit Code: 0 (Build Thành Công Tuyệt Đối)
   ```

---

## 5. ĐÁNH GIÁ REGRESSION & ĐỒNG BỘ TƯƠNG THÍCH

- **Tương thích ngược:** Toàn bộ component và trang của Merchant Yard tuân thủ 100% contracts đã định nghĩa với hệ thống backend microservices Spring Boot. Không phát sinh bất kỳ thay đổi nào làm phá vỡ DTO hoặc interface hiện có.
- **Tương thích UI/UX:** Màu cam thương hiệu `#d95f00`, viền `border-slate-200`, hệ thống typo Sora / Inter / Mono và các nút thao tác đã được chuẩn hóa đồng bộ với các batch trước (`BATCH-14A`, `BATCH-14B`, `BATCH-14C`).
- **Khả năng tiếp cận:** Tất cả các thành phần tương tác (Lightbox, Stepper, Modal, Alert) đều hỗ trợ phím `Escape` và tuân thủ các quy tắc WAI-ARIA.

---

## 6. KẾT LUẬN & TRẠNG THÁI TIẾP THEO

- **BATCH-14D (Merchant Yard Infrastructure: SCR-026 -> SCR-032):** **HOÀN THÀNH 100%**.
- Sẵn sàng chuyển tiếp sang **BATCH-14E: Merchant Gate, Bookings & Finance (`SCR-033` đến `SCR-036`)** khi có chỉ đạo từ Quản trị viên dự án.

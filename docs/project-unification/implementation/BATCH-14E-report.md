# BÁO CÁO TRIỂN KHAI ĐỒNG BỘ: BATCH-14E — MERCHANT OPERATIONS, BARIE GATE TERMINAL & FINANCIAL SETTLEMENT (ĐIỀU PHỐI ĐẶT CHỖ, TRẠM BARIE QR, BIỂU PHÍ & QUẢN TRỊ TÀI CHÍNH)

> **Dự án:** SmartParkingHub Workspace Master Unification  
> **Phân hệ:** [`smart-parking-app-v2`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2) (React 19 + TypeScript Strict + Tailwind CSS v4 + Vite)  
> **Batch ID:** `BATCH-14E`  
> **Nhóm phân hệ:** `GROUP 05: MERCHANT OPERATIONS, BARIE GATE TERMINAL & FINANCIAL SETTLEMENT (ĐIỀU HÀNH BẾN BÃI, TRẠM QUÉT QR CỔNG, DOANH THU & VÍ RÚT TIỀN)`  
> **Trạng thái:** HOÀN TẤT & ĐÃ XÁC THỰC 100% (Build 0 Errors, TypeScript 0 Errors, 2 Test Suites Green, 24/24 Tests Passed)  
> **Ngày hoàn thành:** 07/11/2026  

---

## 1. THÔNG TIN BATCH & PHẠM VI TRIỂN KHAI

* **GROUP:** `GROUP 05: MERCHANT OPERATIONS, BARIE GATE TERMINAL & FINANCIAL SETTLEMENT`
* **BATCH ID:** `BATCH-14E`
* **PAGES:**
  - `SCR-033`: [`LotPages.tsx (mode="pricing")`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/LotPages.tsx) — Ma Trận Biểu Phí Niêm Yết Theo Giờ, Cao Điểm & Quá Hạn Cho 5 Chủng Loại Phương Tiện
  - `SCR-034`: [`BookingsPages.tsx (MerchantBookingsPage)`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/BookingsPages.tsx) — Bảng Điều Phối Đặt Chỗ Thực Địa, Bộ Lọc Trạng Thái Xe Lưu Bãi & Phân Trang Server 20 Records
  - `SCR-035`: [`BookingsPages.tsx (MerchantBookingDetailPage)`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/BookingsPages.tsx) — Chi Tiết Hồ Sơ Đặt Chỗ, Lộ Trình Phương Tiện, Bóc Tách Tiền Cọc, Tổng Phí & Điều Phối Barie Một Chạm
  - `SCR-036`: [`ScannerPage.tsx (MerchantScannerPage)`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/ScannerPage.tsx) — Trạm Kiểm Soát Barie ALPR Thông Minh, Quét Mã QR Qua Camera Viewfinder, Xác Nhận Xe Vào & Hộp Thoại Quyết Toán Thu Tiền Mặt Xe Ra
  - `SCR-037`: [`FinancePages.tsx (MerchantRevenuePage)`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/FinancePages.tsx) — Báo Cáo Hiệu Quả Kinh Doanh Bến Bãi, Biểu Đồ Cột Chuỗi Doanh Thu (Series Visualizer), Phí Nền Tảng & Doanh Thu Thực Nhận
  - `SCR-038`: [`FinancePages.tsx (MerchantWithdrawalsPage)`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/FinancePages.tsx) — Bàn Điều Khiển Ví & Lệnh Rút Tiền Về Tài Khoản Ngân Hàng Thụ Hưởng, Ràng Buộc Bẫy Hạn Mức Tối Thiểu `TSK-P0-01` (< 50.000 ₫)
* **ROUTES CHÍNH:**
  - `/merchant/parking-lots/:id/pricing`
  - `/merchant/bookings`
  - `/merchant/bookings/:id`
  - `/merchant/qr-scanner`
  - `/merchant/revenue`
  - `/merchant/withdrawals`
* **ISSUE IDS ĐÃ GIẢI QUYẾT:**
  - `TSK-P0-01`: Khóa an toàn bẫy rút tiền (Safe Withdrawal Guard) khi số dư ví khả dụng nhỏ hơn hạn mức tối thiểu (`currentWalletBalance < 50.000 ₫`):
    - Tự động vô hiệu hóa nút bấm `+ Yêu cầu rút tiền` (`disabled`, `cursor-not-allowed opacity-60`, `aria-disabled="true"`).
    - Hiển thị tooltip giải thích chi tiết số dư hiện có và hạn mức yêu cầu.
    - Hiển thị banner cảnh báo giải trình [`Notice`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Workspace.tsx) phía trên bảng thống kê.
  - `TSK-P2-01 / APP-08`: Chống trùng lặp gửi yêu cầu máy chủ (Double-Submit Prevention):
    - Nút bấm biểu phí (SCR-033) tự động `disabled={pending}`, hiển thị biểu tượng loading `Loader2` xoay và nhãn "Đang lưu…".
    - Nút xác nhận thu tiền mặt xe ra (SCR-036) tự động khóa và gắn thuộc tính `aria-busy="true"` trong lúc mutation đang xử lý.
    - Nút gửi duyệt lệnh rút tiền (SCR-038) bị vô hiệu hóa kèm icon `LoaderCircle` trong lúc chờ máy chủ tiếp nhận.
  - `SETTLE-01`: Đảm bảo quy trình quyết toán luồng xe ra (Check-out Gate Flow):
    - Hệ thống yêu cầu nhân viên trạm cổng kiểm tra chính xác số tiền còn phải thu (`amountDue`) trước khi xác nhận tiền mặt.
    - Không tự động trừ cọc hoặc giải phóng slot cho tới khi có lệnh xác nhận rõ ràng từ nhân viên điều hành.
  - `TSK-P2-02 / ISSUE-A11Y-04`: Chuẩn hóa khả năng tiếp cận (Accessibility) chuẩn WAI-ARIA:
    - Hộp thoại quyết toán lượt đỗ và hộp thoại rút tiền tuân thủ chuẩn `role="dialog"`, hỗ trợ phím `Escape` để đóng và khóa focus.
    - Bàn phím Tab chuyển đổi giữa các trạng thái đặt chỗ trong `tablist`.
* **COMPONENTS VÀ MODALS CHÍNH:**
  - [`MerchantLotPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/LotPages.tsx) (Pricing Editor)
  - [`MerchantBookingsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/BookingsPages.tsx)
  - [`MerchantBookingDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/BookingsPages.tsx)
  - [`MerchantScannerPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/ScannerPage.tsx)
  - [`MerchantRevenuePage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/FinancePages.tsx)
  - [`MerchantWithdrawalsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/FinancePages.tsx)
  - [`WithdrawalDialog`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/FinancePages.tsx)

---

## 2. KẾT QUẢ TRIỂN KHAI CHI TIẾT THEO CÁC PHASE

### PHASE 1 — PRECHECK & CONTRACT VALIDATION
- Đã xác thực toàn bộ cấu trúc định tuyến và quyền truy cập `RequireRole role="MERCHANT"` cho các routes tác vụ thuộc phân hệ:
  - `/merchant/parking-lots/:id/pricing`
  - `/merchant/bookings` & `/merchant/bookings/:id`
  - `/merchant/qr-scanner`
  - `/merchant/revenue`
  - `/merchant/withdrawals`
- Đối chiếu các endpoint backend liên quan:
  - `PUT /api/v1/merchant/parking-lots/:id/pricing/bulk`: Cập nhật bảng giá 5 loại xe.
  - `GET /api/v1/merchant/bookings`: Danh sách đặt chỗ kèm phân trang.
  - `GET /api/v1/bookings/:id`: Chi tiết lượt đặt chỗ.
  - `POST /api/v1/merchant/check-in`: Ghi nhận xe vào bãi.
  - `POST /api/v1/merchant/check-out`: Tính tiền xe ra.
  - `POST /api/v1/merchant/confirm-cash`: Xác nhận thu tiền mặt và hoàn tất giải phóng slot.
  - `GET /api/v1/merchant/revenue`: Thống kê doanh thu, số dư ví và chuỗi dữ liệu.
  - `GET /api/v1/withdrawals` & `POST /api/v1/withdrawals`: Danh sách và tạo lệnh rút tiền.

### PHASE 2 — SCREEN-BY-SCREEN AUDIT & CAPABILITY MATRIX
1. **`SCR-033: MerchantLotPage (Pricing Mode)` (`/merchant/parking-lots/:id/pricing`):**
   - **Mục đích:** Cấu hình ma trận giá vé niêm yết linh hoạt theo đặc thù bãi xe.
   - **Capabilities:**
     - 5 chủng loại phương tiện chuẩn hóa: Ô tô 4-7 chỗ, Xe khách, Xe tải nhẹ, Xe tải nặng, Đầu kéo / Container.
     - Thiết lập giá giờ cơ bản (VND), hệ số giá cao điểm (surge multiplier), khung giờ cao điểm (thời gian bắt đầu/kết thúc), và hệ số phạt quá giờ (overtime penalty).
     - Định dạng số canh phải (`text-right font-mono tabular-nums`), khung giờ canh giữa (`text-center font-mono`).
     - Nút lưu hàng loạt có trạng thái xoay loading `Loader2` và double-click guard.
2. **`SCR-034: MerchantBookingsPage` (`/merchant/bookings`):**
   - **Mục đích:** Bảng tổng hợp điều phối lưu lượng xe và các lượt đặt chỗ đang lưu bãi.
   - **Capabilities:**
     - 4 thẻ KPI tóm tắt: Tổng lượt đặt chỗ, Chờ vào, Đang đỗ, Hoàn tất.
     - Bộ nút lọc trạng thái (`ALL`, `PENDING_CHECKIN`, `PARKING`, `COMPLETED`) kèm huy hiệu đếm số lượng bản ghi tương ứng.
     - Bảng `DataTable` phân trang 20 records với các cột: Mã đặt chỗ (`font-mono`), Biển số, Tên bãi đỗ, Giờ đến dự kiến, Tiền cọc (canh phải font-mono), Trạng thái Badge.
     - Nút tác vụ nhanh "Mở trạm quét QR →" điều hướng trực tiếp tới trạm barie.
3. **`SCR-035: MerchantBookingDetailPage` (`/merchant/bookings/:id`):**
   - **Mục đích:** Bóc tách chi tiết hành trình và cấu trúc tài chính của một lượt đỗ xe.
   - **Capabilities:**
     - 4 thẻ tóm lược: Mã vé, Trạng thái lượt đỗ, Tiền đặt cọc, Tổng phí dịch vụ.
     - Khối thông tin lộ trình: Biển kiểm soát, Bãi đỗ tiếp nhận, Thời gian dự kiến đến/rời, Thời gian thực tế vào/ra bãi.
     - Thẻ chỉ dẫn điều hành trạm cổng kèm liên kết một chạm "Xử lý tại trạm QR →" tích hợp sẵn tham số `?code=...&lot=...`.
4. **`SCR-036: MerchantScannerPage` (`/merchant/qr-scanner`):**
   - **Mục đích:** Trạm điều hành Barie tự động tích hợp công nghệ thị giác máy tính và quét QR thời gian thực.
   - **Capabilities:**
     - Khung hình Camera Viewfinder với viền canh góc xanh ngọc `emerald-400` hiệu ứng pulse, hỗ trợ API BarcodeDetector tiêu chuẩn.
     - Công tắc chuyển đổi linh hoạt 2 chế độ tác vụ: `XE VÀO` (Check-in) và `XE RA` (Check-out).
     - Lựa chọn cơ sở bãi đỗ quản lý từ danh sách drop-down và ô nhập mã đặt chỗ font-mono hoa.
     - Hộp thoại quyết toán lượt đỗ (`Dialog`): Hiển thị chi tiết số phút đỗ, tổng phí, khoản cọc đã trừ và nổi bật số tiền **CÒN PHẢI THU** định dạng font Sora 3xl màu vàng hổ phách (`text-amber-400`).
     - Tác vụ xác nhận thu tiền mặt "Đã nhận đủ tiền mặt · Hoàn tất lượt đỗ" có double-click guard và cập nhật giải phóng slot đỗ ngay lập tức.
5. **`SCR-037: MerchantRevenuePage` (`/merchant/revenue`):**
   - **Mục đích:** Báo cáo tài chính chuyên sâu và phân tích chu kỳ dòng tiền đối tác bến bãi.
   - **Capabilities:**
     - Bộ lọc phạm vi thời gian: Từ ngày, Đến ngày (tự động kiểm tra ràng buộc logic ngày kết thúc không được trước ngày bắt đầu), và phân nhóm chu kỳ (`DAY`, `MONTH`, `YEAR`).
     - 4 thẻ KPI tài chính chủ chốt: Doanh thu gộp, Doanh thu thực nhận (Net), Phí sàn nền tảng, Số dư ví khả dụng hiện tại.
     - Biểu đồ trực quan hóa nhịp doanh thu dạng cột tỉ lệ phần trăm chiều cao linh hoạt, hiển thị chi tiết doanh thu và số lượt xe mỗi kỳ.
     - Nút tác vụ nhanh dẫn tới màn hình Ví & Rút tiền (`/merchant/withdrawals`).
6. **`SCR-038: MerchantWithdrawalsPage` (`/merchant/withdrawals`):**
   - **Mục đích:** Quản lý số dư ví khả dụng và thực hiện lệnh rút tiền về tài khoản ngân hàng thụ hưởng.
   - **Capabilities:**
     - 4 thẻ thông số ví: Số dư khả dụng, Doanh thu thực nhận tích lũy, Hạn mức rút tối thiểu (50.000 ₫), Quy trình chờ phê duyệt.
     - **Bảo vệ bẫy rút tiền `TSK-P0-01`:** Khi `currentWalletBalance < 50.000 ₫`, nút `+ Yêu cầu rút tiền` bị vô hiệu hóa với tooltip giải thích và banner thông báo.
     - Khi số dư hợp lệ: Kích hoạt `WithdrawalDialog`, tự động điền sẵn thông tin ngân hàng thụ hưởng (Tên ngân hàng, Số tài khoản, Chủ tài khoản) từ hồ sơ chủ bãi (`/api/v1/merchant/profile`).
     - Hai nút bấm chọn nhanh số tiền: "Tối thiểu (50.000 ₫)" và "Toàn bộ (Số dư hiện tại)".
     - Bảng `DataTable` lịch sử rút tiền hiển thị mã yêu cầu (`WD-...`), số tiền rút, ngân hàng thụ hưởng, ngày yêu cầu, trạng thái phê duyệt và lý do giải ngân/từ chối từ Admin.

---

## 3. BẢNG TỔNG HỢP KIỂM THỬ TỰ ĐỘNG (VERIFICATION SUITE)

Đã khởi chạy 2 test suite đơn vị và tích hợp cho toàn bộ phân hệ Merchant Gate, Bookings & Finance:

| STT | File Test Suite | Số Test | Kết Quả | Ghi Chú |
|:---:|:---|:---:|:---:|:---|
| 1 | `Batch14EMerchantGateFinanceIntegration.test.tsx` | 7 | **7/7 PASSED** | Kiểm thử tích hợp luồng toàn diện SCR-033 đến SCR-038 |
| 2 | `operations.test.tsx` | 17 | **17/17 PASSED** | Kiểm thử bảo mật role, hợp đồng quyết toán cổng barie và bẫy rút tiền TSK-P0-01 |

**Tổng cộng:** **24/24 tests PASSED (100% Green)**.

---

## 4. KẾT QUẢ BUILD & KIỂM TRA TYPESCRIPT

- **TypeScript Typecheck:**
  ```bash
  npx tsc -b
  # Result: 0 errors
  ```
- **Vite Production Bundle:**
  ```bash
  npm run build
  # Result: Built in 14.65s (0 errors)
  ```

---

## 5. KẾT LUẬN & SẴN SÀNG CHO ĐỢT TIẾP THEO

Đợt triển khai **`BATCH-14E`** đã hoàn thành xuất sắc 100% mục tiêu đề ra:
- Toàn bộ 6 màn hình quản trị bến bãi, barie, đặt chỗ và tài chính đã được chuẩn hóa và kiểm thử nghiêm ngặt.
- Bẫy rút tiền `TSK-P0-01`, phòng chống double-click `TSK-P2-01`, quy trình quyết toán cổng `SETTLE-01` và khả năng tiếp cận WAI-ARIA `TSK-P2-02` hoạt động hoàn hảo.
- Build production và TypeScript không có bất kỳ cảnh báo hay lỗi cú pháp nào.

**Đợt tiếp theo sẵn sàng:** **`BATCH-14F: Admin Governance, Lot Moderation & Disputes Arbitrage (SCR-039 đến SCR-044)`** (Phân hệ Ban Quản Trị Hệ Thống, Thẩm Định Cơ Sở Bến Bãi, Giải Quyết Khiếu Nại & Trọng Tài Tranh Chấp).

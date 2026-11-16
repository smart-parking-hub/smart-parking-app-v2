# Báo Cáo Đánh Giá Kỹ Thuật (Review) Pull Request #81

> **Dự án:** `smart-parking-app-v2` (Modern CRM Frontend)  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (19-Step Workflow, Anti-AI Slop, Finding Standard & React/TS Adapter)  
> **Thời điểm rà soát:** 2026-11-15T14:00:00+07:00  
> **Commit SHA rà soát:** `7d8e02bdb7aacfd16aa74160857d88d48d21f571` (refs/pull/81/head)  
> **Quyết định đề xuất:** ✅ **APPROVE (Phê duyệt để Merge vào nhánh `main`)**

---

## 1. Thông Tin Tổng Quan Pull Request

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Pull Request** | [#81 - fix(booking): Improve ticket usability and prevent repeated check-in](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/81) |
| **Tác giả** | `@lochuynh22` |
| **Nhánh nguồn (Head)** | `fix/booking-usability` (`7d8e02b`) |
| **Nhánh đích (Base)** | `main` |
| **Phạm vi thay đổi** | 35 files (`+383` dòng / `-179` dòng) |
| **Tương thích Merge** | `Clean` (Không xung đột với nhánh `main` mới nhất) |
| **Trạng thái CI (Check Runs)** | ✅ `Vercel Preview Comments`: SUCCESS<br/>✅ `Frontend Quality Gate & Validation`: SUCCESS |
| **PR Backend đồng hành** | [smart-parking-service-microservice #49](https://github.com/smart-parking-hub/smart-parking-service-microservice/pull/49) *(Chuẩn hóa múi giờ Việt Nam)* |

---

## 2. Tóm Tắt Đánh Giá (Executive Summary)

PR #81 tập trung giải quyết triệt để 5 vấn đề cốt lõi về trải nghiệm người dùng (UX), độ ổn định hiển thị và tính toàn vẹn nghiệp vụ vé đặt chỗ:

1. **Tối ưu hóa màn hình Quản lý Vé đặt chỗ (`/bookings` - `MyBookingsPage.tsx`):**
   - Chuyển đổi từ danh sách render đồng loạt tất cả panel chi tiết (kèm QR lớn) sang danh sách dạng thẻ gọn gàng (compact cards) xếp trên lưới responsive (`xl:grid-cols-2`).
   - Tích hợp phân trang phía server (`fetchBookingsPage(page, 8)`) với `sort: 'createdAt,desc'` đúng chuẩn Spring Data Pageable của backend `/api/v1/bookings`.
   - Cơ chế Accordion mở rộng độc lập từng vé ("Xem vé & chi tiết" / "Thu gọn") có đầy đủ thuộc tính trợ năng `aria-expanded` và `aria-controls`. Tự động bung chi tiết nếu chỉ có 1 vé duy nhất trên trang.
   - Giữ nguyên 100% tính năng nghiệp vụ: thanh toán cọc PayOS, tải/hiển thị QR code, thanh toán quyết toán ra bãi, khiếu nại (CreateDisputeModal), phản ánh và đánh giá.

2. **Chặn lỗi lặp check-in tại cổng trực barie (`/merchant/operations` - `ScannerPage.tsx`):**
   - Theo dõi trạng thái đã check-in trong phiên (`checkedIn.current`). Khi vé đã check-in thành công, nút quét chuyển sang trạng thái disabled với nhãn `'Xe đã check-in'` kèm thông báo hướng dẫn trực quan.
   - Chặn hoàn toàn việc mở lại dialog thành công khi ấn nhầm hoặc quét lại mã đã vào bãi.

3. **Chuẩn hóa bản đồ và tìm kiếm bãi đỗ (`SearchParkingPage.tsx`, `InlineQuickBookPanel.tsx`):**
   - Loại bỏ việc tự động chọn mặc định bãi đỗ đầu tiên (`selectedLotId: null` ban đầu và reset khi mount trang). Bản đồ chỉ tập trung vào bãi đỗ khi tài xế chủ động click chọn.
   - Chuẩn hóa văn bản: Loại bỏ nhãn gây hiểu lầm "10P" (`ĐẶT GIỮ CHỖ 10P` -> `ĐẶT GIỮ CHỖ`) để khớp đúng quy định giữ cọc 15 phút của server.
   - Bản địa hóa loại phương tiện sang tiếng Việt (`Ô tô con`, `Xe khách`, `Xe tải nhẹ`, `Xe tải nặng`, `Xe container`).

4. **Kênh thông báo quản trị viên tự động (`AdminLayout.tsx`, `useAdminNotifications.ts`, `AdminNotificationFeed.tsx`):**
   - Thêm nút chuông thông báo kèm chấm đỏ `UnreadNotificationDot` trực tiếp trên thanh Topbar của Admin Layout.
   - Thiết lập tự động làm mới mỗi 15 giây (`refetchInterval: 15000`) và khi focus lại cửa sổ (`refetchOnWindowFocus: true`).
   - Bổ sung nút liên kết trực tiếp tới hồ sơ thẩm định bãi xe (`/admin/parking-lots/{targetId}`) đối với các thông báo liên quan đến duyệt bãi (`PARKING_LOT`).

5. **Làm sạch mã kiểm thử E2E Playwright (`quick-hold-redesign.spec.ts`):**
   - Loại bỏ đoạn mã hack tạo React Root thủ công trong `page.evaluate()`, chuyển sang điều hướng thực tế trên trình duyệt với API mock qua `page.route()`, loại bỏ nguy cơ crash do nạp React 2 lần.

---

## 3. Bảng Tổng Hợp Điểm Phát Hiện (Findings Matrix)

| ID | Tiêu đề | Phân loại | Mức độ (Severity) | Độ tin cậy (Confidence) | Mức ưu tiên (Priority) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **F-01** | Khai báo object mapping nhãn loại xe và danh sách trạng thái inline trong vòng lặp render | `performance` / `ai-slop` | **Suggestion** | **High** | **P4** |
| **F-02** | Khuyến nghị theo dõi tiến độ hoàn tất F-01 của PR backend companion #49 | `process` | **Suggestion** | **High** | **P4** |

---

## 4. Chi Tiết Các Điểm Phát Hiện

### F-01: Khai báo object mapping nhãn inline trong render (Suggestion — P4)

- **Vị trí:**
  - `src/features/booking-flow/ReservationFlow.tsx#L47`
  - `src/features/bookings/pages/MyBookingsPage.tsx#L219`
- **Thực trạng:**
  - Tại `ReservationFlow.tsx`:
    ```tsx
    {({SEDAN_SUV:'Ô tô con',BUS_COACH:'Xe khách',LIGHT_TRUCK:'Xe tải nhẹ',HEAVY_TRUCK:'Xe tải nặng',CONTAINER:'Xe container'})[vehicle.vehicleType]}
    ```
    Object dictionary được khởi tạo lại mỗi lần map qua danh sách xe.
  - Tại `MyBookingsPage.tsx`:
    ```tsx
    {['AWAITING_FINAL_PAYMENT','COMPLETED','REVIEWED'].includes(booking.status) ? 'Phí quyết toán' : 'Phí dự kiến'}
    ```
    Mảng kiểm tra trạng thái được tạo lại trong mỗi card vé.
- **Đề xuất khắc phục (Polish):**
  - Trích xuất ra thành hằng số ngoài phạm vi component (ví dụ `VEHICLE_TYPE_VI_LABELS` và `SETTLED_STATUSES = new Set([...])`) để tối ưu bộ nhớ và tái sử dụng nhất quán giữa các màn hình.

---

### F-02: Phụ thuộc vào PR Backend đồng hành #49 (Process — P4)

- **Ngữ cảnh:**
  - PR #81 giải quyết toàn diện phần giao diện vé, giới hạn thời gian cọc 15 phút và hiển thị giờ Việt Nam.
  - Tuy nhiên, PR backend tương ứng ([#49](https://github.com/smart-parking-hub/smart-parking-service-microservice/pull/49)) hiện đang có điểm phát hiện Major (F-01) về việc chưa đồng bộ timezone ở controller và listener xác nhận thanh toán trên môi trường VPS UTC.
- **Khuyến nghị:**
  - Có thể merge PR frontend #81 độc lập vì frontend đã tương thích 100% với contract hiện tại của backend. Tuy nhiên, nhóm cần hoàn thiện bản sửa lỗi F-01 trên PR #49 trước khi triển khai đồng bộ lên VPS Production.

---

## 5. Kết Quả Xác Minh Cục Bộ (Local Verification)

Đã checkout trực tiếp commit `7d8e02bdb7aacfd16aa74160857d88d48d21f571` và thực thi kiểm thử:

1. **Kiểm tra kiểu dữ liệu TypeScript:**
   ```powershell
   npm run typecheck
   ```
   👉 **KẾT QUẢ:** `tsc --noEmit` hoàn thành với **0 lỗi**.

2. **Kiểm tra linter ESLint:**
   ```powershell
   npm run lint
   ```
   👉 **KẾT QUẢ:** **0 lỗi** (1 cảnh báo tiền khả thi tại `RegisterPage.tsx` không thuộc phạm vi PR).

3. **Kiểm tra đơn vị & tích hợp Vitest:**
   ```powershell
   npx vitest run src/features/bookings/ src/features/merchant/operations/ src/features/parking-search/ src/features/admin/
   ```
   👉 **KẾT QUẢ:** **20/20 test files passed (166/166 tests passed 100%)**.

---

## 6. Kết Luận & Quyết Định Đề Xuất

Pull Request **#81** đạt chất lượng kỹ thuật cao, tuân thủ nghiêm ngặt Hiến pháp Frontend CRM (`smart-parking-app-v2/AGENTS.md`), cải thiện rõ rệt trải nghiệm đặt chỗ và kiểm soát cổng barie.

👉 **QUYẾT ĐỊNH: ✅ APPROVE (Sẵn sàng để Merge vào `main`).**

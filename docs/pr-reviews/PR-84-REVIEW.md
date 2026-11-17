# Báo Cáo Đánh Giá Kỹ Thuật (Review) Pull Request #84

> **Dự án:** `smart-parking-app-v2` (Modern CRM Frontend)  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (19-Step Workflow, Anti-AI Slop, Finding Standard & React/TS Adapter)  
> **Thời điểm rà soát:** 2026-11-16T11:50:00+07:00  
> **Commit SHA rà soát:** `ad5480c41e699d8e9f6e46a14e515fcf70506e86` (refs/pull/84/head)  
> **Quyết định đề xuất:** ⚠️ **REQUEST CHANGES (Yêu cầu tinh chỉnh trước khi Merge vào nhánh `main`)**

---

## 1. Thông Tin Tổng Quan Pull Request

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Pull Request** | [#84 - fix(ui): unify feedback, validate registration and correct booking QR](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/84) |
| **Tác giả** | `@lochuynh22` |
| **Nhánh nguồn (Head)** | `fix/booking-usability` (`ad5480c41e699d8e9f6e46a14e515fcf70506e86`) |
| **Nhánh đích (Base)** | `main` (`bc51950dc31a737d15a113ab276e0d8e863fe7b5`) |
| **Tương thích Merge** | `Clean` (Không xung đột với nhánh `main` mới nhất) |
| **Phạm vi thay đổi** | **71 tập tin** (`+1.478` dòng / `-810` dòng) qua 5 commits |
| **Trạng thái CI** | ✅ `Frontend Quality Gate & Validation`: SUCCESS<br/>✅ `Vercel Preview Comments`: SUCCESS |
| **Số lượng commits** | 5 commits:<br/>- `5d42ded`: fix(ui): unify feedback and use real booking QR data<br/>- `b8ae50f`: test(ui): validate booking references and document review<br/>- `470637e`: fix(merchant): remove duplicate plus from lot registration buttons<br/>- `aff3825`: fix(scanner): explain invalid QR and wrong-lot rejections<br/>- `ad5480c`: fix(auth): validate registration and reveal duplicate field errors |

---

## 2. Tóm Tắt Đánh Giá (Executive Summary)

PR #84 mang lại nhiều cải tiến chất lượng cao, giải quyết triệt để mã giả (mock data), tăng cường tính an toàn dữ liệu và tối ưu trải nghiệm người dùng:

1. **Chuẩn hóa xác thực form đăng ký tài khoản (SCR-011):**
   - Đồng bộ 100% ràng buộc với DTO backend (`RegisterRequest.java`): Họ tên 2–100 ký tự, email tối đa 100 ký tự, CCCD 9 hoặc 12 số, số tài khoản ngân hàng 6–25 số.
   - Chuẩn hóa khoảng trắng và đầu số `+84` về `0`, giữ nguyên số `0` ở đầu cho CCCD/CMND.
   - Tự động phát hiện lỗi trùng số điện thoại/email từ API, tự động chuyển về đúng bước (step) và đưa con trỏ focus vào đúng ô input cần sửa.
2. **Loại bỏ hoàn toàn AI Slop & Fake Mock Data trên Dashboard tài xế (SCR-014):**
   - Gỡ bỏ hoàn toàn `fallbackDashboardData` chứa biển số và tên tài xế giả định.
   - Thay thế mã QR Barie tĩnh bằng component `<QRCodeSVG />` chuẩn thư viện, mã hóa trực tiếp `bookingCode` thực từ server, bỏ hậu tố bịa `-OUT`.
   - Chỉ cho phép mở mã QR xuất bãi khi xe đang ở trạng thái `PARKING` hoặc `OVERTIME`.
3. **Bảo vệ mã check-in chưa thanh toán cọc:**
   - Ẩn hoàn toàn mã `bookingCode` khi vé ở trạng thái `PENDING_PAYMENT`, chuyển sang hiển thị số đơn (`#<id>`) trên danh sách, chi tiết, trang kết quả và clipboard, ngăn ngừa việc tài xế lợi dụng mã vé trước khi đặt cọc.
4. **Chuẩn hóa thông báo lỗi máy quét QR (SCR-033):**
   - Phân biệt rõ ràng giữa vé thuộc bãi xe khác với vé không tồn tại hoặc chưa đến giờ check-in, đóng modal cho phép nhân viên quét lại ngay mà không bị treo.
5. **Đồng bộ hóa giao diện thông báo (Modal/Toast Consistency):**
   - Tái sử dụng `NotificationDialog` chuẩn `Dialog` của dự án cho các thông báo kết quả, giữ lại toast góc phải cho đăng nhập.
   - Sửa lỗi nút đăng ký bãi xe bị lặp icon dấu `+` và chữ `+`.

---

## 3. Bảng Tổng Hợp Điểm Phát Hiện (Findings Matrix)

| ID | Tiêu đề | Phân loại | Mức độ (Severity) | Độ tin cậy (Confidence) | Mức ưu tiên (Priority) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **F-01** | Vòng lặp duyệt phân trang tuần tự không giới hạn trong `fetchDriverDashboardData` trên chu kỳ polling 15s | `performance` | **Major** | **High** | **P2** |
| **F-02** | Bỏ sót toán tử an toàn (Optional Chaining) khi đọc DTO từ API response | `correctness` | **Minor** | **High** | **P3** |
| **F-03** | `NotificationDialog` thiếu nút hành động chính (`actionLabel`) ở các form thành công | `architecture` / `ux` | **Minor** | **High** | **P3** |
| **F-04** | PR gộp 5 domain nghiệp vụ độc lập trong 71 files vào cùng một lượt review | `process` | **Suggestion** | **High** | **P4** |

---

## 4. Chi Tiết Các Điểm Phát Hiện

### F-01: Vòng lặp duyệt phân trang tuần tự không giới hạn trên chu kỳ polling 15s (Major — P2)

- **Vị trí:** `src/features/driver/api/driverApi.ts` (dòng 31–35) kết hợp `src/features/driver/pages/DriverDashboardPage.tsx` (dòng 40).
- **Thực trạng:**
  ```typescript
  // src/features/driver/api/driverApi.ts
  for (let page = 1; page < firstPage.totalPages; page++) {
    const response = await apiClient.get<{ data: PageResponse<BookingResponse> }>('/api/v1/bookings', { params: { page, size: 100 }, signal })
    raw.push(...response.data.data.content)
  }
  ```
  Trong khi đó, `DriverDashboardPage.tsx` cấu hình:
  ```typescript
  refetchInterval: query => query.state.data?.activeBooking ? 15000 : false,
  ```
- **Tác động:** Nếu tài xế có số lượng đơn lớn (ví dụ 1.000 đơn = 10 pages), mỗi 15 giây hệ thống sẽ gửi 9 requests tuần tự liên tục. Điều này gây tốn băng thông, đơ trình duyệt và dễ bị chặn bởi API Gateway (HTTP 429 Too Many Requests).
- **Đề xuất khắc phục:** Chặn trên số trang duyệt tối đa (ví dụ 3 trang = 300 đơn) và dừng sớm nếu đã tìm thấy chuyến xe đang hoạt động (`PARKING` / `OVERTIME`):
  ```typescript
  const MAX_DASHBOARD_PAGES = 3
  const maxPages = Math.min(firstPage.totalPages, MAX_DASHBOARD_PAGES)
  for (let page = 1; page < maxPages; page++) {
    if (raw.some(b => b.status === 'PARKING' || b.status === 'OVERTIME')) break
    const response = await apiClient.get<{ data: PageResponse<BookingResponse> }>('/api/v1/bookings', { params: { page, size: 100 }, signal })
    raw.push(...response.data.data.content)
  }
  ```

---

### F-02: Bỏ sót toán tử an toàn (Optional Chaining) khi đọc DTO từ API response (Minor — P3)

- **Vị trí:** `src/features/driver/api/driverApi.ts` (dòng 28, 30, 42, 47).
- **Thực trạng:**
  - Nhánh `main` trước đây:
    ```typescript
    const vehicleTotal = vehiclesRes.data.data?.totalElements ?? 0
    ```
  - Trong PR #84:
    ```typescript
    const firstPage = bookingsRes.data.data
    const raw = [...firstPage.content]
    const vehicleTotal = vehiclesRes.data.data.totalElements
    bookingTotal: firstPage.totalElements
    ```
- **Tác động:** Nếu endpoint `/api/v1/vehicles` hoặc `/api/v1/bookings` trả về envelope `{ data: null }` (khi chưa có dữ liệu hoặc lỗi mạng), code sẽ crash ngay lập tức vì ngoại lệ `TypeError: Cannot read properties of undefined`.
- **Đề xuất khắc phục:** Khôi phục kiểm tra an toàn:
  ```typescript
  const firstPage = bookingsRes.data?.data ?? { content: [], totalElements: 0, totalPages: 0, currentPage: 0 }
  const raw = [...(firstPage.content ?? [])]
  const vehicleTotal = vehiclesRes.data?.data?.totalElements ?? 0
  ```

---

### F-03: `NotificationDialog` thiếu nút hành động chính (`actionLabel`) ở các form thành công (Minor — P3)

- **Vị trí:**
  - `src/features/merchant/profile/components/MerchantPasswordForm.tsx` (dòng 60)
  - `src/features/merchant/profile/components/MerchantProfileForm.tsx` (dòng 31)
  - `src/features/merchant/profile/components/ProfileDocuments.tsx` (dòng 55)
  - `src/features/merchant/slots/pages/MerchantSlotsPage.tsx` (dòng 236)
- **Thực trạng:** Khi đổi mật khẩu, lưu thông tin hồ sơ hoặc lưu cấu hình slot thành công, hộp thoại modal xuất hiện nhưng không có nút hành động xác nhận dưới chân modal. Người dùng phải bấm vào icon "X" nhỏ (40px) ở góc phải hoặc phím Escape để đóng.
- **Tác động:** Giảm tính tiện dụng trên thiết bị di động / màn hình cảm ứng, nơi người dùng quen bấm nút xác nhận to bản ở đáy màn hình.
- **Đề xuất khắc phục:** Bổ sung giá trị mặc định cho `actionLabel` trong `NotificationDialog.tsx`:
  ```typescript
  export function NotificationDialog({
    ...,
    actionLabel = 'Đã hiểu',
    ...
  }: NotificationDialogProps)
  ```

---

### F-04: PR gộp 5 domain nghiệp vụ trong 71 files vào cùng một lượt review (Suggestion — P4)

- **Vị trí:** Phạm vi tổng thể của PR #84.
- **Thực trạng:** PR bao gồm cả Auth Register (SCR-011), Driver Dashboard (SCR-014), Merchant Lots (SCR-028), QR Scanner (SCR-033) và Booking Payment Masking (SCR-017, SCR-035).
- **Đề xuất:** Trong các đợt phát triển tiếp theo, nên tách nhỏ PR theo domain (Auth riêng, Booking/Dashboard riêng) để giảm rủi ro hồi quy và tăng tốc độ merge.

---

## 5. Điểm Sáng & Chất Lượng Kỹ Thuật Nổi Bật

1. **Anti-AI Slop & Visual Authority:**
   - 100% tuân thủ thiết kế Stitch, không tự ý sáng tác thêm màu sắc, font chữ hay padding lệch chuẩn.
   - Toàn bộ mock data tĩnh và SVG giả lập đã bị xóa bỏ, thay bằng thư viện chuẩn `qrcode.react`.
2. **Khớp 100% Backend DTO Spring Boot:**
   - Các validation form đăng ký (độ dài họ tên, email, CCCD, số tài khoản ngân hàng, chuẩn hóa `+84`) khớp chính xác với `RegisterRequest.java` và `AuthRequest.java`.
3. **Bảo mật mã đặt chỗ:**
   - Bảo vệ mã check-in chưa thanh toán cọc ở cấp độ hiển thị, clipboard và tham số URL, phòng chống gian lận check-in.
4. **Kiểm thử tự động vững chắc:**
   - Bổ sung 22 test cases mới cho validation đăng ký (`RegisterValidation.test.tsx`).
   - 13 test suites Playwright E2E chạy xuyên suốt cả mobile 390px và desktop 1440px.
   - CI hoàn toàn xanh (`PASS`), 0 TypeScript error, 0 ESLint warning.

---

## 6. Kết Quả Xác Minh Kỹ Thuật (Verification Matrix)

| Hạng mục kiểm tra | Lệnh / Môi trường | Kết quả | Ghi chú |
| :--- | :--- | :---: | :--- |
| **TypeScript Typecheck** | `npm run typecheck` (`tsc -b`) | ✅ PASS | 0 lỗi kiểu dữ liệu |
| **ESLint** | `npm run lint` | ✅ PASS | 0 errors, 0 warnings |
| **Vitest Suite** | `npm run test` | ✅ PASS | 806/806 tests passed |
| **Playwright E2E** | CI Quality Gate (13 test files) | ✅ PASS | Bao gồm các spec mới về dashboard & UI consistency |
| **Production Build** | `npm run build` | ✅ PASS | Vite build tối ưu sạch sẽ |

---

## 7. Khuyến Nghị Hành Động (Next Steps)

1. Tác giả thực hiện chỉnh sửa 2 điểm chính trong `src/features/driver/api/driverApi.ts`:
   - Giới hạn số trang phân trang `maxPages = Math.min(firstPage.totalPages, 3)` và dừng sớm khi có chuyến xe đỗ.
   - Thêm fallback null-safe cho `vehiclesRes.data?.data` và `bookingsRes.data?.data`.
2. Cập nhật `actionLabel="Đã hiểu"` vào `NotificationDialog.tsx`.
3. Push commit bổ sung lên nhánh `fix/booking-usability`. Sau khi kiểm tra lại, PR đủ điều kiện **APPROVE & MERGE**.

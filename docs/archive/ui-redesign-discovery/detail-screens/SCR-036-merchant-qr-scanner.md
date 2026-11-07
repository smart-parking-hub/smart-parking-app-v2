# Screen Specification: SCR-036 MerchantQrScannerPage (Quét QR vào/ra bãi)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-036`
- **Screen Name:** Trạm kiểm soát quét mã QR Check-in & Check-out tại cổng (Merchant Gate QR Control)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/qr-scanner` (Định nghĩa tại [`AppRoutes.tsx:129`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L129) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantQrScannerPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/qr-scanner/pages/MerchantQrScannerPage.tsx)
- **Sub-components:**
  - [`QrCameraScanner.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/qr-scanner/components/QrCameraScanner.tsx) (Component giao tiếp Camera phần cứng quét mã QR)
  - Ant Design `Radio`, `Select`, `Input`, `Button`, `Modal`, `Descriptions`, `Alert`, `Skeleton`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp công cụ tác nghiệp thời gian thực tại cổng trạm dành cho nhân viên gác cổng/bảo vệ để kiểm soát luồng xe container và xe tải ra vào bãi đỗ.
2. Xác thực tính hợp lệ của mã QR check-in từ điện thoại của tài xế: Kiểm tra mã có đúng bãi đỗ đang chọn, đúng khung giờ cho phép vào (sớm tối đa 30 phút theo cấu hình hệ thống), và bãi đỗ còn slot vật lý hay không.
3. Tự động chuyển đổi trạng thái booking:
   - Khi xe vào cổng: Chuyển từ `PENDING_CHECKIN` sang `PARKING`, trừ 1 slot khả dụng (`availableCapacity - 1`).
   - Khi xe ra cổng: Tính toán số phút đỗ thực tế, tính tổng cước (kèm phí phạt quá giờ nếu có), trừ tiền cọc, giải phóng 1 slot khả dụng (`availableCapacity + 1`), kích hoạt hàng đợi ảo nhường chỗ cho xe tiếp theo (`queueService.offerNext`), và ghi nhận doanh thu vào ví Merchant.
4. Cung cấp cơ chế nhập mã bằng bàn phím dự phòng khi camera bị mờ hoặc màn hình tài xế bị vỡ.

### B. Target Users
- Nhân viên bảo vệ tại cổng bãi, quản lý trạm điều hành bến bãi.

### C. Entry Points
- Click mục "Quét QR" trên Sidebar menu của `MerchantLayout`.
- Click nút "Mở quét QR" từ trang Chi tiết đơn đặt chỗ (`SCR-035`).

### D. Exit Points
- Nút "Quét lượt tiếp theo": Reset giao diện kết quả và sẵn sàng đón xe kế tiếp.
- Chuyển sang mục "Doanh thu" (`SCR-037`) để xem số tiền vừa được đối soát vào ví.

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Quét QR check-in/check-out`.
- Mô tả phụ: `Chọn đúng bãi đang vận hành, rồi quét camera hoặc nhập booking code.`
- Cảnh báo bắt buộc: `Alert type="info"` ghi rõ: *"Bắt buộc khớp bãi: Mã QR của bãi khác sẽ bị từ chối, kể cả khi bạn cũng sở hữu bãi đó."*

### B. Lưới Xử Lý Quét Mã (.merchant-qr-grid)
Bố cục 2 phần song song:
1. **Khung Quét Camera ([`QrCameraScanner.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/qr-scanner/components/QrCameraScanner.tsx)):**
   - Tích hợp thư viện quét mã qua webcam/camera điện thoại.
   - Vùng quét video có khung định vị chữ nhật căn giữa.
   - Khi camera nhận diện được mã QR hợp lệ, tự động gán chuỗi vào trường `bookingCode` và phát tín hiệu rung/âm thanh.
2. **Khung Điều Khiển Thủ Công (.merchant-scanner-card):**
   - **Bãi đang vận hành:** Dropdown `Select showSearch` chọn bãi xe (chỉ ưu tiên danh sách bãi `APPROVED`).
   - **Chế độ vận hành:** `Radio.Group` dạng nút bấm:
     - `Check-in`: Dành cho xe vào bãi (Yêu cầu booking ở trạng thái `PENDING_CHECKIN`).
     - `Check-out`: Dành cho xe xuất bãi (Yêu cầu booking ở trạng thái `PARKING` hoặc `OVERTIME`).
   - **Ô nhập Booking Code:** Input text cho phép gõ hoặc dán mã thủ công, hỗ trợ phím Enter.
   - **Nút gửi:** Nút Primary to bản `Xác nhận check-in / check-out` (icon `SendOutlined`, loading `{submitting}`).

### C. Thẻ Hiển Thị Kết Quả Check-Out (.merchant-success-card)
Xuất hiện ngay sau khi quét xe ra cổng thành công:
- Tiêu đề H2: Icon `CheckCircleOutlined` màu xanh kèm chữ `Kết quả check-out`.
- Bảng `Descriptions bordered column={2}`:
  1. **Mã booking:** Chuỗi code.
  2. **Thời gian đỗ thực tế:** `{parkingMinutes} phút`.
  3. **Tổng tiền chuyến đi:** `{formatMoney(totalAmount)}`.
  4. **Tiền đã cọc trước:** `{formatMoney(advanceDeposit)}`.
  5. **Còn phải trả (Amount Due):** Con số in đậm lớn (ví dụ: `150.000 ₫`).
- Nhóm nút thao tác giải tỏa cổng:
  - Nếu `amountDue > 0`: Nút Primary `Xác nhận đã thu tiền mặt ({formatMoney(amountDue)})` (loading `{cashSubmitting}`).
  - Nút `Quét lượt tiếp theo` (xóa thẻ kết quả để tiếp tục đón xe khác).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-036-01** | Chọn bãi xe kiểm soát | Chọn bãi trong dropdown | `parkingLotId` | Bãi ở trạng thái APPROVED | Gán ngữ cảnh bãi xe cho mọi thao tác quét mã sau đó |
| **FN-036-02** | Chuyển chế độ Check-in/out | Chọn Radio Check-in hoặc Check-out | Enum `CHECK_IN` / `CHECK_OUT` | Đã chọn bãi | Đổi chế độ xử lý mã tương ứng |
| **FN-036-03** | Quét mã qua Camera | Đưa QR trước camera | Luồng video | Camera được cấp quyền | Tự động đọc và điền mã vào ô Booking code |
| **FN-036-04** | Xác nhận Check-in xe vào | Bấm `Xác nhận check-in` | `bookingCode`, `parkingLotId` | Booking PENDING_CHECKIN, đúng bãi, chưa hết hạn QR | Trừ 1 slot khả dụng, đổi trạng thái sang PARKING, toast thành công |
| **FN-036-05** | Xác nhận Check-out xe ra | Bấm `Xác nhận check-out` | `bookingCode`, `parkingLotId` | Booking PARKING hoặc OVERTIME, đúng bãi | Cộng 1 slot, tính cước, kích hoạt hàng đợi, hiển thị thẻ hóa đơn |
| **FN-036-06** | Thu tiền mặt tại cổng | Bấm `Xác nhận đã thu tiền mặt` | `bookingCode`, `parkingLotId` | Check-out có phát sinh amountDue > 0 | Mở modal xác nhận, gửi API confirm-cash, đổi trạng thái sang COMPLETED |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `POST /api/v1/merchant/check-in`: Ghi nhận xe vào bãi.
2. `POST /api/v1/merchant/check-out`: Ghi nhận xe ra bãi và tính cước.
3. `POST /api/v1/merchant/confirm-cash`: Xác nhận thu tiền mặt tại chỗ.

### B. Controller & Method
- [`MerchantController.java:37-48`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/MerchantController.java#L37-L48):
  - `checkIn(@AuthenticationPrincipal CustomUserDetails u, @Valid @RequestBody CheckInRequest req)` -> `@PreAuthorize("hasRole('MERCHANT')")`
  - `checkOut(@AuthenticationPrincipal CustomUserDetails u, @Valid @RequestBody CheckInRequest req)` -> `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`CheckInOutServiceImpl.java:50-182`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/CheckInOutServiceImpl.java#L50-L182):
  - **Check-in:**
    - Kiểm tra quyền sở hữu bãi và khớp mã: `assertMerchantOwnsLotAndBookingMatches`.
    - Kiểm tra trạng thái `PENDING_CHECKIN`.
    - Kiểm tra QR hết hạn (`booking.getExpiresAt().isBefore(now)`).
    - Kiểm tra giờ vào sớm: `now.isBefore(earliest)` (cho phép vào sớm tối đa `checkInEarlyMinutes = 30` phút).
    - Khóa bi quan slot: `findByParkingLotIdAndVehicleTypeForUpdate`, giảm `availableCapacity - 1`.
    - Đổi trạng thái sang `BookingStatusEnum.PARKING`, ghi log `AuditLog`.
  - **Check-out:**
    - Kiểm tra trạng thái `PARKING` hoặc `OVERTIME`.
    - Tính thời gian đỗ thực tế: `Math.ceil(minutes / 60.0)`.
    - Tính tiền cơ bản kèm phụ trội cao điểm: `rule.getBasePricePerHour() * hours * surge`.
    - Tính phí quá hạn (nếu ra trễ hơn `expectedCheckOutTime`): `overtimeHours * basePrice * penaltyMultiplier`.
    - Tính `amountDue = (total - deposit).max(0)`.
    - Nếu `amountDue == 0` hoặc demo mode: Đổi sang `COMPLETED`; nếu còn nợ tiền: Đổi sang `AWAITING_FINAL_PAYMENT`.
    - Cộng lại chỗ trống: `availableCapacity + 1`.
    - Kích hoạt hàng đợi ảo: `queueService.offerNext(parkingLotId, vehicleType)`.
    - Tự động kết chuyển doanh thu vào ví: `merchantWalletService.creditSettlement(...)`.

### D. Báo Cáo Tính Năng Thiếu Backend (Missing in Backend Gap)
- **Điểm phát hiện:** Trong Frontend [`merchantQrApi.ts:14-17`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/qr-scanner/api/merchantQrApi.ts#L14-L17) và UI nút bấm `handleConfirmCash` có gọi API `POST /api/v1/merchant/confirm-cash`. Tuy nhiên, kết quả rà soát toàn bộ Backend cho thấy **hoàn toàn chưa có endpoint `/api/v1/merchant/confirm-cash`** trong `MerchantController.java`. Nếu bảo vệ bấm nút này trong môi trường production, API sẽ trả về lỗi `404 Not Found`. Đây là chức năng chưa hoàn thiện cần bổ sung gấp dưới Backend.

---

## 6. UI STATES & ERROR HANDLING

- **Double-submit Protection:** Hệ thống sử dụng biến ref `lastSubmission.current` chặn gửi cùng một mã booking trong vòng 3 giây (`Date.now() - last.at < 3000`).
- **Wrong Lot Rejection:** Nếu quét mã thuộc bãi khác (dù cùng chủ sở hữu), Backend ném ngoại lệ: *"Mã booking này thuộc bãi khác (Tên bãi). Không thể check-in/out tại bãi đang chọn."*
- **Early Arrival Rejection:** Nếu tài xế đến sớm hơn 30 phút so với lịch đăng ký, báo lỗi: *"Chưa tới giờ check-in. QR chỉ dùng từ {earliest} (sớm tối đa 30 phút so với giờ đặt)."*
- **Capacity Lock:** Nếu bãi hết chỗ vật lý lúc check-in, báo lỗi: *"Bãi đang đầy chỗ vật lý. Không thể check-in lúc này."*

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Kiểm tra chéo Bãi đỗ vs Mã booking:** Bắt buộc bảo vệ phải chọn đúng bãi đang đứng trực và mã QR phải thuộc bãi đó để ngăn chặn việc quét nhầm làm sai lệch sức chứa giữa các cơ sở.
2. **Kích hoạt chuỗi giải phóng Slot & Hàng đợi ảo:** Khi check-out, bắt buộc phải hoàn trả slot và gọi `queueService.offerNext` để tài xế đang đợi ở `SCR-018` nhận được thông báo ngay lập tức.

### B. Đề Xuất Cải Thiện Cho Thiết Kế Mới
1. **Hoàn thiện ngay API `POST /api/v1/merchant/confirm-cash`:** Để hỗ trợ luồng thanh toán tiền mặt truyền thống tại cổng cho các bác tài lớn tuổi không dùng banking.
2. **Âm thanh phản hồi (Audio Beep Feedback):** Thêm âm thanh *"Bíp"* báo thành công và âm cảnh báo lỗi để bảo vệ không cần nhìn chăm chú vào màn hình điện thoại khi mở barie.

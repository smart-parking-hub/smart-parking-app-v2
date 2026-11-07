# Tái Hiện Các Luồng Nghiệp Vụ (Business Flow Reconstruction)

Tài liệu này mô tả chi tiết **12 luồng nghiệp vụ cốt lõi xuyên nhiều màn hình** của hệ thống SmartParkingHub, kết nối giữa giao diện người dùng, xử lý trạng thái và các API Backend tương ứng.

---

## 1. FLOW-01: Đăng Ký Tài Khoản Mới & Xác Thực OTP

- **Flow ID:** `FLOW-01`
- **Tên luồng:** Đăng ký tài khoản và phân luồng vai trò (Driver / Merchant)
- **Actor:** Người dùng mới (Khách vãng lai)
- **Tiền điều kiện:** Chưa có tài khoản gắn với số điện thoại hoặc email đăng ký.
- **Điểm bắt đầu:** Bấm nút "Đăng ký" tại header `SCR-001` hoặc link tại `SCR-010`.
- **Các bước thực hiện:**
  1. Người dùng truy cập `SCR-011: RegisterPage`.
  2. Chọn vai trò tài khoản: **Tài xế (`DRIVER`)** hoặc **Chủ bãi đỗ (`MERCHANT`)**.
  3. Nhập số điện thoại, email, mật khẩu.
  4. Nếu là `DRIVER`: Nhập Họ và tên, Số CCCD.
  5. Nếu là `MERCHANT`: Nhập Tên doanh nghiệp/Họ tên chủ bãi, Số CCCD, Tên ngân hàng, Số tài khoản ngân hàng thụ hưởng.
  6. Bấm "Gửi mã OTP": Hệ thống gọi API gửi mã xác thực về điện thoại.
  7. Nhập mã OTP 6 số (giao diện đếm ngược 60s resend).
  8. Bấm "Hoàn tất đăng ký": Hệ thống tạo bản ghi người dùng và chuyển hướng về `SCR-010: LoginPage` kèm thông báo thành công.
- **Màn hình liên quan:** `SCR-001` → `SCR-011` → `SCR-010`.
- **API calls:**
  - `POST /api/v1/auth/otp/send` `{ phone }`
  - `POST /api/v1/auth/register` `{ phone, email, password, otpCode, role, fullName, citizenId, bankName, bankAccountNum }`
- **Thay đổi dữ liệu:** Tạo bản ghi `users` (status=`ACTIVE`, role=`DRIVER`/`MERCHANT`), tạo bản ghi `drivers` hoặc `merchants` (kèm thông tin ví và ngân hàng).
- **Trạng thái chuyển đổi:** Tài khoản chuyển từ chưa tồn tại sang `ACTIVE`.
- **Kết quả thành công:** Người dùng có tài khoản hợp lệ để đăng nhập.
- **Trường hợp thất bại:**
  - Số điện thoại đã được đăng ký trước đó → Báo lỗi `400: Số điện thoại đã tồn tại`.
  - Mã OTP sai hoặc hết hạn → Báo lỗi `400: Mã OTP không chính xác hoặc đã hết hiệu lực`.
- **Yêu cầu quyền hạn:** Công khai (`PermitAll`).

---

## 2. FLOW-02: Đăng Nhập & Điều Hướng Phân Vai Trò (Smart RBAC Routing)

- **Flow ID:** `FLOW-02`
- **Tên luồng:** Đăng nhập hệ thống và định tuyến theo vai trò
- **Actor:** Mọi người dùng đã có tài khoản
- **Tiền điều kiện:** Tài khoản không bị khóa (`status != 'BANNED'`).
- **Điểm bắt đầu:** `SCR-010: LoginPage`.
- **Các bước thực hiện:**
  1. Nhập Số điện thoại và Mật khẩu.
  2. Bấm "Đăng nhập".
  3. Frontend gọi API xác thực, nhận về JWT token và vai trò người dùng (`role`).
  4. Lưu session vào `localStorage` (`smart-truck-parking.auth`).
  5. Hệ thống kiểm tra vai trò và điều hướng tức thời:
     - Nếu `role === 'DRIVER'` → Điều hướng về `SCR-014: /dashboard`
     - Nếu `role === 'MERCHANT'` → Điều hướng về `SCR-026: /merchant/dashboard`
     - Nếu `role === 'ADMIN'` → Điều hướng về `SCR-042: /admin/dashboard`
- **Màn hình liên quan:** `SCR-010` → (`SCR-014` | `SCR-026` | `SCR-042`).
- **API calls:** `POST /api/v1/auth/login` `{ phone, password }` → Trả về `{ token, role }`.
- **Thay đổi dữ liệu:** Cập nhật thời điểm đăng nhập gần nhất (Audit).
- **Kết quả thành công:** Token lưu tại trình duyệt, giao diện hiển thị đúng layout và menu của vai trò đó.
- **Trường hợp thất bại:**
  - Sai mật khẩu / Số điện thoại không tồn tại → Báo lỗi `401: Thông tin đăng nhập không chính xác`.
  - Tài khoản bị Admin khóa (`BANNED`) → Báo lỗi `403: Tài khoản của bạn đã bị khóa, vui lòng liên hệ hỗ trợ`.
- **Yêu cầu quyền hạn:** Công khai (`PermitAll`).

---

## 3. FLOW-03: Thêm Mới & Quản Lý Phương Tiện Cơ Giới Của Tài Xế

- **Flow ID:** `FLOW-03`
- **Tên luồng:** Khai báo và quản lý phương tiện đỗ xe
- **Actor:** Tài xế (`DRIVER`)
- **Tiền điều kiện:** Đã đăng nhập vai trò `DRIVER`.
- **Điểm bắt đầu:** `SCR-020: VehiclesPage` (truy cập từ menu `/vehicles`).
- **Các bước thực hiện:**
  1. Tài xế bấm nút "Thêm phương tiện" (+).
  2. Hệ thống hiển thị modal `SCR-MOD-04: AddEditVehicleModal`.
  3. Tài xế nhập:
     - Biển số xe (ví dụ: `29C-123.45`, tự động chuyển thành chữ in hoa).
     - Loại xe: Chọn 1 trong 5 loại (`SEDAN_SUV`, `BUS_COACH`, `LIGHT_TRUCK`, `HEAVY_TRUCK`, `CONTAINER`).
     - Tải trọng (Tấn - ví dụ: 8.5).
     - Hãng xe / Dòng xe (ví dụ: Hyundai HD270, Isuzu Giga).
  4. Bấm "Lưu phương tiện".
  5. Hệ thống validate và gửi dữ liệu lên Backend.
  6. Modal đóng lại, bảng danh sách xe tự động reload và hiển thị xe mới.
- **Màn hình liên quan:** `SCR-020` (kèm `SCR-MOD-04`).
- **API calls:**
  - `GET /api/v1/vehicles` (Tải danh sách)
  - `POST /api/v1/vehicles` `{ licensePlate, vehicleType, weightTon, brandModel }`
  - `DELETE /api/v1/vehicles/{id}` (Xóa mềm)
- **Thay đổi dữ liệu:** Thêm bản ghi vào bảng `vehicles` gắn với `driver_id` hiện tại, trạng thái `status = 'ACTIVE'`.
- **Kết quả thành công:** Xe mới xuất hiện trong danh sách và sẵn sàng dùng để đặt chỗ.
- **Trường hợp thất bại:**
  - Biển số đã được tài xế khác đăng ký trong hệ thống → Báo lỗi `400: Biển số xe đã tồn tại`.
  - Cố tình chọn loại xe 2 bánh → Bị chặn ngay từ tầng validate DTO.
- **Yêu cầu quyền hạn:** Bắt buộc vai trò `DRIVER`.

---

## 4. FLOW-04: Tìm Kiếm Bãi Đỗ Bản Đồ & Lọc Slot Phù Hợp Xe

- **Flow ID:** `FLOW-04`
- **Tên luồng:** Tìm kiếm và khảo sát bãi đỗ thời gian thực
- **Actor:** Tài xế (`DRIVER`)
- **Tiền điều kiện:** Đã đăng nhập vai trò `DRIVER`.
- **Điểm bắt đầu:** `SCR-015: SearchParkingPage` (truy cập từ `/parking` hoặc `/dashboard/search`).
- **Các bước thực hiện:**
  1. Giao diện tự động tải danh sách xe của tài xế và chọn mặc định chiếc xe đầu tiên.
  2. Bản đồ Leaflet xác định tọa độ GPS của tài xế hoặc điểm đến do tài xế nhập.
  3. Tài xế điều chỉnh bộ lọc:
     - Chọn xe / đổi loại xe (`vehicleTypeFilter`).
     - Kéo slider bán kính tìm kiếm (mặc định 10km, từ 1km đến 50km).
     - Chọn tiêu chí sắp xếp: Gần nhất, Giá thấp nhất, Đánh giá cao nhất.
     - Bật/tắt công tắc "Bao gồm bãi đã đầy".
  4. Hệ thống hiển thị các marker bãi đỗ trên bản đồ số và danh sách thẻ bãi xe bên cạnh.
  5. Tài xế click vào 1 bãi xe:
     - Bản đồ vẽ đường đi (Polyline) nối từ vị trí tài xế đến bãi đỗ.
     - Hiển thị khoảng cách (km) và thời gian di chuyển ước tính (ETA phút).
  6. Tài xế bấm "Xem chi tiết" để chuyển sang `SCR-016` hoặc bấm "Đặt nhanh" để mở panel đặt giữ chỗ ngay trên trang tìm kiếm.
- **Màn hình liên quan:** `SCR-015` → `SCR-016`.
- **API calls:**
  - `GET /api/v1/vehicles` (Lấy danh sách xe của tài xế)
  - `GET /api/v1/parking-lots/search?vehicleType=...&latitude=...&longitude=...&radiusKm=...`
- **Thay đổi dữ liệu:** Không thay đổi dữ liệu (Read-only query).
- **Kết quả thành công:** Tài xế nhìn thấy trực quan các bãi đỗ còn chỗ phù hợp với chiếc xe đang lái.
- **Trường hợp thất bại:**
  - Không có bãi đỗ nào còn chỗ trong bán kính đã chọn → Hiển thị Empty state gợi ý tăng bán kính hoặc tham gia hàng đợi ảo.
- **Yêu cầu quyền hạn:** Vai trò `DRIVER`.

---

## 5. FLOW-05: Đặt Giữ Chỗ 10 Phút & Thanh Toán Cọc Qua PayOS

- **Flow ID:** `FLOW-05`
- **Tên luồng:** Quy trình đặt chỗ hai bước (Giữ chỗ 10p → Đặt cọc)
- **Actor:** Tài xế (`DRIVER`)
- **Tiền điều kiện:** Bãi đỗ có trạng thái `APPROVED` và còn slot trống cho loại xe đã chọn.
- **Điểm bắt đầu:** `SCR-016: ParkingDetailPage`.
- **Các bước thực hiện:**
  1. Tại trang chi tiết bãi đỗ, tài xế chọn xe của mình trong dropdown.
  2. Chọn thời gian dự kiến đến (`startTime`) và thời gian dự kiến rời bãi (`endTime`).
  3. Hệ thống tính toán tổng số giờ đỗ và tiền đặt cọc quy định (`depositAmount`).
  4. Tài xế bấm nút "Xác nhận đặt giữ chỗ (Giữ trong 10 phút)".
  5. Backend thực hiện khóa bi quan (`PESSIMISTIC_WRITE`) trên Slot, giảm `availableCapacity` đi 1 và tạo bản ghi `Booking` với trạng thái `PENDING_PAYMENT` (thời hạn 10 phút).
  6. Hệ thống chuyển hướng tài xế sang `SCR-017: MyBookingsPage` hoặc mở liên kết thanh toán PayOS.
  7. Tài xế thực hiện quét mã VietQR ngân hàng trên trang PayOS.
  8. Cổng PayOS gửi Webhook về Backend (`POST /api/v1/payments/webhook`).
  9. Backend xác thực chữ ký Webhook, cập nhật trạng thái `Payment` thành `SUCCESS` và `Booking` thành `PENDING_CHECKIN`.
  10. Trình duyệt chuyển về `SCR-023: PaymentSuccessPage` rồi quay về `SCR-017: MyBookingsPage`. Booking hiển thị mã QR Code sẵn sàng check-in.
- **Màn hình liên quan:** `SCR-016` → `SCR-017` → Trang thanh toán PayOS → `SCR-023` → `SCR-017`.
- **API calls:**
  - `POST /api/v1/bookings` `{ parkingLotId, vehicleId, startTime, endTime }` → Trả về booking details
  - `POST /api/v1/payments` `{ bookingId }` → Trả về URL thanh toán PayOS
  - `POST /api/v1/payments/webhook` (PayOS gọi ngầm)
- **Thay đổi dữ liệu:**
  - `slots`: `available_capacity = available_capacity - 1`
  - `bookings`: status từ rỗng → `PENDING_PAYMENT` → `PENDING_CHECKIN`
  - `payments`: status từ `PENDING` → `SUCCESS` (type=`DEPOSIT`)
- **Trạng thái chuyển đổi:** `PENDING_PAYMENT` ──(Thanh toán cọc)──► `PENDING_CHECKIN`.
- **Kết quả thành công:** Slot được bảo lưu chắc chắn cho tài xế, tài xế sở hữu mã QR vé đỗ hợp lệ.
- **Trường hợp thất bại:**
  - Quá 10 phút không thanh toán → Booking chuyển thành `EXPIRED`, slot tự động hoàn lại cho người khác (`available_capacity + 1`).
  - Hết slot trước khi bấm xác nhận → Báo lỗi `400: Loại chỗ đỗ này hiện đã hết capacity`.
- **Yêu cầu quyền hạn:** Bắt buộc vai trò `DRIVER`.

---

## 6. FLOW-06: Hủy Đặt Chỗ & Xử Lý Hoàn Cọc (Cancellation & Refund)

- **Flow ID:** `FLOW-06`
- **Tên luồng:** Hủy đặt chỗ đỗ xe và giải phóng slot
- **Actor:** Tài xế (`DRIVER`)
- **Tiền điều kiện:** Booking thuộc về tài xế, trạng thái đang là `PENDING_PAYMENT` hoặc `PENDING_CHECKIN` và còn trước thời hạn check-in tối thiểu 1 tiếng.
- **Điểm bắt đầu:** `SCR-017: MyBookingsPage`.
- **Các bước thực hiện:**
  1. Tại danh sách booking, tài xế chọn đơn muốn hủy.
  2. Bấm nút "Hủy đặt chỗ".
  3. Hệ thống mở modal `SCR-MOD-03: CancelBookingModal`.
  4. Hiển thị thông tin chính sách: Nếu hủy trước 1 tiếng, tài xế được hoàn 100% tiền cọc (qua cổng thanh toán hoặc ví).
  5. Tài xế chọn lý do hủy (Thay đổi lịch trình, Tìm được bãi khác, Sự cố phương tiện, Khác).
  6. Bấm "Xác nhận hủy đặt chỗ".
  7. Backend cập nhật trạng thái booking thành `CANCELLED`, hoàn trả số lượng slot trống (`available_capacity + 1`) và kích hoạt hoàn tiền cọc nếu đã đóng cọc.
  8. Giao diện cập nhật trạng thái tag màu đỏ "Đã hủy" và vô hiệu hóa mã QR.
- **Màn hình liên quan:** `SCR-017` (kèm `SCR-MOD-03`).
- **API calls:** `POST /api/v1/bookings/{id}/cancel` `{ reason }`.
- **Thay đổi dữ liệu:**
  - `bookings`: status `PENDING_CHECKIN` → `CANCELLED`
  - `slots`: `available_capacity = available_capacity + 1`
  - `payments`: tạo bản ghi hoàn tiền hoặc cập nhật status sang `REFUNDED`
- **Kết quả thành công:** Đơn đỗ xe được hủy an toàn, slot lập tức khả dụng cho các tài xế khác đang tìm bãi hoặc đang chờ trong hàng đợi ảo.
- **Trường hợp thất bại:**
  - Hủy quá muộn (sát giờ hoặc đã quá giờ check-in) → Báo lỗi `400: Đã quá thời hạn hủy đặt chỗ có hoàn cọc`.
- **Yêu cầu quyền hạn:** Bắt buộc vai trò `DRIVER` sở hữu booking.

---

## 7. FLOW-07: Tham Gia Hàng Đợi Ảo & Nhận Slot Khi Được Giải Phóng

- **Flow ID:** `FLOW-07`
- **Tên luồng:** Xếp hàng ảo thông minh khi bãi đầy
- **Actor:** Tài xế (`DRIVER`)
- **Tiền điều kiện:** Bãi đỗ đã hết slot cho loại xe mong muốn (`availableCapacity === 0`).
- **Điểm bắt đầu:** `SCR-016: ParkingDetailPage`.
- **Các bước thực hiện:**
  1. Khi xem bãi đỗ thấy hết slot, nút "Đặt chỗ" bị vô hiệu hóa và chuyển thành nút "Tham gia hàng đợi ảo".
  2. Tài xế bấm "Tham gia hàng đợi ảo".
  3. Backend tạo bản ghi `QueueEntry` với trạng thái `WAITING` và cấp số thứ tự (`position`).
  4. Tài xế theo dõi thứ hạng tại `SCR-018: DriverQueuesPage`.
  5. Khi một xe cùng loại trong bãi thực hiện Check-out, hệ thống kiểm tra hàng đợi và chọn tài xế đứng đầu:
     - Bản ghi hàng đợi đổi trạng thái sang `NOTIFIED`.
     - Bắt đầu đồng hồ đếm ngược phản hồi (ví dụ: 15 phút).
     - Gửi thông báo đẩy đến điện thoại tài xế.
  6. Tại `SCR-018`, thẻ hàng đợi chuyển sang hiệu ứng sáng viền xanh kèm chuông thông báo: "Đã đến lượt bạn!".
  7. Tài xế bấm **"Nhận slot"**:
     - Hệ thống tự động chuyển đổi lượt chờ thành một Booking chính thức ở trạng thái `PENDING_PAYMENT`.
     - Tự động chuyển hướng tài xế sang `SCR-017` để thanh toán cọc trong 10 phút.
  8. Nếu tài xế bấm **"Từ chối"** hoặc để hết thời hạn phản hồi:
     - Lượt chờ chuyển thành `EXPIRED` / `CANCELLED`.
     - Cơ hội nhận slot tự động chuyển sang cho tài xế tiếp theo trong hàng đợi.
- **Màn hình liên quan:** `SCR-016` → `SCR-018` → `SCR-017`.
- **API calls:**
  - `POST /api/v1/queues` `{ parkingLotId, vehicleType }`
  - `GET /api/v1/queues/my`
  - `POST /api/v1/queues/{id}/accept`
  - `POST /api/v1/queues/{id}/leave`
- **Thay đổi dữ liệu:** Bảng `queue_entries`: status `WAITING` → `NOTIFIED` → `ACCEPTED`. Sinh bản ghi mới trong `bookings`.
- **Kết quả thành công:** Phân phối slot trống công bằng, minh bạch, không cần tài xế phải túc trực F5 màn hình liên tục.
- **Yêu cầu quyền hạn:** Vai trò `DRIVER`.

---

## 8. FLOW-08: Quét QR Check-in Xe Vào Bãi (Merchant QR Scanner)

- **Flow ID:** `FLOW-08`
- **Tên luồng:** Xác thực xe vào bãi đỗ
- **Actor:** Chủ bãi hoặc Nhân viên gác cổng (`MERCHANT`) & Tài xế (`DRIVER`)
- **Tiền điều kiện:** Booking ở trạng thái `PENDING_CHECKIN` (đã cọc thành công). Xe đến đúng cổng bãi đỗ.
- **Điểm bắt đầu:** `SCR-036: MerchantQrScannerPage`.
- **Các bước thực hiện:**
  1. Merchant mở `SCR-036`, chọn bãi đỗ tương ứng nếu quản lý nhiều bãi.
  2. Chọn chế độ: **"CHECK-IN"**.
  3. Merchant hướng camera điện thoại/máy tính bảng vào màn hình mã QR của tài xế (hoặc nhập mã `bookingCode`).
  4. Hệ thống tự động đọc chuỗi mã và gọi API xác thực:
     - Kiểm tra mã booking tồn tại.
     - Kiểm tra booking thuộc đúng bãi đỗ này.
     - Kiểm tra trạng thái đang là `PENDING_CHECKIN`.
  5. Backend ghi nhận thời gian vào bãi thực tế (`actualCheckInTime = NOW()`), cập nhật trạng thái booking thành `PARKING`.
  6. Giao diện hiển thị thông báo thành công màu xanh: "Check-in thành công cho xe [Biển số]". Cổng barie mở cho xe vào bãi.
  7. Phía tài xế (`SCR-017`), trạng thái booking chuyển ngay lập tức sang thẻ màu xanh dương "Đang đỗ".
- **Màn hình liên quan:** `SCR-036` (Merchant) & `SCR-017` (Driver).
- **API calls:** `POST /api/v1/merchant/check-in` `{ bookingCode, parkingLotId }`.
- **Thay đổi dữ liệu:**
  - `bookings`: status `PENDING_CHECKIN` → `PARKING`, `actual_check_in_time = NOW()`
- **Trạng thái chuyển đổi:** `PENDING_CHECKIN` ──(Quét QR vào)──► `PARKING`.
- **Kết quả thành công:** Xe vào bãi hợp lệ, hệ thống bắt đầu tính giờ đỗ thực tế.
- **Trường hợp thất bại:**
  - Booking chưa đóng tiền cọc (`PENDING_PAYMENT`) → Từ chối: `Chưa hoàn tất thanh toán cọc`.
  - Quét nhầm tại bãi khác → Báo lỗi: `Mã đặt chỗ này không thuộc bãi đỗ hiện tại`.
- **Yêu cầu quyền hạn:** Bắt buộc vai trò `MERCHANT` sở hữu bãi đỗ.

---

## 9. FLOW-09: Quét QR Check-out, Tính Phí Thực Tế & Thu Tiền Mặt / Cổng Số

- **Flow ID:** `FLOW-09`
- **Tên luồng:** Xác thực xe ra bãi, quyết toán thời gian và thanh toán khoản cuối
- **Actor:** Chủ bãi (`MERCHANT`) & Tài xế (`DRIVER`)
- **Tiền điều kiện:** Booking ở trạng thái `PARKING` hoặc `OVERTIME`.
- **Điểm bắt đầu:** `SCR-036: MerchantQrScannerPage`.
- **Các bước thực hiện:**
  1. Xe di chuyển đến cổng ra bãi đỗ. Merchant mở `SCR-036`, chọn chế độ **"CHECK-OUT"**.
  2. Merchant quét mã QR hoặc nhập `bookingCode`.
  3. Backend ghi nhận `actualCheckOutTime = NOW()` và tính toán chi phí:
     - Tổng thời gian đỗ thực tế (làm tròn lên theo block giờ).
     - Tổng tiền đỗ = (Số giờ x Đơn giá giờ) + Phí phụ trội quá giờ (nếu có).
     - Số tiền còn phải thu (`amountDue`) = Tổng tiền đỗ - Tiền cọc đã thanh toán.
  4. Màn hình Merchant hiển thị Modal Quyết toán chi tiết:
     - Thời gian vào: HH:mm, Thời gian ra: HH:mm (Tổng số giờ).
     - Đã cọc: X đ.
     - Còn phải thu: **Y đ**.
  5. Thu tiền:
     - *Phương án A (Thu tiền mặt tại cổng):* Merchant nhận tiền mặt từ tài xế, bấm nút **"Xác nhận đã thu tiền mặt"**.
     - *Phương án B (Thanh toán qua PayOS):* Tài xế mở `SCR-017`, thấy nút "Thanh toán khoản cuối", bấm thanh toán qua PayOS.
  6. Sau khi xác nhận tiền đủ, Backend:
     - Chuyển trạng thái booking thành `COMPLETED`.
     - Tăng số lượng slot khả dụng trở lại (`available_capacity + 1`).
     - Cộng doanh thu sau hoa hồng vào ví tiền của Merchant (`walletBalance = walletBalance + netRevenue`).
  7. Mở cổng barie cho xe rời bãi.
- **Màn hình liên quan:** `SCR-036` → `SCR-034` (Merchant) & `SCR-017` (Driver).
- **API calls:**
  - `POST /api/v1/merchant/check-out` `{ bookingCode, parkingLotId }` → Trả về `{ amountDue, totalHours, penalty }`
  - `POST /api/v1/merchant/confirm-cash` `{ bookingCode, parkingLotId }`
  - Hoặc `POST /api/v1/bookings/{id}/pay-final` (Driver thanh toán PayOS)
- **Thay đổi dữ liệu:**
  - `bookings`: status `PARKING` → `COMPLETED`, `actual_check_out_time = NOW()`
  - `slots`: `available_capacity = available_capacity + 1`
  - `merchants`: `wallet_balance = wallet_balance + netRevenue`
  - `payments`: tạo bản ghi `type = FINAL_PAYMENT`, status=`SUCCESS`
- **Trạng thái chuyển đổi:** `PARKING` ──(Check-out & Tất toán)──► `COMPLETED`.
- **Kết quả thành công:** Xe rời bãi an toàn, slot được giải phóng cho xe sau, ví tiền chủ bãi nhận tiền sòng phẳng.
- **Yêu cầu quyền hạn:** Vai trò `MERCHANT` sở hữu bãi đỗ.

---

## 10. FLOW-10: Đánh Giá & Chấm Điểm Bãi Xe Sau Khi Hoàn Tất

- **Flow ID:** `FLOW-10`
- **Tên luồng:** Đánh giá chất lượng dịch vụ bãi đỗ
- **Actor:** Tài xế (`DRIVER`)
- **Tiền điều kiện:** Booking có trạng thái `COMPLETED` và chưa từng được đánh giá.
- **Điểm bắt đầu:** `SCR-017: MyBookingsPage`.
- **Các bước thực hiện:**
  1. Tại thẻ booking đã hoàn tất, xuất hiện nút màu vàng có icon ngôi sao: "Đánh giá bãi đỗ".
  2. Tài xế click vào nút này, mở modal `SCR-MOD-02: ReviewModal`.
  3. Chọn số sao đánh giá (1 đến 5 sao, tương ứng: Rất tệ, Tệ, Bình thường, Tốt, Tuyệt vời).
  4. Nhập nhận xét chi tiết (an ninh, độ rộng rãi, thái độ nhân viên gác cổng, độ sáng ban đêm).
  5. Bấm "Gửi đánh giá".
  6. Backend lưu bản ghi `Review`, tự động tính toán lại điểm trung bình (`ratingAverage`) cho bãi xe và cập nhật trạng thái booking thành `REVIEWED`.
  7. Modal đóng lại, nút chuyển thành trạng thái disabled "Đã đánh giá".
- **Màn hình liên quan:** `SCR-017` (kèm `SCR-MOD-02`) → Cập nhật điểm hiển thị tại `SCR-015`, `SCR-016`.
- **API calls:** `POST /api/v1/reviews` `{ bookingId, rating, comment }`.
- **Thay đổi dữ liệu:**
  - Thêm bản ghi vào bảng `reviews`.
  - Cập nhật `parking_lots.rating_average = (tổng điểm / số lượt đánh giá)`.
  - `bookings.status = 'REVIEWED'`.
- **Kết quả thành công:** Đóng góp dữ liệu uy tín giúp cộng đồng tài xế lựa chọn bãi đỗ an toàn.
- **Yêu cầu quyền hạn:** Bắt buộc vai trò `DRIVER` sở hữu booking đã hoàn tất.

---

## 11. FLOW-11: Chủ Bãi Đăng Ký Bãi Đỗ Mới, Cấu Hình Slot, Biểu Phí & Admin Phê Duyệt

- **Flow ID:** `FLOW-11`
- **Tên luồng:** Vòng đời đăng ký và phê duyệt bãi đỗ xe
- **Actor:** Chủ bãi (`MERCHANT`) & Quản trị viên (`ADMIN`)
- **Tiền điều kiện:** Merchant đã đăng ký và đăng nhập thành công.
- **Điểm bắt đầu:** `SCR-028: MerchantParkingLotsPage`.
- **Các bước thực hiện:**
  1. Merchant bấm "Đăng ký bãi đỗ mới", chuyển sang `SCR-029: CreateMerchantParkingLotPage`.
  2. Điền thông tin: Tên bãi đỗ, Địa chỉ đầy đủ, Tọa độ GPS, Số điện thoại hỗ trợ, Mô tả tiện ích.
  3. Tải lên danh sách ảnh chụp thực tế bãi xe (cổng vào, mặt bằng).
  4. Bấm "Gửi đăng ký bãi đỗ". Bãi xe được tạo với trạng thái ban đầu là `PENDING_APPROVAL`.
  5. Merchant tiếp tục truy cập `SCR-032: MerchantSlotsPage` để thiết lập số chỗ đỗ (`totalCapacity`) cho từng loại trong 5 loại xe.
  6. Merchant truy cập `SCR-033: MerchantPricingPage` để cấu hình bảng giá (giờ, qua đêm, quá giờ, cọc) cho 5 loại xe.
  7. Phía Quản trị viên: Admin truy cập `SCR-043: AdminParkingLotsPage`, thấy bãi đỗ mới trong danh sách "Chờ duyệt".
  8. Admin click vào xem `SCR-044: AdminParkingLotDetailPage`:
     - Kiểm tra vị trí bãi trên bản đồ mini.
     - Soát xét ảnh chụp thực tế và tính hợp lý của sức chứa và biểu giá.
  9. Thao tác quyết định của Admin:
     - Nếu đạt chuẩn: Bấm **"Phê duyệt (Approve)"** → Trạng thái bãi chuyển thành `APPROVED`. Bãi xe lập tức xuất hiện trên bản đồ tìm kiếm của Tài xế (`SCR-015`).
     - Nếu thiếu thông tin: Bấm **"Yêu cầu bổ sung (Request Changes)"** hoặc **"Từ chối (Reject)"** kèm ghi chú lý do.
  10. Merchant nhận thông báo tương ứng tại `SCR-041: MerchantNotificationsPage`.
- **Màn hình liên quan:** `SCR-028` → `SCR-029` → `SCR-032` → `SCR-033` (Merchant) ↔ `SCR-043` → `SCR-044` (Admin).
- **API calls:**
  - `POST /api/v1/merchant/parking-lots`
  - `POST /api/v1/merchant/parking-lots/{id}/images`
  - `PUT /api/v1/merchant/parking-lots/{id}/slots/bulk`
  - `PUT /api/v1/merchant/parking-lots/{id}/pricing/bulk`
  - `PUT /api/v1/admin/parking-lots/{id}/approve` hoặc `/reject`
- **Thay đổi dữ liệu:** Bảng `parking_lots`: status từ `PENDING_APPROVAL` → `APPROVED`. Bảng `slots` và `pricing_rules` được lưu trữ.
- **Trạng thái chuyển đổi:** `PENDING_APPROVAL` ──(Admin duyệt)──► `APPROVED`.
- **Kết quả thành công:** Bãi xe hợp pháp được đưa vào khai thác thương mại an toàn.
- **Yêu cầu quyền hạn:** Phối hợp giữa `MERCHANT` (tạo) và `ADMIN` (duyệt).

---

## 12. FLOW-12: Doanh Thu Ví Chủ Bãi & Luồng Phê Duyệt Rút Tiền Admin

- **Flow ID:** `FLOW-12`
- **Tên luồng:** Đối soát doanh thu và rút tiền từ ví
- **Actor:** Chủ bãi (`MERCHANT`) & Quản trị viên (`ADMIN`)
- **Tiền điều kiện:** Merchant có số dư khả dụng trong ví lớn hơn mức rút tối thiểu (ví dụ: tối thiểu 50,000 đ) và đã cập nhật số tài khoản ngân hàng trong hồ sơ `SCR-027`.
- **Điểm bắt đầu:** `SCR-037: MerchantRevenuePage` hoặc `SCR-038: MerchantWithdrawalsPage`.
- **Các bước thực hiện:**
  1. Merchant kiểm tra biểu đồ doanh thu và số dư ví tại `SCR-037`.
  2. Chuyển sang `SCR-038: MerchantWithdrawalsPage`, bấm nút "Tạo yêu cầu rút tiền".
  3. Hệ thống mở modal `SCR-MOD-05: CreateWithdrawalModal`.
  4. Hiển thị thông tin ngân hàng thụ hưởng đã đăng ký (Ngân hàng, Số tài khoản, Tên chủ tài khoản) và số dư ví hiện có.
  5. Merchant nhập số tiền muốn rút (bắt buộc `<= walletBalance`), bấm "Xác nhận yêu cầu".
  6. Backend xử lý transaction:
     - Tạo bản ghi trong `withdrawal_requests` với trạng thái `PENDING`.
     - Trừ số dư ví khả dụng của Merchant ngay lập tức (`walletBalance = walletBalance - amount`) để ngăn chặn việc tạo trùng nhiều lệnh rút cùng lúc.
  7. Phía Admin: Admin truy cập `SCR-048: AdminWithdrawalsPage`, thấy yêu cầu rút tiền mới.
  8. Admin đối soát thông tin tài khoản ngân hàng và lịch sử dòng tiền của bãi đỗ.
  9. Quyết định của Admin:
     - **Nếu duyệt:** Admin thực hiện chuyển khoản ngân hàng thực tế, bấm **"Duyệt lệnh rút tiền (Approve)"**. Yêu cầu chuyển trạng thái thành `APPROVED` / `PAID`.
     - **Nếu từ chối:** Admin bấm **"Từ chối (Reject)"** và nhập lý do. Backend tự động hoàn tiền lại ví cho Merchant (`walletBalance = walletBalance + amount`).
  10. Merchant nhận thông báo kết quả tại `SCR-041`.
- **Màn hình liên quan:** `SCR-037` → `SCR-038` (Merchant) ↔ `SCR-048` (Admin).
- **API calls:**
  - `GET /api/v1/merchant/revenue`
  - `POST /api/v1/withdrawals` `{ amount, bankName, bankAccount }`
  - `GET /api/v1/admin/withdrawals`
  - `PUT /api/v1/admin/withdrawals/{id}/approve`
  - `PUT /api/v1/admin/withdrawals/{id}/reject` `{ reason }`
- **Thay đổi dữ liệu:**
  - `withdrawal_requests`: status `PENDING` → `PAID` hoặc `REJECTED`
  - `merchants`: `wallet_balance` bị trừ khi tạo yêu cầu, hoàn lại nếu reject
- **Kết quả thành công:** Dòng tiền minh bạch, chống chi trùng, đảm bảo an toàn tài chính nền tảng.
- **Yêu cầu quyền hạn:** Phối hợp giữa `MERCHANT` (rút) và `ADMIN` (duyệt chi).

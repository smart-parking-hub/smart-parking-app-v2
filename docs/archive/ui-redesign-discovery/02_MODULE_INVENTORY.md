# Danh Mục Module Nghiệp Vụ (Module Inventory)

Hệ thống **SmartParkingHub** được phân rã thành **6 module nghiệp vụ cốt lõi**. Mỗi module có ranh giới nghiệp vụ (Bounded Context) rõ ràng, phục vụ từng nhóm đối tượng cụ thể và tích hợp với các REST API chuyên biệt.

---

## 1. Bảng Tổng Hợp Danh Mục Module

| Module ID | Tên Module | Mã Thư Mục Code | Đối Tượng Sử Dụng | Số Lượng Màn Hình | Mức Độ Xác Minh |
|---|---|---|---|:---:|:---:|
| **MOD-01** | **Public & Landing Module** | `features/landing` | Khách vãng lai, Tài xế, Chủ bãi | 9 màn hình | `VERIFIED` |
| **MOD-02** | **Authentication & Access** | `features/auth`, `shared/auth` | Tất cả người dùng | 4 màn hình | `VERIFIED` |
| **MOD-03** | **Driver Operations Portal** | `features/parking-search`, `bookings`, `vehicles`, `queues`, `payments`, `profile` | Tài xế (`DRIVER`) | 12 màn hình + 3 modals | `VERIFIED` |
| **MOD-04** | **Merchant Operations Portal** | `features/merchant/*` | Chủ bãi (`MERCHANT`) | 16 màn hình + 1 modal | `VERIFIED` |
| **MOD-05** | **System Administration** | `features/admin/*` | Quản trị viên (`ADMIN`) | 12 màn hình | `VERIFIED` |
| **MOD-06** | **AI Copilot & Assistance** | `features/ai-copilot` | Tài xế, Khách hàng | 1 modal widget | `VERIFIED` |

---

## 2. Đặc Tả Chi Tiết Từng Module

### 2.1. MOD-01: Public & Landing Module
- **Mục tiêu:** Giới thiệu nền tảng, truyền thông giải pháp cho các bên liên quan (tài xế cá nhân, doanh nghiệp vận tải, chủ bãi đỗ xe), công bố bảng giá minh bạch, cung cấp cổng thông tin tuyển dụng, bài viết và form tiếp nhận liên hệ kinh doanh.
- **Phạm vi chức năng:**
  1. *Landing Page (`/`):* Hero banner phong cách logistics, bộ tìm kiếm nhanh bãi đỗ, giới thiệu các loại xe hỗ trợ, tính năng nổi bật, số liệu thống kê nền tảng và đánh giá từ khách hàng.
  2. *Giải pháp tài xế (`/solutions/drivers`):* Trình bày lợi ích về tiết kiệm thời gian, bảo đảm an toàn xe tải nặng, đặt chỗ trước và thanh toán không tiền mặt.
  3. *Giải pháp chủ bãi (`/solutions/owners`):* Trình bày công cụ tối ưu hóa công suất slot, tự động hóa kiểm soát xe qua QR và tăng trưởng doanh thu bãi đỗ.
  4. *Biểu phí dịch vụ (`/pricing`):* Công bố các gói dịch vụ dành cho bãi xe (Miễn phí, Chuyên nghiệp, Doanh nghiệp) và chính sách phí sàn đối với tài xế.
  5. *Tích hợp API (`/solutions/api`):* Tài liệu tổng quan về Webhook và REST API kết nối cho các doanh nghiệp logistics thứ ba (3PL).
  6. *Thông tin công ty (`/company/about`, `/careers`, `/blog`, `/contact`):* Giới thiệu sứ mệnh, các vị trí tuyển dụng, blog kiến thức logistics và form gửi email liên hệ trực tiếp qua EmailJS.
- **Layout sử dụng:** `LandingLayout` (gồm `LandingNavbar` cố định trên cùng và `LandingFooter` đa cột phía dưới).
- **Quyền truy cập:** `PUBLIC / GUEST` (không yêu cầu đăng nhập).

---

### 2.2. MOD-02: Authentication & Access Management Module
- **Mục tiêu:** Quản lý toàn bộ vòng đời danh tính người dùng, kiểm soát phiên đăng nhập dựa trên JSON Web Token (JWT) và bảo vệ định tuyến theo vai trò (Role-Based Access Control - RBAC).
- **Phạm vi chức năng:**
  1. *Đăng nhập (`/login`):* Xác thực bằng Số điện thoại + Mật khẩu. Hỗ trợ ghi nhớ đăng nhập, chuyển hướng thông minh dựa trên vai trò:
     - `DRIVER` → chuyển hướng về `/dashboard`
     - `MERCHANT` → chuyển hướng về `/merchant/dashboard`
     - `ADMIN` → chuyển hướng về `/admin/dashboard`
  2. *Đăng ký tài khoản (`/register`):*
     - Bước 1: Nhập Số điện thoại, Email, Mật khẩu và chọn vai trò mong muốn (`DRIVER` hoặc `MERCHANT` - không cho phép tự đăng ký `ADMIN`).
     - Bước 2: Bổ sung thông tin mở rộng theo vai trò:
       - Nếu là `DRIVER`: Nhập Họ tên, Số CCCD/Hộ chiếu.
       - Nếu là `MERCHANT`: Nhập Tên doanh nghiệp/Họ tên chủ bãi, Số CCCD, Tên ngân hàng, Số tài khoản ngân hàng (phục vụ rút tiền sau này).
     - Bước 3: Gửi và xác thực mã OTP điện thoại trước khi kích hoạt tài khoản.
  3. *Quên mật khẩu (`/forgot-password`):* Nhập email đăng ký → Nhận mã xác thực OTP qua email/SMS → Đặt mật khẩu mới.
  4. *Trang lỗi phân quyền (`/403`):* Hiển thị cảnh báo khi tài xế cố tình truy cập trang của chủ bãi hoặc ngược lại, kèm nút quay về trang chủ hợp lệ.
  5. *Bảo vệ phiên đăng nhập (`ProtectedRoute.tsx`):* Lưu trữ token tại `localStorage` dưới key `smart-truck-parking.auth`, tự động đính kèm `Bearer token` vào mọi request qua `apiClient` Axios interceptor; tự động đăng xuất khi gặp mã lỗi `401 Unauthorized`.
- **Layout sử dụng:** `AuthLayout` (bố cục 2 cột: cột trái là hình ảnh minh họa xe tải logistics thương hiệu SmartTruck, cột phải là form nhập liệu).

---

### 2.3. MOD-03: Driver Operations Portal Module
- **Mục tiêu:** Cung cấp không gian làm việc số toàn diện cho tài xế để tìm kiếm bãi xe thời gian thực, đặt chỗ, thanh toán cọc và quản lý toàn bộ phương tiện cơ giới của mình.
- **Phạm vi chức năng:**
  1. *Tổng quan tài xế (`/dashboard`):* Thẻ tóm tắt các chuyến đỗ xe gần nhất, trạng thái đặt chỗ hiện tại, lối tắt tìm bãi và quản lý xe.
  2. *Bản đồ & Tìm kiếm bãi đỗ (`/parking` & `/dashboard/search`):*
     - Bản đồ tương tác Leaflet OpenStreetMap với vị trí GPS người dùng.
     - Bộ lọc đa tiêu chí: Lọc theo xe đã chọn trong hồ sơ, loại xe (`SEDAN_SUV`, `CONTAINER`,...), bán kính khoảng cách (Slider 1 - 50 km), sắp xếp theo khoảng cách / giá / đánh giá sao, công tắc hiển thị cả bãi đã đầy slot.
     - Ô tìm kiếm địa điểm thông minh với gợi ý tự động (Autocomplete suggestions).
     - Panel xem nhanh bãi đỗ kèm thông tin khoảng cách (km), thời gian ước tính di chuyển (ETA phút) và nút mở Google Maps dẫn đường trực tiếp.
     - Panel đặt chỗ nhanh tại chỗ (Inline Quick Book).
  3. *Chi tiết bãi đỗ xe (`/dashboard/parking/:id`):*
     - Hiển thị danh sách ảnh chụp thực tế bãi xe (Image Carousel).
     - Thông tin chi tiết: Địa chỉ, tọa độ, mô tả tiện ích (camera an ninh, chiếu sáng ban đêm, phòng nghỉ tài xế, cổng barie tự động).
     - Bảng tình trạng chỗ trống theo từng loại xe (Available / Total Capacity).
     - Bảng giá niêm yết theo từng loại xe.
     - Form giữ chỗ trước (Hold Slot Modal): Chọn xe trong danh sách, chọn thời gian dự kiến đến và thời gian đỗ, tính toán số tiền cọc bắt buộc.
     - Đăng ký tham gia Hàng đợi ảo nếu loại xe đã hết chỗ trống.
  4. *Quản lý Đặt chỗ của tôi (`/bookings`):*
     - Danh sách đặt chỗ với 9 trạng thái rõ ràng (`PENDING_PAYMENT`, `PENDING_CHECKIN`, `PARKING`, `OVERTIME`, `AWAITING_FINAL_PAYMENT`, `COMPLETED`, `CANCELLED`, `EXPIRED`, `REVIEWED`).
     - Bộ lọc tìm kiếm theo mã booking, biển số xe, tên bãi và lọc trạng thái.
     - Xem chi tiết booking, hiển thị mã QR Code động để bảo vệ tại cổng.
     - Tải ảnh mã QR về điện thoại (Download QR PNG).
     - Thanh toán tiền cọc (`DEPOSIT`) hoặc thanh toán cuối (`FINAL_PAYMENT`) qua cổng PayOS.
     - Nút Hủy đặt chỗ (`CANCEL`) kèm popup thông báo chính sách hoàn tiền cọc (cho phép hủy trước giờ check-in tối thiểu 1 tiếng).
     - Nút Viết đánh giá bãi (`ReviewModal` - chấm điểm 1 đến 5 sao và viết nhận xét).
  5. *Hàng đợi ảo thông minh (`/queues`):*
     - Hiển thị danh sách lượt chờ tại các bãi xe đã đầy.
     - Theo dõi số thứ tự hiện tại và số tài xế đang xếp hàng phía trước.
     - Nhận thông báo "Đã đến lượt bạn" kèm thời gian đếm ngược phản hồi.
     - Nút "Nhận slot" (tự động tạo booking mới chuyển sang thanh toán) hoặc "Từ chối / Rời hàng đợi".
  6. *Lịch sử Giao dịch & Thanh toán (`/payments`):*
     - Bảng thống kê chi tiết các khoản thanh toán tiền cọc, thanh toán cuối, tiền phạt quá giờ.
     - Lọc theo trạng thái `SUCCESS`, `PENDING`, `FAILED` và tìm kiếm theo mã giao dịch PayOS.
     - Tổng hợp tổng số tiền đã thanh toán trên hệ thống.
  7. *Xác nhận thanh toán thành công / hủy (`/payment/success`, `/payment/cancel`):*
     - Màn hình tiếp nhận kết quả thanh toán redirect từ cổng PayOS, tự động đồng bộ trạng thái giao dịch với Backend.
  8. *Quản lý Phương tiện (`/vehicles` & `/dashboard/vehicles`):*
     - Danh sách xe của tài xế kèm biển số, phân loại xe, tải trọng (tấn) và hãng/model xe.
     - Modal thêm mới / chỉnh sửa phương tiện với validation chặt chẽ (biển số chuẩn Việt Nam, cấm loại 2 bánh).
     - Xóa mềm phương tiện (Soft delete).
  9. *Hồ sơ cá nhân & Đổi mật khẩu (`/profile`, `/change-password`):*
     - Cập nhật thông tin cá nhân tài xế, xem số điện thoại và vai trò.
     - Đổi mật khẩu tài khoản với xác nhận mật khẩu cũ và mới.
  10. *Trung tâm Thông báo (`/notifications`):*
      - Xem danh sách thông báo về đặt chỗ, thanh toán, thay đổi trạng thái hàng đợi. Đánh dấu đã đọc đơn lẻ hoặc tất cả.
- **Layout sử dụng:** `LandingNavbar` tích hợp với `driver-dashboard-content`.

---

### 2.4. MOD-04: Merchant Operations Portal Module
- **Mục tiêu:** Cung cấp hệ thống quản trị vận hành bãi đỗ chuyên nghiệp dành cho Chủ bãi và nhân viên gác cổng nhằm tối đa hóa tỷ lệ lấp đầy, kiểm soát xe ra vào và theo dõi doanh thu thời gian thực.
- **Phạm vi chức năng:**
  1. *Dashboard Tổng quan Chủ bãi (`/merchant/dashboard`):*
     - Thẻ KPI: Số lượng bãi xe đang hoạt động, Tổng lượt booking hôm nay, Số xe đang đỗ thực tế (`PARKING`), Doanh thu tích lũy trong ngày.
     - Danh sách các bãi xe kèm trạng thái kiểm duyệt (`APPROVED`, `PENDING_APPROVAL`, `REJECTED`).
     - Bảng hoạt động check-in/out gần nhất.
  2. *Quản lý Danh mục Bãi đỗ (`/merchant/parking-lots`):*
     - Danh sách tất cả các bãi đỗ do Merchant sở hữu.
     - Trạng thái kiểm duyệt, số lượng slot, biểu phí hiện hành.
     - Lối tắt nhanh: Cấu hình Slot, Cấu hình Giá, Chỉnh sửa thông tin, Xem chi tiết.
  3. *Tạo bãi đỗ xe mới (`/merchant/parking-lots/new`):*
     - Form nhập liệu: Tên bãi đỗ, địa chỉ kinh doanh, tọa độ GPS (Latitude, Longitude), số điện thoại liên hệ, mô tả chi tiết và các tiện ích hỗ trợ.
     - Tải lên bộ ảnh thực tế của bãi xe (mặt tiền, mặt bằng, cổng vào).
     - Khởi tạo gửi lên hệ thống ở trạng thái `PENDING_APPROVAL` để Admin xét duyệt.
  4. *Chi tiết bãi đỗ xe (`/merchant/parking-lots/:parkingLotId`):*
     - Xem toàn bộ thông số kỹ thuật, tình trạng phê duyệt, lý do từ chối nếu có.
     - Thống kê doanh thu riêng của bãi đỗ này.
     - Thư viện ảnh mặt bằng bãi xe.
  5. *Chỉnh sửa thông tin bãi (`/merchant/parking-lots/:parkingLotId/edit`):*
     - Cập nhật thông tin mô tả, số điện thoại, tiện ích của bãi đỗ.
  6. *Cấu hình Sức chứa Slot (`/merchant/parking-lots/:parkingLotId/slots`):*
     - Bảng thiết lập số lượng chỗ đỗ tối đa (`totalCapacity`) cho từng loại trong 5 loại phương tiện.
     - Hỗ trợ lưu từng loại xe hoặc cập nhật hàng loạt (Bulk slot update).
     - Hiển thị số lượng chỗ khả dụng (`availableCapacity`) và số chỗ đang có xe đỗ.
  7. *Cấu hình Bảng giá Dịch vụ (`/merchant/parking-lots/:parkingLotId/pricing`):*
     - Thiết lập giá theo từng loại phương tiện:
       - Giá theo giờ tiêu chuẩn (`hourlyRate`).
       - Giá đỗ qua đêm (`overnightRate`).
       - Hệ số phụ trội quá giờ (`overtimeHourlyRate`).
       - Số tiền đặt cọc tối thiểu (`depositAmount`).
     - Hỗ trợ lưu đơn lẻ và cấu hình hàng loạt (Bulk pricing update).
  8. *Quản lý Booking của Bãi (`/merchant/bookings`, `/merchant/bookings/:bookingId`):*
     - Danh sách toàn bộ các lượt đặt chỗ của khách hàng tại các bãi của Merchant.
     - Xem chi tiết xe, thời gian đặt, thời gian vào/ra thực tế, số tiền đã cọc và số tiền cần thanh toán.
  9. *Cổng Quét mã QR Check-in / Check-out (`/merchant/qr-scanner`):*
     - Chọn bãi đỗ đang trực thuộc thẩm quyền vận hành.
     - Chọn chế độ vận hành: **CHECK-IN (Xe vào bãi)** hoặc **CHECK-OUT (Xe ra bãi)**.
     - Tích hợp Camera trực tiếp quét mã QR trên điện thoại tài xế hoặc nhập tay `bookingCode`.
     - *Khi Check-in:* Xác thực booking hợp lệ, chuyển trạng thái sang `PARKING`, mở cổng cho xe vào.
     - *Khi Check-out:* Tự động tính toán tổng thời gian đỗ, so sánh với thời gian đặt trước, hiển thị số tiền còn phải trả (`amountDue`).
     - Hỗ trợ nút **"Xác nhận đã thu tiền mặt tại cổng"** để hoàn tất lượt đỗ ngay lập tức.
  10. *Báo cáo Doanh thu & Dòng tiền (`/merchant/revenue`):*
      - Thống kê tổng doanh thu thực nhận, số lượt booking hoàn tất, số dư ví hiện tại (`walletBalance`).
      - Biểu đồ trực quan Recharts phân tích doanh thu theo kỳ: Theo ngày (`DAY`), Theo tháng (`MONTH`), Theo năm (`YEAR`).
      - Chọn khoảng thời gian tùy chỉnh qua DatePicker.
  11. *Quản lý Yêu cầu Rút tiền (`/merchant/withdrawals`):*
      - Xem số dư ví khả dụng.
      - Form tạo yêu cầu rút tiền về tài khoản ngân hàng đã đăng ký kèm số tiền mong muốn.
      - Bảng theo dõi lịch sử rút tiền với các trạng thái: `PENDING` (Chờ duyệt), `APPROVED` (Đã duyệt), `PAID` (Đã chuyển khoản), `REJECTED` (Bị từ chối).
  12. *Quản lý Khiếu nại từ Tài xế (`/merchant/disputes`, `/merchant/disputes/:ticketId`):*
      - Tiếp nhận và theo dõi các khiếu nại về tiền bạc hoặc chất lượng phục vụ liên quan đến bãi xe của mình.
  13. *Hồ sơ Doanh nghiệp Chủ bãi (`/merchant/profile`):*
      - Cập nhật thông tin chủ bãi, giấy phép kinh doanh, số tài khoản ngân hàng nhận tiền rút.
  14. *Trung tâm Thông báo Merchant (`/merchant/notifications`):*
      - Nhận thông báo tự động khi có bãi xe được duyệt, có booking mới, hoặc có kết quả phê duyệt rút tiền.
- **Layout sử dụng:** `MerchantLayout` (Sidebar Ant Design điều hướng đầy đủ, hiển thị badge thông báo chưa đọc, Header chứa Breadcrumbs và User Dropdown).

---

### 2.5. MOD-05: System Administration & Moderation Module
- **Mục tiêu:** Cung cấp trung tâm chỉ huy kiểm soát toàn diện dành cho Quản trị viên nền tảng để thẩm định bãi đỗ, quản lý người dùng, kiểm soát dòng tiền, xử lý khiếu nại và tra cứu audit logs.
- **Phạm vi chức năng:**
  1. *Admin Dashboard (`/admin/dashboard`):*
     - Chỉ số vĩ mô toàn sàn: Tổng người dùng, tổng tài xế, tổng chủ bãi, tổng số bãi xe, số bãi đang chờ duyệt, tổng lượt booking, doanh thu toàn sàn.
     - Biểu đồ tăng trưởng người dùng và giao dịch.
  2. *Kiểm duyệt Bãi đỗ xe (`/admin/parking-lots`, `/admin/parking-lots/:parkingLotId`):*
     - Danh sách tất cả bãi đỗ với bộ lọc theo trạng thái duyệt (`PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `SUSPENDED`).
     - Trang chi tiết thẩm định: Xem tọa độ bãi trên bản đồ mini, xem thông tin liên hệ chủ bãi, duyệt toàn bộ ảnh mặt bằng, kiểm tra cấu hình slot và bảng giá.
     - Các thao tác quyết định:
       - **Phê duyệt (`Approve`):** Kích hoạt bãi xe hiển thị cho tài xế tìm kiếm.
       - **Yêu cầu bổ sung (`Request Changes`):** Gửi phản hồi yêu cầu chủ bãi sửa thông tin.
       - **Từ chối (`Reject`):** Từ chối duyệt kèm lý do cụ thể.
  3. *Quản lý Người dùng Toàn hệ thống (`/admin/users`, `/admin/users/:userId`):*
     - Bảng danh sách người dùng kèm lọc theo vai trò (`DRIVER`, `MERCHANT`, `ADMIN`) và trạng thái (`ACTIVE`, `INACTIVE`, `BANNED`).
     - Xem chi tiết hồ sơ người dùng: Số lần đặt chỗ, số vụ khiếu nại liên quan, thông tin định danh.
     - Hành động quản trị: **Khóa tài khoản (`Ban`)** có nhập lý do và **Mở khóa tài khoản (`Unban`)**.
  4. *Giám sát Giao dịch Toàn sàn (`/admin/transactions`):*
     - Nhật ký toàn bộ dòng tiền vào/ra trên hệ thống: Tiền cọc, thanh toán cuối, tiền phạt qua cổng PayOS/VNPay.
     - Lọc theo mã giao dịch, mã booking, số điện thoại người thanh toán.
  5. *Phê duyệt Rút tiền (`/admin/withdrawals`):*
     - Danh sách các yêu cầu rút tiền từ ví của các chủ bãi.
     - Xem số tiền yêu cầu, số dư khả dụng của chủ bãi tại thời điểm rút, thông tin ngân hàng thụ hưởng.
     - Nút phê duyệt lệnh chuyển tiền (`Approve`) hoặc từ chối (`Reject` - tự động hoàn tiền về ví chủ bãi).
  6. *Trung tâm Trọng tài Khiếu nại (`/admin/disputes`, `/admin/disputes/:disputeId`):*
     - Danh sách các tranh chấp giữa tài xế và chủ bãi (về tiền thừa, chất lượng bãi, đỗ quá giờ).
     - Chi tiết tranh chấp: Lời khai của tài xế, thông tin booking, số tiền liên quan.
     - Thao tác xử lý: Đưa ra phán quyết (`Resolve`) kèm biên bản giải quyết và chỉ định hoàn tiền nếu có.
  7. *Tra cứu Nhật ký Kiểm toán (`/admin/audit-logs`):*
     - Ghi nhận mọi hành vi thay đổi dữ liệu nhạy cảm của Admin (Duyệt bãi, Khóa tài khoản, Duyệt tiền, Phán quyết tranh chấp).
     - Hiển thị Actor ID, Action Type, Target Entity, Thời gian chính xác.
  8. *Thông báo & Hồ sơ Quản trị (`/admin/notifications`, `/admin/profile`):*
     - Xem và phát các thông báo nội bộ hệ thống.
     - Quản lý thông tin quản trị viên cá nhân.
- **Layout sử dụng:** `AdminLayout` (Giao diện Dark/Teal phong cách trung tâm điều hành bảo mật cao, có Footer kiểm toán bảo mật `ShieldCheck`).

---

### 2.6. MOD-06: AI Copilot & Real-Time Spatial Assistance Module
- **Mục tiêu:** Cung cấp trợ lý ảo thông minh thời gian thực trên giao diện, hỗ trợ tài xế tìm bãi đỗ xe tức thời thông qua định vị GPS và ngôn ngữ tự nhiên, đồng thời giải đáp chính sách dịch vụ.
- **Phạm vi chức năng:**
  1. *Floating Widget Launcher:* Nút tròn đính nổi góc dưới bên phải màn hình tài xế, có icon Robot phát sáng và huy hiệu hỗ trợ.
  2. *Khung Chat Tương tác (Drawer/Modal Dialog):*
     - Giao diện tin nhắn hiện đại (User message & Bot reply).
     - Khả năng tự động xin quyền truy cập Geolocation của trình duyệt (vĩ độ, kinh độ GPS) để gửi kèm câu hỏi.
     - Bộ câu hỏi gợi ý nhanh (Quick Prompts): "Tìm bãi xe ô tô còn chỗ gần tôi", "Quy định giữ chỗ 10 phút thế nào?", "Đỗ quá giờ thì bị tính phí ra sao?".
  3. *Thẻ Bãi xe Đề xuất Trực quan (Suggested ParkingLot Cards):*
     - Khi AI tìm thấy bãi phù hợp trong bán kính gần người dùng, bot sẽ hiển thị danh thiếp bãi đỗ ngay trong bong bóng chat (Tên bãi, địa chỉ, khoảng cách km, số slot trống, mức giá).
     - Nút bấm trực tiếp **"Xem chi tiết & Đặt chỗ"** dẫn tài xế sang trang `SCR-016: ParkingDetailPage`.
  4. *Giải đáp chính sách tự động:* Trả lời dựa trên nguồn tài liệu hệ thống về chính sách hoàn cọc, quy tắc đỗ quá giờ và hướng dẫn quét QR.
- **Quyền truy cập:** `DRIVER` và người dùng đã đăng nhập (hiển thị trên `DashboardLayout`).

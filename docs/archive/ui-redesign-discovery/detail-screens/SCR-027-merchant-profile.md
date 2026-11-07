# Screen Specification: SCR-027 MerchantProfilePage (Hồ sơ chủ bãi)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-027`
- **Screen Name:** Hồ sơ pháp lý & Tài khoản nhận tiền chủ bãi (Merchant Legal & Banking Profile)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/profile` (Định nghĩa tại [`AppRoutes.tsx:120`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L120) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantProfilePage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/profile/pages/MerchantProfilePage.tsx)
- **Sub-components:** Ant Design `Descriptions`, `Form`, `Input`, `Upload`, `Tag`, `Skeleton`, `Alert`, `Button`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Quản lý thông tin định danh pháp nhân/cá nhân của chủ bãi đỗ xe: Họ tên, Số CCCD/CMND, Số Giấy phép kinh doanh (GPKD).
2. Lưu trữ thông tin tài khoản ngân hàng thụ hưởng (Tên ngân hàng, Số tài khoản) để phục vụ giải ngân khi Merchant tạo yêu cầu rút tiền (`SCR-038`).
3. Cung cấp kênh tải lên tài liệu quét (bản chụp GPKD, giấy chứng nhận đăng ký kinh doanh) để Quản trị viên (Admin) thẩm định và phê duyệt tư cách Merchant.
4. Bảo vệ dữ liệu nhạy cảm bằng cơ chế che giấu (Masking) số CCCD và số tài khoản ngân hàng trên màn hình.

### B. Target Users
- Chủ bãi đỗ xe cần cập nhật thông tin tài khoản ngân hàng, bổ sung giấy phép kinh doanh khi mở rộng hoạt động hoặc đổi thông tin nhận tiền.

### C. Entry Points
- Click Avatar / Tên tài khoản trên Header -> Chọn mục "Hồ sơ" trong dropdown menu.
- Click mục "Hồ sơ" trên Sidebar của `MerchantLayout`.

### D. Exit Points
- Chuyển sang mục "Rút tiền" `/merchant/withdrawals` (`SCR-038`) sau khi đã cấu hình đúng tài khoản ngân hàng.

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Phân Hệ
- Tiêu đề H1: `Hồ sơ Merchant`.
- Mô tả phụ: `Thông tin pháp lý, liên hệ và tài khoản nhận tiền.`
- Nút hành động: `Tải lại` (icon `ReloadOutlined`).

### B. Khối Thông Tin Hồ Sơ & Trạng Thái Xác Minh (.merchant-detail-card)
- Thanh trạng thái trên cùng:
  - Tag trạng thái xác minh (`verificationStatus`):
    - `VERIFIED`: Màu xanh lá `Đã xác minh`.
    - `PENDING_REVIEW`: Màu vàng cam `Chờ xem xét`.
    - `INACTIVE`: Màu xám `Ngừng hoạt động`.
    - `BANNED`: Màu đỏ `Bị khóa`.
  - Nút chuyển đổi bảo mật: `Hiện/Ẩn CCCD / số tài khoản` (Toggle Masking).
- Bảng thông tin Ant Design `Descriptions bordered column={1}`:
  1. Số điện thoại đăng nhập: `{profile.phone}` (Chỉ đọc).
  2. Email: `{profile.email}`.
  3. Họ tên: `{profile.fullName}`.
  4. CCCD/CMND: Hiển thị che dạng `079******123` (nếu ẩn) hoặc số đầy đủ (nếu hiện).
  5. Giấy phép kinh doanh: Số GPKD `{profile.businessLicense}`.
  6. Ngân hàng: `{profile.bankName}`.
  7. Tài khoản ngân hàng: Hiển thị che dạng `190******888` (nếu ẩn) hoặc số đầy đủ (nếu hiện).
  8. Số dư ví: Định dạng VND `{formatMoney(walletBalance)}`.
  9. Trạng thái xác minh: Nhãn chi tiết.

### C. Khối Cập Nhật Hồ Sơ (Form)
- Form nhập liệu dọc (`layout="vertical"`, tối đa 640px):
  - Họ tên / Tên đơn vị: Input text (tối đa 100 ký tự).
  - Email: Input email (kiểm tra định dạng email hợp lệ).
  - CCCD/CMND: Input số (kiểm tra regex `/^\d{9,12}$/`, 9-12 chữ số).
  - Giấy phép kinh doanh: Input text (tối đa 50 ký tự).
  - Ngân hàng: Input text (tối đa 100 ký tự, ví dụ: Vietcombank, Techcombank).
  - Số tài khoản: Input số (kiểm tra regex `/^\d{6,30}$/`, 6-30 chữ số).
  - Địa chỉ: TextArea 2 dòng (tối đa 255 ký tự).
  - Liên hệ khẩn cấp: Input text (tối đa 20 ký tự).
- Nút bấm: Primary `Lưu hồ sơ` (icon `SaveOutlined`, loading `{saving}`).

### D. Khối Tải Giấy Tờ / Tài Liệu Pháp Lý
- Form đính kèm tài liệu:
  - Số giấy phép kinh doanh: Input text.
  - Vùng tải file `Upload`: Chấp nhận các đuôi `.pdf, .jpg, .jpeg, .png, .webp`, dung lượng tối đa 5 MB, tối đa 1 file.
- Nút bấm: `Gửi giấy tờ` (icon `UploadOutlined`, loading `{uploading}`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-027-01** | Xem hồ sơ pháp lý | Tải trang `/merchant/profile` | Token Merchant | Đã đăng nhập vai trò MERCHANT | Hiển thị toàn bộ thông tin cá nhân, ngân hàng và giấy tờ |
| **FN-027-02** | Ẩn / Hiện số nhạy cảm | Click `Hiện CCCD / số tài khoản` | Không | Trang đã tải | Đổi trạng thái hiển thị giữa chuỗi đã làm mờ (Masked) và số gốc |
| **FN-027-03** | Cập nhật hồ sơ thông tin | Click `Lưu hồ sơ` | Form: họ tên, email, CCCD, GPKD, ngân hàng, STK, địa chỉ | Dữ liệu hợp lệ theo validation rules | Gửi API cập nhật, hiển thị toast thành công, cập nhật bảng hiển thị |
| **FN-027-04** | Tải lên giấy phép kinh doanh | Chọn file & Click `Gửi giấy tờ` | Số GPKD, File đính kèm (max 5MB) | Có nhập số GPKD hoặc có chọn file | Upload tài liệu lên server, hiển thị thông báo thành công |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/merchant/profile`: Lấy chi tiết hồ sơ Merchant.
2. `PUT /api/v1/merchant/profile`: Cập nhật thông tin hồ sơ Merchant.
3. `POST /api/v1/merchant/profile/documents`: Upload file tài liệu pháp lý (Multipart/form-data).

### B. Controller & Method
- [`MerchantProfileController.java:24-48`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/MerchantProfileController.java#L24-L48):
  - `getProfile(@AuthenticationPrincipal CustomUserDetails user)` -> `@PreAuthorize("hasRole('MERCHANT')")`
  - `updateProfile(@AuthenticationPrincipal CustomUserDetails user, @Valid @RequestBody UpdateMerchantProfileRequest request)` -> `@PreAuthorize("hasRole('MERCHANT')")`
  - `uploadDocuments(@AuthenticationPrincipal CustomUserDetails user, @RequestParam(required = false) String businessLicense, @RequestParam(required = false) MultipartFile file)` -> `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`MerchantProfileServiceImpl`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/MerchantProfileServiceImpl.java): Cập nhật thông tin trong bảng `Merchant` và `User`, lưu trữ file tài liệu vào thư mục uploads an toàn.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Hiển thị component Ant Design `Skeleton active paragraph={{ rows: 8 }}`.
- **Error State:** Hiển thị `Alert type="error"` khi không thể truy xuất API.
- **Masking State:** Sử dụng hàm tiện ích [`maskSensitiveValue.ts`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/profile/utils/maskSensitiveValue.ts) để tự động thay thế các ký tự giữa bằng dấu `*`.
- **Validation Errors:** Báo đỏ trực tiếp dưới trường nhập liệu nếu số CCCD không đủ 9-12 số hoặc số tài khoản ngân hàng sai định dạng.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Bảo mật Masking CCCD & Ngân hàng:** Bắt buộc duy trì cơ chế che giấu thông tin tài chính để tránh bị nhìn trộm màn hình trong môi trường văn phòng hoặc điểm đỗ xe.
2. **Khóa liên kết rút tiền:** Dữ liệu tài khoản ngân hàng tại đây là nguồn cung cấp mặc định cho quy trình rút tiền ở `SCR-038`; không được để phát sinh lỗi lệch tên chủ tài khoản.

### B. Đề Xuất Cải Thiện
1. **Tích hợp VietQR / Napas tra cứu tên tài khoản tự động:** Khi Merchant nhập số tài khoản và chọn ngân hàng, hệ thống nên tự động truy vấn tên chủ tài khoản thụ hưởng để tránh sai sót gõ nhầm số tài khoản.

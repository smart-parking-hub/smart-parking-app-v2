# Đặc Tả Màn Hình SCR-011: RegisterPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-011`
- **Tên màn hình:** Tạo tài khoản mới (User Registration)
- **URL Route / Path:** `/register` (được cấu hình tại [`AppRoutes.tsx:89`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L89))
- **Quyền truy cập (RBAC):** Công khai / Khách vãng lai (`GUEST / PUBLIC`). Người dùng chưa có tài khoản.
- **Mục tiêu nghiệp vụ:** Cho phép người dùng mới tạo tài khoản và lựa chọn vai trò hoạt động (Tài xế hoặc Chủ bãi đỗ xe); bắt buộc xác thực số điện thoại bằng mã OTP trước khi cấp tài khoản; thu thập thông tin hồ sơ theo đặc thù vai trò (Họ tên đối với Driver; CCCD, Ngân hàng, STK đối với Merchant để phục vụ thanh toán đối soát).
- **Actor chính:** Tài xế mới (`DRIVER`) hoặc Chủ bãi đỗ xe mới (`MERCHANT`). Tuyệt đối ngăn chặn đăng ký quyền `ADMIN`.

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

Kế thừa `AuthLayout` và `AuthFormCard` ([`RegisterPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/RegisterPage.tsx)), bao gồm 3 phân đoạn nghiệp vụ theo thứ tự:
1. **Phần đầu & Tab điều hướng:**
   - Tab `Đăng nhập` và Tab `Đăng ký` (Active).
   - Eyebrow: `Create account`.
   - Tiêu đề H1: `Tạo tài khoản`.
   - Phụ đề: `Xác thực SĐT bằng OTP, rồi hoàn tất hồ sơ theo vai trò của bạn.`
2. **Khối 1: Chọn vai trò (`.register-section` - 1. Chọn vai trò):**
   - Bộ chọn Radio Card tùy biến dạng 2 cột (`.register-role-grid`):
     - **Thẻ Tài xế:** Icon `Truck` (màu xanh dương), Tiêu đề *"Tài xế / chủ xe"*, Mô tả *"Tìm bãi và đặt chỗ"*, Icon tích tròn `<CheckCircleFilled />`.
     - **Thẻ Chủ bãi:** Icon `Store` (màu cam), Tiêu đề *"Chủ bãi đỗ"*, Mô tả *"Cấu hình bãi, slot, giá"*, Icon tích tròn `<CheckCircleFilled />`.
3. **Khối 2: Xác thực số điện thoại (`.register-section` - 2. Xác thực số điện thoại):**
   - Ô nhập Số điện thoại (`Input prefix={<PhoneOutlined />}`) kết hợp nút bấm **"Gửi OTP"** / **"Gửi lại"** (`Button loading={sendingOtp}`).
   - Ô nhập Mã OTP 6 chữ số (`Input prefix={<SafetyOutlined />}` maxLength={6}).
   - Gợi ý trạng thái OTP: Nhãn xanh lá *"Đã gửi mã — kiểm tra tin nhắn hoặc log server"* hoặc Alert hiển thị mã OTP trong môi trường thử nghiệm (Lab/Dev mode hint).
4. **Khối 3: Thông tin tài xế / chủ bãi (`.register-section` - 3. Thông tin...):**
   - **Các trường chung:**
     - Email: Ô nhập email hợp lệ (`Input prefix={<MailOutlined />}`).
     - Mật khẩu: Ô nhập mật khẩu mới bảo mật (`Input.Password prefix={<LockOutlined />}`).
   - **Các trường động theo vai trò (Dynamic Role Fields):**
     - *Nếu Role là DRIVER:* Trường Họ tên tài xế (`fullName` - `Input prefix={<UserOutlined />}`).
     - *Nếu Role là MERCHANT:* 
       - CCCD / CMND (`citizenId` - `Input prefix={<IdcardOutlined />}` 9 hoặc 12 chữ số).
       - Tên ngân hàng (`bankName` - `Input prefix={<BankOutlined />}`).
       - Số tài khoản ngân hàng (`bankAccountNum` - `Input prefix={<BankOutlined />}` 1 đến 30 chữ số).
5. **Chân Form:**
   - Dòng chú thích an ninh: *"Tài khoản Admin không tự đăng ký — liên hệ vận hành nếu cần quyền quản trị."*
   - Nút hành động chính: **"Tạo tài khoản"** (`Button block size="large" type="primary"`).
   - Footer: *"Đã có tài khoản? Đăng nhập"*.

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Thẻ chọn vai trò | Custom Radio Button | Click chọn Driver hoặc Merchant | Bất kỳ lúc nào | Kích hoạt viền sáng, thay đổi nhãn Section 3 và hiển thị các trường tương ứng | Không | Form cập nhật trường động theo vai trò | [`RegisterPage.tsx:115-153`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/RegisterPage.tsx#L115-L153) |
| Nút "Gửi OTP" | Action Button | Click nút | Số điện thoại hợp lệ theo regex | Nút hiển thị loading spinner, gọi API gửi mã xác thực SMS/Log | `POST /api/v1/auth/otp/send` | `otpSent = true`, nút đổi thành "Gửi lại", hiện ô OTP | [`RegisterPage.tsx:34-57`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/RegisterPage.tsx#L34-L57), [`AuthController.java:25-28`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/AuthController.java#L25-L28) |
| Form Submit | Primary Button | Click "Tạo tài khoản" | Form hợp lệ & `otpSent === true` | Validate toàn bộ schema, gửi request đăng ký tài khoản | `POST /api/v1/auth/register` | Tạo User + Driver/Merchant entity, Toast thành công, chuyển sang `/login` | [`RegisterPage.tsx:59-83`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/RegisterPage.tsx#L59-L83), [`AuthServiceImpl.java:122-178`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/AuthServiceImpl.java#L122-L178) |
| Link Đăng nhập | Nav Link | Click link | Bất kỳ lúc nào | Chuyển hướng sang trang đăng nhập | Không | Chuyển URL sang `/login` | [`RegisterPage.tsx:92`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/RegisterPage.tsx#L92) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Kiểm Tra (Validation Rules) | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|:---:|---|---|---|
| `role` | Vai trò | `enum` | Có | Giá trị bắt buộc: `'DRIVER'` hoặc `'MERCHANT'` | Radio Card | Backend chặn tuyệt đối `ADMIN` ([`AuthServiceImpl.java:131`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/AuthServiceImpl.java#L131)) |
| `phone` | Số điện thoại | `string` | Có | Định dạng 10 số VN (`03, 05, 07, 08, 09`). Tự động chuẩn hóa | Người dùng nhập | Duy nhất trong DB (`existsByPhone`) |
| `otpCode` | Mã OTP | `string` | Có | Đúng 6 chữ số: `/^[0-9]{6}$/` | Người dùng nhập | Hash BCrypt so khớp trong `otp_challenges` |
| `email` | Email | `string` | Có | Email chuẩn RFC, tối đa 254 ký tự | Người dùng nhập | Duy nhất trong DB (`existsByEmail`) |
| `password` | Mật khẩu | `string` | Có | Độ dài từ 6 đến 50 ký tự | Người dùng nhập | Mã hóa BCrypt lưu `password_hash` |
| `fullName` | Họ tên tài xế | `string` | Có (với Driver) | Tối đa 100 ký tự, không chứa toàn khoảng trắng | Người dùng nhập | Lưu vào bảng `drivers` |
| `citizenId` | CCCD / CMND | `string` | Có (với Merchant)| Đúng 9 hoặc 12 chữ số (`/^(?:[0-9]{9}\|[0-9]{12})$/`) | Người dùng nhập | Duy nhất giữa các Merchant |
| `bankName` | Ngân hàng | `string` | Có (với Merchant)| Tên ngân hàng thụ hưởng, tối đa 100 ký tự | Người dùng nhập | Phục vụ đối soát rút tiền ví |
| `bankAccountNum`| Số tài khoản | `string` | Có (với Merchant)| Đúng từ 1 đến 30 chữ số (`/^[0-9]{1,30}$/`) | Người dùng nhập | Lưu vào bảng `merchants` |

---

## E. TRẠNG THÁI UI (UI States)

1. **Initial State:** Mặc định chọn vai trò Driver, ô SĐT rỗng, nút "Gửi OTP" sẵn sàng, các trường Merchant ẩn.
2. **Role Switched State:** Khi bấm chuyển sang Merchant, form lập tức kích hoạt render 3 trường bổ sung: `citizenId`, `bankName`, `bankAccountNum`.
3. **Sending OTP State:** Nút "Gửi OTP" hiển thị loading spinner (`sendingOtp = true`), input SĐT bị khóa.
4. **OTP Sent State:** Gợi ý hiển thị dòng thông báo xanh lá *"Đã gửi mã"*, nút đổi thành "Gửi lại". Nếu lab bật cờ `expose-in-response`, hiển thị thêm Alert xanh dương chứa mã OTP mẫu.
5. **Submitting State:** Khi bấm "Tạo tài khoản", nút submit hiển thị loading spinner, chặn submit lặp lại.
6. **Error States:**
   - Bấm Tạo tài khoản khi chưa gửi OTP: Cảnh báo vàng `message.warning('Vui lòng gửi và nhập mã OTP trước khi đăng ký.')`.
   - SĐT đã tồn tại: Toast đỏ `Số điện thoại đã tồn tại trong hệ thống!`.
   - Email đã tồn tại: Toast đỏ `Email đã được sử dụng!`.
   - CCCD Merchant bị trùng: Toast đỏ `CCCD/CMND này đã được đăng ký cho tài khoản Merchant khác!`.
   - OTP sai hoặc hết hạn: Toast đỏ `Mã OTP không đúng.` hoặc `Mã OTP đã hết hạn.` ([`AuthServiceImpl.java:240-249`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/AuthServiceImpl.java#L240-L249)).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 1024\text{px}$):** Hiển thị 2 cột, form đăng ký cuộn êm bên trong panel phải.
- **Mobile ($< 768\text{px}$):** Cột banner trái ẩn đi. Hàng SĐT và nút Gửi OTP tự động căn chỉnh tỉ lệ (ô input chiếm 65%, nút OTP chiếm 35%). Toàn bộ form dàn rộng 100% viewport.

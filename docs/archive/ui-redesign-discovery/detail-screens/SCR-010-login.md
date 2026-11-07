# Đặc Tả Màn Hình SCR-010: LoginPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-010`
- **Tên màn hình:** Đăng nhập tài khoản (User Login)
- **URL Route / Path:** `/login` (được cấu hình tại [`AppRoutes.tsx:88`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L88))
- **Quyền truy cập (RBAC):** Công khai / Khách vãng lai (`GUEST / PUBLIC`). Người dùng đã có tài khoản thuộc bất kỳ vai trò nào (`DRIVER`, `MERCHANT`, `ADMIN`).
- **Mục tiêu nghiệp vụ:** Xác thực thông tin định danh người dùng qua Số điện thoại và Mật khẩu, cấp mã JWT Token phiên làm việc và điều phối chuyển hướng người dùng đến đúng bảng điều khiển theo vai trò hoặc trang họ đang cố gắng truy cập trước đó (`state.from`).
- **Actor chính:** Tất cả người dùng hệ thống (Tài xế, Chủ bãi, Quản trị viên).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

Kế thừa bố cục `AuthLayout` ([`AuthLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/layouts/AuthLayout.tsx)) với cấu trúc 2 cột đối xứng:
1. **Cột trái Hero Banner (`aside.auth-hero`):**
   - Logo thương hiệu SmartTruck (`CarOutlined` + `SmartTruck`).
   - Tiêu đề H1: `SmartTruck Parking`.
   - Mô tả giá trị: *"Giải pháp quản lý logistics và bãi đỗ an toàn, tin cậy dành cho vận hành xe tải chuyên nghiệp."*
   - Hình ảnh đồ họa xe tải logistics chuyên dụng ([`smart-logistics-truck.png`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/assets/smart-logistics-truck.png)).
   - Chú thích chân trang: *"Kết nối tài xế và bãi đỗ trên một nền tảng vận hành thống nhất."*
2. **Cột phải Thẻ xác thực (`AuthFormCard` tại `section.auth-panel`):**
   - Thanh Tab chuyển đổi nhanh: Tab `Đăng nhập` (Active) và Tab `Đăng ký` ([`AuthFormCard.tsx:29-36`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/components/AuthFormCard.tsx#L29-L36)).
   - Eyebrow: `Welcome back`.
   - Tiêu đề H1: `Đăng nhập`.
   - Phụ đề: `Đăng nhập để tiếp tục quản lý đặt chỗ, QR và đối soát theo đúng vai trò của bạn.`
   - **Khu vực Đăng nhập Nhanh Demo (`section.demo-login`):**
     - Tiêu đề phụ: *"Đăng nhập nhanh để demo — 1 chạm"*.
     - Lưới 4 thẻ tài khoản demo (`.demo-account-grid`):
       1. `Driver 1`: Nguyễn Văn Hùng (`0909 128 374`) - Tone Blue - Icon `Truck`
       2. `Driver 2`: Trần Quốc Tuấn (`0918 239 485`) - Tone Teal - Icon `UserRound`
       3. `Merchant`: Lê Văn Thành (`0908 123 456`) - Tone Orange - Icon `Store`
       4. `Admin`: Nguyễn Hoàng Nam (`0903 829 145`) - Tone Purple - Icon `ShieldCheck`
     - Đường phân cách: *"hoặc đăng nhập bằng tài khoản"*.
   - **Form đăng nhập chính (`Form layout="vertical"`):**
     - Trường `phone`: Ô nhập Số điện thoại kèm icon `PhoneOutlined`.
     - Hàng nhãn mật khẩu: Nhãn "Mật khẩu" bên trái và nút liên kết "Quên mật khẩu?" bên phải (`Button type="link"` dẫn tới `/forgot-password`).
     - Trường `password`: Ô nhập mật khẩu bảo mật `Input.Password` kèm icon `LockOutlined`.
     - Nút hành động chính: Nút "Đăng nhập" (`Button block size="large" type="primary"`).
   - **Chân thẻ (Footer):** *"Chưa có tài khoản? Tạo tài khoản"* (Link dẫn tới `/register`).
   - **Pháp lý (Legal):** *"Bằng việc tiếp tục, bạn đồng ý với Điều khoản và Chính sách bảo mật."*

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tab "Đăng ký" | NavLink | Click tab | Bất kỳ lúc nào | Điều hướng sang trang đăng ký | Không | Chuyển URL sang `/register` | [`AuthFormCard.tsx:33`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/components/AuthFormCard.tsx#L33) |
| Thẻ Demo Driver 1 | Button 1-chạm | Click thẻ demo | Không có request đang chạy | Hiển thị spinner quay tại thẻ, tự động login SĐT demo | `POST /api/v1/auth/login` | Lưu session, Toast thành công, điều hướng sang `/dashboard` hoặc `/parking` | [`LoginPage.tsx:44-56`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/LoginPage.tsx#L44-L56) |
| Thẻ Demo Merchant | Button 1-chạm | Click thẻ demo | Không có request đang chạy | Tự động login SĐT chủ bãi | `POST /api/v1/auth/login` | Lưu session, điều hướng sang `/merchant/dashboard` | [`LoginPage.tsx:44-56`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/LoginPage.tsx#L44-L56) |
| Thẻ Demo Admin | Button 1-chạm | Click thẻ demo | Không có request đang chạy | Tự động login SĐT quản trị viên | `POST /api/v1/auth/login` | Lưu session, điều hướng sang `/admin/dashboard` | [`LoginPage.tsx:44-56`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/LoginPage.tsx#L44-L56) |
| Link "Quên mật khẩu?" | Link Button | Click link | Bất kỳ lúc nào | Điều hướng sang màn hình khôi phục mật khẩu | Không | Chuyển URL sang `/forgot-password` | [`LoginPage.tsx:149-155`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/LoginPage.tsx#L149-L155) |
| Form Submit | Primary Button | Click "Đăng nhập" hoặc nhấn Enter | Đã nhập đầy đủ SĐT & Mật khẩu | Validate format, hiển thị loading spinner, gửi request xác thực | `POST /api/v1/auth/login` | Lưu `token`, `role`, `phone` vào `localStorage`, chuyển hướng theo vai trò | [`LoginPage.tsx:58-74`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/auth/pages/LoginPage.tsx#L58-L74), [`AuthController.java:50-54`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/AuthController.java#L50-L54) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Kiểm Tra (Validation Rules) | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|:---:|---|---|---|
| `phone` | Số điện thoại | `string` | Có | Định dạng SĐT VN: `/^(0\|\+84)[35789][0-9]{8}$/`. Tự động xóa khoảng trắng `replace(/\s/g, '')`. Tối đa 12 ký tự | Người dùng nhập | Backend chuẩn hóa `+84` thành `0` tại [`AuthRequest.java:18-24`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/dto/AuthRequest.java#L18-L24) |
| `password` | Mật khẩu | `string` | Có | Độ dài từ 6 đến 50 ký tự (`min: 6, max: 50`) | Người dùng nhập | Kiểm tra so khớp với BCrypt hash trong DB |

---

## E. TRẠNG THÁI UI (UI States)

1. **Initial State:** Ô SĐT và Mật khẩu rỗng, 4 thẻ demo sẵn sàng, nút Đăng nhập kích hoạt.
2. **Submitting State:** Khi bấm Đăng nhập, nút submit hiển thị icon quay `loading={submitting}`, các trường bị khóa thao tác.
3. **Demo Loading State:** Khi click 1 thẻ demo bất kỳ, mũi tên `→` trên thẻ đó chuyển thành `<Spin size="small" />`, 3 thẻ còn lại bị vô hiệu hóa `disabled={true}`.
4. **Validation Error State:** Nếu SĐT sai định dạng hoặc mật khẩu $< 6$ ký tự, viền ô chuyển đỏ, hiện cảnh báo lỗi bên dưới ô nhập.
5. **API Error State:** 
   - Sai số điện thoại hoặc mật khẩu: Toast đỏ `Số điện thoại hoặc mật khẩu không đúng!` ([`AuthServiceImpl.java:80`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/AuthServiceImpl.java#L80)).
   - Tài khoản bị Admin khóa: Toast đỏ `Tài khoản đã bị khóa. Vui lòng liên hệ Admin.` ([`AuthServiceImpl.java:83`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/AuthServiceImpl.java#L83)).
   - Tài khoản bị vô hiệu hóa: Toast đỏ `Tài khoản đã bị vô hiệu hóa.` ([`AuthServiceImpl.java:86`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/AuthServiceImpl.java#L86)).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 1024\text{px}$):** Hiển thị dạng chia 2 cột đối xứng: Cột banner bên trái chiếm 45% diện tích với hình xe tải logistics, Cột form bên phải chiếm 55% diện tích căn giữa.
- **Tablet ($768\text{px} - 1023\text{px}$):** Giảm kích thước ảnh minh họa xe tải, thu hẹp padding xung quanh form từ 40px xuống 24px.
- **Mobile ($< 768\text{px}$):** Cột banner trái ẩn hoàn toàn (`display: none`). Cột form hiển thị toàn màn hình (full-width), kích hoạt khối `.auth-mobile-brand` trên đầu trang để nhận diện thương hiệu.

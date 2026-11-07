# Tổng Quan Hệ Thống (System Overview)

## 1. Bối Cảnh & Vấn Đề Nghiệp Vụ (Business Problem)

Tại các đô thị lớn và hành lang kinh tế trọng điểm, nhu cầu tìm kiếm chỗ đỗ cho ô tô du lịch, xe khách liên tỉnh, xe tải giao hàng và xe đầu kéo container ngày càng cấp bách trong khi hạ tầng đỗ xe chuyên dụng còn phân tán và manh mún.

### Những thách thức thực tế:
1. **Lãng phí thời gian và chi phí nhiên liệu:** Tài xế xe tải/container mất hàng giờ chạy vòng vèo tìm bãi đỗ đủ kích thước và tải trọng, dẫn đến nguy cơ dừng đỗ sai quy định, ùn tắc giao thông và bị xử phạt hành chính.
2. **Thiếu thông tin thời gian thực:** Tài xế không biết bãi đỗ còn chỗ hay không trước khi di chuyển đến nơi; chủ bãi không thể công bố sức chứa trống tức thời ra thị trường.
3. **Quy trình vận hành thủ công:** Việc ghi vé giấy, tính giờ bằng tay, thu tiền mặt dễ gây thất thoát, sai lệch số liệu và tranh chấp khi xe đỗ quá giờ.
4. **Rủi ro xung đột giữ chỗ:** Khi nhu cầu tăng cao, nhiều tài xế cùng muốn vào bãi nhưng không có cơ chế giữ chỗ trước và hàng đợi ảo công bằng.

**SmartParkingHub** ra đời nhằm giải quyết triệt để các vấn đề trên thông qua nền tảng kết nối số hóa thời gian thực, tự động hóa toàn bộ quy trình: **Tìm bãi → Giữ chỗ trước → Thanh toán cọc → Dẫn đường GPS → Check-in/Check-out bằng mã QR → Quyết toán tài chính minh bạch**.

---

## 2. Các Nhóm Người Dùng & Chân Dung Đối Tượng (User Personas)

Hệ thống được thiết kế phục vụ 3 nhóm người dùng có quyền và 1 nhóm khách vãng lai:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 SmartParkingHub Platform                │
                  └────────────────────────────┬────────────────────────────┘
                                               │
         ┌───────────────────┬─────────────────┴─────────────────┬───────────────────┐
         ▼                   ▼                                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐                 ┌─────────────────┐ ┌─────────────────┐
│     DRIVER      │ │    MERCHANT     │                 │      ADMIN      │ │      GUEST      │
│  Tài xế / Nhà xe│ │     Chủ bãi     │                 │   Quản trị viên │ │  Khách vãng lai │
│  (Mobile/Desktop│ │ (Desktop/Mobile)│                 │ (Desktop Portal)│ │ (Landing Pages) │
└─────────────────┘ └─────────────────┘                 └─────────────────┘ └─────────────────┘
```

### 2.1. Driver / Customer (Tài xế cá nhân, tài xế đội xe)
- **Hành vi chính:** Tìm bãi đỗ trên bản đồ số, lọc bãi theo loại phương tiện và tiện ích, đặt giữ chỗ trước, thanh toán cọc qua cổng ngân hàng (PayOS), quét QR tại cổng barie, theo dõi thời gian đỗ, thanh toán phí phát sinh và đánh giá bãi.
- **Nền tảng sử dụng:** Giao diện Web tối ưu hóa cho màn hình di động (Responsive Web App) khi đang chạy trên đường, hoặc laptop khi lập kế hoạch hành trình trước.

### 2.2. Merchant / Parking Lot Owner (Chủ bãi & Nhân viên vận hành)
- **Hành vi chính:** Đăng ký thông tin bãi đỗ và hồ sơ pháp lý, cấu hình sức chứa từng loại xe (Slot), thiết lập bảng giá lũy tiến/phụ trội (Pricing Rules), quét QR check-in xe vào và check-out xe ra bằng camera di động, xác nhận thu tiền mặt tại cổng, theo dõi biểu đồ doanh thu và tạo lệnh rút tiền về tài khoản ngân hàng.
- **Nền tảng sử dụng:** Giao diện Web Portal trên máy tính bảng hoặc laptop tại phòng điều hành bãi đỗ xe; camera smartphone tại cổng gác.

### 2.3. System Administrator (Ban điều hành nền tảng)
- **Hành vi chính:** Thẩm định và phê duyệt bãi đỗ mới (Approved/Rejected/Suspended), quản lý danh sách người dùng và khóa tài khoản vi phạm (Ban/Unban), giám sát luồng tiền giao dịch trên toàn hệ thống, phê duyệt yêu cầu rút tiền của chủ bãi, giải quyết khiếu nại (Disputes) và tra cứu Audit Logs.
- **Nền tảng sử dụng:** Giao diện Web Admin chuyên dụng trên màn hình máy tính để bàn (Desktop Workstation).

### 2.4. Guest (Khách vãng lai)
- **Hành vi chính:** Xem trang giới thiệu sản phẩm (Landing Page), bảng so sánh giải pháp cho tài xế và chủ bãi, biểu phí dịch vụ nền tảng, tài liệu tích hợp API và thông tin tuyển dụng, liên hệ.

---

## 3. Phân Loại Phương Tiện Phục Vụ (Vehicle Taxonomy)

Hệ thống được thiết kế đặc thù cho **phương tiện cơ giới từ 4 bánh trở lên**. Hệ thống **tuyệt đối không hỗ trợ** xe máy, xe đạp và các phương tiện 2 bánh:

| Mã định danh Enum | Tên hiển thị tiếng Việt | Mô tả kích thước & Trọng tải | Đặc tính vị trí đỗ |
|---|---|---|---|
| `SEDAN_SUV` | **Xe con / Ô tô 4-7 chỗ** | Xe gia đình, taxi, xe bán tải cá nhân | Diện tích tiêu chuẩn (2.5m x 5m) |
| `BUS_COACH` | **Xe khách (16-45 chỗ)** | Xe du lịch, xe hợp đồng chở khách | Chiều dài lớn (8m - 12m), bán kính cua rộng |
| `LIGHT_TRUCK` | **Xe tải nhẹ (< 3.5 tấn)** | Xe tải van, xe giao hàng nội đô | Chiều cao hạn chế tĩnh, vào giờ cấm tải |
| `HEAVY_TRUCK` | **Xe tải nặng (3.5 - 15 tấn)** | Xe tải 3-4 chân, xe tải thùng đường dài | Tải trọng mặt đường lớn, yêu cầu nền bãi chịu lực |
| `CONTAINER` | **Xe đầu kéo & Container** | Xe đầu kéo 20ft/40ft, rơ-moóc | Chiều dài > 16m, yêu cầu luồng quay đầu rộng |

---

## 4. Kiến Trúc Kỹ Thuật (Technical Architecture Stack)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                FRONTEND APPLICATION LAYER                              │
│  React 19 • TypeScript • Vite 8 • Ant Design 6.5 • Tailwind v4 • Leaflet Maps • Redux  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP / RESTful (JWT Bearer Token)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY & SECURITY LAYER                              │
│           Spring Cloud Gateway / Monolith Security (RateLimit, CORS, JWT Auth)         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┴───────────────────────────────────┐
        ▼                                                                       ▼
┌─────────────────────────────────┐                   ┌─────────────────────────────────┐
│     MONOLITH BACKEND SERVICE    │                   │   MICROSERVICES ECOSYSTEM (V2)  │
│  Spring Boot 3.x • Java 17      │                   │  Spring Boot 3.3.5 • Java 21    │
│  JPA Hibernate • PayOS SDK      │  Chuyển dịch dần  │  • identity-service (Port 8081) │
│  Bucket4j • Flyway Migration    │ ────────────────► │  • parking-lot-service (8082)   │
│  MySQL Database (Port 8080/88)  │                   │  • booking-service (Port 8083)  │
│  (Đang vận hành thực tế)        │                   │  • payment-service (Port 8084)  │
│                                 │                   │  • notification-service (8085)  │
│                                 │                   │  • ai-service / Kafka / Redis   │
└─────────────────────────────────┘                   └─────────────────────────────────┘
```

### Các công nghệ then chốt ở Frontend:
- **UI Framework & Design System:** Ant Design 6.5 làm nền tảng widget cốt lõi (Table, Form, Select, DatePicker, Modal, Drawer, Skeleton) kết hợp Tailwind CSS v4 cho layout và styling.
- **Color Token Chuẩn:** `colorPrimary = #0f766e` (Teal Emerald), bo góc `borderRadius = 8px`, Typography: `Inter, sans-serif`.
- **Bản đồ số tương tác:** Thư viện `leaflet` kết hợp tile OpenStreetMap hiển thị trực quan các bãi đỗ xe, vị trí GPS người dùng, bán kính tìm kiếm và đường dẫn chỉ đường (Polyline routing).
- **Camera Quét QR:** Thư viện `html5-qrcode` cho phép Merchant truy cập camera thiết bị để quét mã check-in/check-out trực tiếp trên trình duyệt mà không cần cài thêm app native.
- **Biểu đồ trực quan hóa:** Thư viện `recharts` vẽ biểu đồ kết hợp (ComposedChart - Bar & Line) cho phân tích doanh thu theo ngày/tháng/năm của Merchant và Admin.
- **AI Copilot Widget:** Widget nổi góc dưới màn hình, tích hợp Geolocation API gửi tin nhắn kèm tọa độ để tìm bãi xe gần nhất theo ngôn ngữ tự nhiên.

---

## 5. Các Bất Biến Nghiệp Vụ Cốt Lõi (Core Business Invariants)

Mọi màn hình và luồng thao tác người dùng đều bị ràng buộc bởi các quy tắc bất biến sau:

1. **Ràng buộc kiểm duyệt bãi xe:** Chỉ những bãi đỗ có trạng thái `status = 'APPROVED'` mới được phép xuất hiện trong kết quả tìm kiếm của Tài xế và được phép tạo Booking. Bãi đang chờ duyệt (`PENDING_APPROVAL`), bị từ chối (`REJECTED`) hoặc tạm ngưng (`SUSPENDED`) sẽ bị chặn đặt chỗ ngay từ tầng Service.
2. **Khóa chống đặt trùng (Pessimistic Locking & Hold TTL):** Khi tài xế tạo đặt chỗ, hệ thống áp dụng cơ chế khóa bi quan (`PESSIMISTIC_WRITE`) trên bản ghi Slot tương ứng để trừ số lượng khả dụng (`availableCapacity`). Booking được giữ chỗ trong **10 phút**. Nếu sau 10 phút chưa thanh toán cọc thành công, slot sẽ tự động được hoàn lại.
3. **Thanh toán cọc bắt buộc:** Tài xế bắt buộc phải thanh toán cọc (`DEPOSIT`) trước khi đến bãi thì booking mới chuyển sang trạng thái `PENDING_CHECKIN` và sinh mã QR hợp lệ.
4. **Quy trình Check-in/Check-out tại cổng:**
   - Check-in chỉ thành công khi bãi đỗ đang quét đúng là bãi của booking đó và trạng thái booking là `PENDING_CHECKIN`.
   - Check-out tự động tính thời gian đỗ thực tế: làm tròn lên theo block giờ (ceiling hour). Nếu vượt quá giờ đặt trước, hệ thống tự động tính thêm phí quá giờ (`OVERTIME`).
5. **Ví tiền & Đối soát tài chính kép:**
   - Mỗi Merchant có một ví nội bộ (`walletBalance`). Doanh thu từ booking sau khi trừ phí hoa hồng nền tảng (nếu có) sẽ được ghi nhận vào ví.
   - Khi Merchant tạo yêu cầu rút tiền (`WITHDRAWAL`), số dư khả dụng bị trừ ngay lập tức để tránh rút quá số dư. Nếu Admin từ chối yêu cầu, tiền sẽ tự động hoàn lại ví.

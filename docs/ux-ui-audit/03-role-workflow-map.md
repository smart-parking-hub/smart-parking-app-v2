# 03. ROLE & WORKFLOW MAPPING — SMART PARKING HUB CRM V2

> **Giai đoạn:** DISCOVERY & INVENTORY AUDIT  
> **Thời gian khảo sát:** 06/11/2026 · **Trạng thái:** HOÀN THÀNH XÁC LẬP MA TRẬN PHÂN QUYỀN VÀ LUỒNG NGHIỆP VỤ  
> **Căn cứ xác thực:** `src/features/auth/model/session.ts`, `src/features/auth/components/RequireRole.tsx`, các API controller và DTOs thực tế trong repository.

---

## 1. MA TRẬN VAI TRÒ & PHÂN QUYỀN TRUY CẬP (ROLE-BASED ACCESS CONTROL)

Hệ thống ghi nhận chính thức **4 vai trò (Roles)** với phạm vi truy cập phân định rõ ràng:

```mermaid
flowchart TD
    GUEST["GUEST (Khách vãng lai)<br/>Public Marketing & Auth"]
    DRIVER["DRIVER (Tài xế)<br/>Tìm bãi, Đặt cọc, Vé QR, Hàng đợi"]
    MERCHANT["MERCHANT (Chủ bãi)<br/>Cổng Barie ALPR, Quản lý bãi, Doanh thu"]
    ADMIN["ADMIN (Quản trị viên)<br/>Kiểm duyệt, Đối soát, Trọng tài tranh chấp"]

    GUEST -->|Đăng nhập / Đăng ký| DRIVER
    GUEST -->|Đăng nhập / Đăng ký| MERCHANT
    GUEST -->|Đăng nhập đặc quyền| ADMIN
```

### 1.1. Bảng quyền hạn truy cập theo màn hình

| Nhóm Màn Hình / Nghiệp Vụ | Đường Dẫn (Route) | GUEST | DRIVER | MERCHANT | ADMIN | Căn Cứ Mã Nguồn Xác Thực |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Public Landing & Marketing** | `/`, `/solutions/*`, `/pricing`, `/about`, `/careers`, `/insights`, `/contact` | ✅ | ✅ | ✅ | ✅ | Không có route guard, public cho mọi người dùng |
| **Xác thực tài khoản (Auth)** | `/login`, `/register`, `/forgot-password` | ✅ | 🔄* | 🔄* | 🔄* | `*` Nếu đã đăng nhập, tự động redirect về trang chủ của vai trò (`roleHome`) |
| **Thông báo lỗi quyền (403)** | `/403` | ✅ | ✅ | ✅ | ✅ | Hiển thị khi bị từ chối quyền truy cập |
| **Driver Dashboard & Bản đồ tìm bãi** | `/dashboard`, `/parking`, `/parking/:id` | ❌ | ✅ | ❌ | ❌ | `<RequireRole role="DRIVER">` trong `DriverLayout` |
| **Vé đỗ QR & Hàng đợi ảo** | `/bookings`, `/queues`, `/payments` | ❌ | ✅ | ❌ | ❌ | `<RequireRole role="DRIVER">` |
| **Phương tiện & Hồ sơ cá nhân** | `/vehicles`, `/profile`, `/change-password`, `/notifications` | ❌ | ✅ | ❌ | ❌ | `<RequireRole role="DRIVER">` |
| **Merchant Dashboard & Quản lý bãi** | `/merchant`, `/merchant/dashboard`, `/merchant/parking-lots/*` | ❌ | ❌ | ✅ | ❌ | `<RequireRole role="MERCHANT">` trong `MerchantLayout` |
| **Trạm Barie Cổng & Quét QR** | `/merchant/qr-scanner`, `/merchant/bookings/*` | ❌ | ❌ | ✅ | ❌ | `<RequireRole role="MERCHANT">` |
| **Báo cáo doanh thu & Rút tiền ví** | `/merchant/revenue`, `/merchant/withdrawals`, `/merchant/profile` | ❌ | ❌ | ✅ | ❌ | `<RequireRole role="MERCHANT">` |
| **Admin Command Center** | `/admin`, `/admin/dashboard` | ❌ | ❌ | ❌ | ✅ | `<RequireRole role="ADMIN">` trong `AdminLayout` |
| **Kiểm duyệt bãi & Quản lý người dùng** | `/admin/parking-lots/*`, `/admin/users/*` | ❌ | ❌ | ❌ | ✅ | `<RequireRole role="ADMIN">` |
| **Đối soát sổ cái & Duyệt rút tiền** | `/admin/transactions`, `/admin/withdrawals`, `/admin/audit-logs` | ❌ | ❌ | ❌ | ✅ | `<RequireRole role="ADMIN">` |
| **Giải quyết tranh chấp khiếu nại** | `/disputes/*` (Driver), `/merchant/disputes/*`, `/admin/disputes/*` | ❌ | ✅ | ✅ | ✅ | Dùng chung component `DisputesPage`, phân quyền theo prop `role` |

---

## 2. BẢN ĐỒ CÁC LUỒNG NGHIỆP VỤ LIÊN TRANG (CROSS-PAGE WORKFLOWS)

### 2.1. Luồng 1: Đặt chỗ, Giữ slot & Check-in/out Cổng tự động

```mermaid
sequenceDiagram
    autonumber
    actor Driver as Tài xế (Driver)
    participant Map as Bản đồ tìm bãi (/parking)
    participant Detail as Chi tiết & Đặt cọc (/parking/:id)
    participant PayOS as Cổng thanh toán PayOS
    participant Ticket as Vé đỗ xe QR (/bookings)
    participant Scanner as Trạm QR Barie (/merchant/qr-scanner)
    actor Merchant as Nhân viên cổng bãi

    Driver->>Map: Lọc loại xe, chọn bãi đỗ trên bản đồ
    Map->>Detail: Mở trang chi tiết bãi đỗ
    Driver->>Detail: Điền giờ vào/ra, chọn xe, bấm Đặt chỗ
    Detail->>PayOS: Mở thanh toán cọc PayOS
    PayOS-->>Ticket: Thanh toán thành công -> Cấp vé điện tử QR
    Driver->>Scanner: Xe đến cổng bãi, xuất trình mã QR
    Merchant->>Scanner: Quét camera / nhập mã vé -> Bấm Check-in vào bãi
    Note over Scanner: Trạng thái đổi thành PARKING (Đang đỗ)
    Driver->>Scanner: Xe chuẩn bị rời bãi, xuất trình mã vé
    Merchant->>Scanner: Quét mã QR -> Hệ thống tính tổng cước & phạt quá giờ
    Merchant->>Scanner: Thu tiền mặt chênh lệch -> Bấm [Xác nhận đã thu tiền]
    Note over Scanner: Trạng thái đổi thành COMPLETED (Hoàn tất)
```

- **Màn hình tham gia:** `SCR-015` -> `SCR-016` -> `SCR-023` -> `SCR-017` -> `SCR-036` -> `SCR-019`.
- **Ràng buộc an toàn:** Nhân viên cổng bắt buộc phải bấm nút xác nhận riêng khi thu tiền mặt; không bao giờ tự động chuyển trạng thái hoàn tất nếu chưa xác nhận tiền mặt.

---

### 2.2. Luồng 2: Hàng đợi ảo thông minh (Virtual Queue Dispatch)

```mermaid
flowchart TD
    A["Tài xế tìm bãi trên Bản đồ (/parking)"] -->|Bãi đỗ đã hết chỗ| B["Bấm tham gia Hàng đợi ảo"]
    B --> C["Vào trang Hàng đợi ảo (/queues)<br/>Nhận số thứ tự & thời gian chờ ước tính"]
    C -->|Xe khác rời bãi qua QR Scanner| D["Hệ thống phát hiện slot trống"]
    D --> E["Cấp quyền giữ slot trong 10 phút"]
    E -->|Tài xế bấm [Chấp nhận]| F["Chuyển thành Booking chính thức -> Nhận Vé QR (/bookings)"]
    E -->|Hết 10 phút không xác nhận| G["Hủy lượt, chuyển slot cho xe tiếp theo trong hàng đợi"]
```

- **Màn hình tham gia:** `SCR-015` -> `SCR-018` -> `SCR-036` (kích hoạt giải phóng slot) -> `SCR-017`.

---

### 2.3. Luồng 3: Đăng ký, Cấu hình & Thẩm định Bãi đỗ xe

```mermaid
flowchart TD
    M1["Chủ bãi tạo hồ sơ bãi mới (/merchant/parking-lots/new)"] --> M2["Cấu hình sức chứa 5 nhóm xe (/slots)"]
    M2 --> M3["Cấu hình biểu phí & giờ cao điểm (/pricing)"]
    M3 -->|Nộp hồ sơ| A1["Hồ sơ chuyển vào Hàng đợi kiểm duyệt Admin (/admin/parking-lots)"]
    A1 --> A2["Admin thẩm định hồ sơ bãi (/admin/parking-lots/:id)"]
    A2 -->|Từ chối kèm lý do| M4["Chủ bãi nhận lý do từ chối, chỉnh sửa lại hồ sơ"]
    A2 -->|Phê duyệt| APPROVED["Bãi đỗ chuyển trạng thái APPROVED"]
    APPROVED --> S1["Bãi đỗ kích hoạt chế độ khóa sửa tọa độ (Lockout mode)"]
    APPROVED --> S2["Bãi đỗ xuất hiện realtime trên bản đồ tìm kiếm Tài xế (/parking)"]
```

- **Màn hình tham gia:** `SCR-029` -> `SCR-032` -> `SCR-033` -> `SCR-043` -> `SCR-044` -> `SCR-030` -> `SCR-015`.

---

### 2.4. Luồng 4: Quyết toán doanh thu & Rút tiền ngân hàng

```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Chủ bãi đỗ
    participant Revenue as Báo cáo doanh thu (/merchant/revenue)
    participant Wallet as Ví & Rút tiền (/merchant/withdrawals)
    participant AdminDesk as Bàn duyệt rút tiền (/admin/withdrawals)
    actor Admin as Quản trị viên
    participant Bank as Ngân hàng đối tác

    Merchant->>Revenue: Theo dõi doanh thu thực nhận tích lũy từ các lượt đỗ xe
    Merchant->>Wallet: Kiểm tra số dư ví khả dụng
    Merchant->>Wallet: Nhập số tiền muốn rút (>= 50.000 VND), chọn tài khoản thụ hưởng
    Wallet->>AdminDesk: Tạo yêu cầu rút tiền (Trạng thái: PENDING)
    Admin->>AdminDesk: Kiểm tra số dư, đối chiếu tên chủ tài khoản và số tài khoản
    alt Thông tin sai lệch
        Admin->>AdminDesk: Nhập lý do từ chối -> Lệnh chuyển REJECTED
    else Thông tin hợp lệ
        Admin->>Bank: Thực hiện chuyển khoản ngân hàng
        Admin->>AdminDesk: Bấm [Xác nhận đã chuyển khoản] -> Lệnh chuyển PAID
        AdminDesk-->>Wallet: Cập nhật số dư ví và lưu nhật ký kiểm toán (/admin/audit-logs)
    end
```

- **Màn hình tham gia:** `SCR-037` -> `SCR-038` -> `SCR-048` -> `SCR-051` -> `SCR-041`.

---

### 2.5. Luồng 5: Phân xử khiếu nại & Tranh chấp 3 bên

```mermaid
flowchart LR
    subgraph Driver_Step ["1. Tài xế"]
        D1["Tài xế xem vé (/bookings)"] --> D2["Phát hiện sai lệch cước quá giờ"]
        D2 --> D3["Gửi khiếu nại (/disputes)"]
    end

    subgraph Merchant_Step ["2. Chủ bãi"]
        M1["Chủ bãi nhận thông báo khiếu nại"]
        M1 --> M2["Xem chi tiết vụ việc (/merchant/disputes/:id)"]
    end

    subgraph Admin_Step ["3. Quản trị viên"]
        A1["Tiếp nhận hồ sơ (/admin/disputes/:id)"]
        A1 --> A2["Tra cứu nhật ký kiểm toán (/admin/audit-logs) & ảnh camera ALPR"]
        A2 --> A3["Nhập phán quyết giải quyết (Resolution) -> Đóng hồ sơ RESOLVED"]
    end

    D3 --> M1
    D3 --> A1
    A3 -.->|Thông báo kết quả phán quyết| D3
    A3 -.->|Thông báo kết quả phán quyết| M2
```

- **Màn hình tham gia:** `SCR-017` -> `DRV-DISP-01` -> `SCR-039` -> `SCR-049` -> `SCR-050` -> `SCR-051` -> `DRV-DISP-02` -> `SCR-040`.

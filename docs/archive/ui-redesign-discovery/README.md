# SmartParkingHub — Hệ Thống Tài Liệu Reverse Engineering & UI/UX Discovery

> **Dự án:** SmartParkingHub (Nền tảng Quản lý & Đặt chỗ Bãi Đỗ Xe Thông Minh Thời Gian Thực)  
> **Mục tiêu:** Tái hiện toàn bộ kiến trúc giao diện, luồng nghiệp vụ, API mapping, phân quyền và dữ liệu hiện tại để phục vụ thiết kế lại toàn bộ UI bằng công cụ **Stitch** mà không bị mất sót bất kỳ tính năng nào.  
> **Tác giả:** Senior Business Analyst, Senior UI/UX Auditor & Software Architect Agent  
> **Thời điểm thẩm định:** 11/2026  
> **Trạng thái:** VERIFIED từ mã nguồn thực tế Frontend (Vite/React/TS) và Backend (Spring Boot Monolith & Microservices).

---

## 1. Cấu Trúc Tài Liệu (Document Map)

Bộ tài liệu được tổ chức theo cấu trúc tiêu chuẩn tại thư mục `docs/ui-redesign-discovery/`:

```
docs/ui-redesign-discovery/
│
├── README.md                      # Hướng dẫn định vị và quy ước tài liệu (File này)
├── 00_EXECUTIVE_SUMMARY.md        # Tóm tắt điều hành, số liệu định lượng và trạng thái
├── 01_SYSTEM_OVERVIEW.md          # Tổng quan hệ thống, người dùng mục tiêu và tech stack
├── 02_MODULE_INVENTORY.md         # Danh mục 6 module nghiệp vụ cốt lõi
├── 03_SCREEN_INVENTORY.md         # Bảng kiểm kê 53 màn hình chính + 5 modal tương tác
├── 04_ROLE_PERMISSION_MATRIX.md   # Ma trận phân quyền RBAC (DRIVER, MERCHANT, ADMIN, GUEST)
├── 05_BUSINESS_FLOWS.md           # 12 Luồng nghiệp vụ xuyên màn hình chi tiết
├── 06_API_DATA_MAPPING.md         # Đối chiếu toàn diện Frontend UI ↔ REST API ↔ Backend DB
├── 07_CURRENT_UI_UX_AUDIT.md      # Đánh giá hiện trạng UI/UX (Exists, Works, Gaps, Proposals)
├── 08_GAPS_AND_CONFLICTS.md       # Phát hiện sai lệch giữa Tài liệu SRS, Frontend và Backend
├── 09_STITCH_HANDOFF.md           # Đặc tả bàn giao thiết kế cho AI / Designer trên Stitch
│
├── modules/                       # Chi tiết từng module nghiệp vụ
│   ├── module-auth.md             # Xác thực, Đăng ký OTP, Quên mật khẩu, RBAC Session
│   ├── module-driver-portal.md    # Cổng tài xế: Tìm kiếm bản đồ, Giữ chỗ, QR, Xe, Ví
│   ├── module-merchant-portal.md  # Cổng chủ bãi: Quản lý bãi, Slot, Giá, Check-in QR, Ví
│   ├── module-admin-portal.md     # Cổng quản trị: Phê duyệt bãi, User, Giao dịch, Audit Log
│   ├── module-public-landing.md   # Trang chủ công cộng, Giải pháp, Bảng giá, Giới thiệu
│   └── module-ai-copilot.md       # Trợ lý AI Copilot định vị bãi và giải đáp chính sách
│
├── screens/                       # Đặc tả chi tiết từng màn hình (SCR-001 đến SCR-053 + Modals)
│   ├── SCR-001-to-009-landing.md  # Nhóm 9 màn hình Landing & Marketing
│   ├── SCR-010-to-013-auth.md     # Nhóm 4 màn hình Xác thực & Lỗi quyền
│   ├── SCR-014-to-025-driver.md   # Nhóm 12 màn hình Tài xế & Thanh toán
│   ├── SCR-026-to-041-merchant.md # Nhóm 16 màn hình Chủ bãi đỗ xe
│   ├── SCR-042-to-053-admin.md    # Nhóm 12 màn hình Quản trị viên
│   └── SCR-MOD-modals.md          # Đặc tả 5 Modals nghiệp vụ độc lập
│
└── evidence/                      # Dữ liệu bằng chứng kỹ thuật (Traceability)
    ├── route-map.md               # Sơ đồ định tuyến URL Frontend (React Router DOM v6)
    ├── component-map.md           # Sơ đồ cây component, layout và shared components
    ├── api-map.md                 # Danh mục 45+ REST endpoints kèm HTTP method & DTO
    └── source-reference.md        # Bảng tham chiếu dòng code và file mã nguồn cụ thể
```

---

## 2. Quy Ước Mã Định Danh (Identification Conventions)

Để đảm bảo tính nhất quán tuyệt đối giữa các văn bản và công cụ thiết kế bên ngoài, hệ thống sử dụng các mã định danh chuẩn sau:

- **Screen ID (`SCR-xxx`):** Định danh từng màn hình độc lập có route hoặc page view (ví dụ: `SCR-015: SearchParkingPage`).
- **Modal ID (`SCR-MOD-xxx`):** Định danh các dialog/drawer có luồng nghiệp vụ phức tạp (ví dụ: `SCR-MOD-01: AiChatWidget`).
- **Module ID (`MOD-xx`):**
  - `MOD-01`: Public & Landing Module
  - `MOD-02`: Authentication & Identity Module
  - `MOD-03`: Driver Operations Portal
  - `MOD-04`: Merchant Operations Portal
  - `MOD-05`: System Administration & Moderation
  - `MOD-06`: AI Copilot & Assistance
- **Flow ID (`FLOW-xx`):** Định danh luồng nghiệp vụ liên màn hình (ví dụ: `FLOW-02: Giữ chỗ & Thanh toán đặt cọc 10 phút`).

---

## 3. Quy Ước Mức Độ Xác Minh Dữ Liệu (Evidence Levels)

Mọi thông tin trong bộ tài liệu này đều được gắn nhãn mức độ tin cậy theo thứ tự ưu tiên kiểm chứng:

1. **`VERIFIED`**: Được chứng minh trực tiếp bằng mã nguồn đang chạy (source code Frontend `smart-parking-app` kết hợp Backend `smart-parking-service` / `smart-parking-microservice`).
2. **`CODE_ONLY`**: Chức năng/trường dữ liệu đã được định nghĩa trong code (DTO, Component, Entity) nhưng chưa có endpoint hoặc UI kích hoạt thực tế.
3. **`DOCUMENTED_ONLY`**: Tính năng chỉ xuất hiện trong tài liệu SRS hoặc báo cáo BE mà chưa được cài đặt trong Frontend code.
4. **`INFERRED`**: Suy luận logic dựa trên luồng dữ liệu và thiết kế kiến trúc chuẩn.
5. **`CONFLICT`**: Có sự mâu thuẫn giữa tài liệu mô tả, mã nguồn Frontend và Backend.
6. **`UNKNOWN`**: Chưa có đủ căn cứ kỹ thuật để khẳng định.

---

## 4. Hướng Dẫn Bắt Đầu Dành Cho Đội Ngũ Thiết Kế UI (Stitch Designer)

1. Đọc trước [00_EXECUTIVE_SUMMARY.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/00_EXECUTIVE_SUMMARY.md) để nắm nhanh bức tranh tổng thể và các thông số định lượng.
2. Đọc [01_SYSTEM_OVERVIEW.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/01_SYSTEM_OVERVIEW.md) và [04_ROLE_PERMISSION_MATRIX.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/04_ROLE_PERMISSION_MATRIX.md) để hiểu 3 nhóm người dùng (`DRIVER`, `MERCHANT`, `ADMIN`) và ngữ cảnh sử dụng.
3. Mở [09_STITCH_HANDOFF.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/09_STITCH_HANDOFF.md) khi bắt đầu soạn prompt cho từng màn hình trên Stitch.
4. Tra cứu chi tiết từng màn hình tại thư mục `screens/` để lấy chính xác các trường dữ liệu bắt buộc, các action button và các trạng thái giao diện (Loading, Empty, Error, Success).

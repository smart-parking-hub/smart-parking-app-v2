# Kế Hoạch Sprint Backlog 2: Triển Khai Toàn Diện 53 Giao Diện (Screen-by-Screen Breakdown)
> Dự án: **SmartParkingHub Logistics Platform** (CRM Frontend `smart-parking-app-v2`)  
> Nguồn đặc tả: [`docs/ui-redesign-discovery/detail-screens/`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens)  
> Quy chuẩn thực thi: **Hiến pháp Rule 15 (13 Quy tắc nghiêm ngặt & Kiến trúc 4 lớp)**  
> Tổng số Task: **53 Tasks** (Mỗi màn hình 1 Task độc lập) | Tổng Story Points: **178 STP**  

---

## 📊 Bảng Tổng Quan Phân Bổ Task Theo Phân Hệ (Module Distribution)

| Module ID | Tên Phân Hệ | Dải Màn Hình | Số Lượng Tasks | Tổng Story Points | Độ Ưu Tiên | Trạng Thái Hiện Tại |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **MOD-01** | Public Landing & Marketing Website | `SCR-001` → `SCR-009` | 9 Tasks | **21 STP** | Medium / High | Đã hoàn thành (SCR-001..009) |
| **MOD-02** | Authentication & Role Authorization | `SCR-010` → `SCR-013` | 4 Tasks | **10 STP** | Critical / High | Sẵn sàng thực thi |
| **MOD-03** | Driver Experience & Parking Operations | `SCR-014` → `SCR-025` | 12 Tasks | **44 STP** | Critical / High | Sẵn sàng thực thi |
| **MOD-04** | Merchant Portal & Lot Operations | `SCR-026` → `SCR-041` | 16 Tasks | **58 STP** | High / Medium | Sẵn sàng thực thi |
| **MOD-05** | Admin Portal & System Governance | `SCR-042` → `SCR-053` | 12 Tasks | **45 STP** | High / Medium | Sẵn sàng thực thi |
| **TỔNG CỘNG** | **Toàn Bộ Hệ Thống SmartParkingHub** | **SCR-001 → SCR-053** | **53 Tasks** | **178 STP** | — | — |

---

## 📑 Danh Sách Chi Tiết 53 Tasks Trong Sprint Backlog 2

### [FE] Trang chủ Marketing & Live Hero Map (LandingPage) (SCR-001) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US01` → Task `SP-S2-FE-001`
> **Priority:** `High` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Giới thiệu nền tảng, tìm bãi nhanh, số liệu thống kê
- **Mục tiêu chi tiết:** Triển khai màn hình `LandingPage` (`SCR-001`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Tìm bãi nhanh, xem giải pháp, chuyển trang đăng ký.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-001`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-001-landing-home.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Giải pháp Dành cho Tài xế Xe tải (DriverSolutionsPage) (SCR-002) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US02` → Task `SP-S2-FE-002`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Trình bày lợi ích dành cho tài xế xe tải/ô tô
- **Mục tiêu chi tiết:** Triển khai màn hình `DriverSolutionsPage` (`SCR-002`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/solutions/drivers``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem tính năng, bấm CTA tìm bãi đỗ.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/solutions/drivers``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-002`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-002-driver-solutions.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Giải pháp Dành cho Chủ bãi Đỗ (OwnerSolutionsPage) (SCR-003) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US03` → Task `SP-S2-FE-003`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Giới thiệu công cụ quản lý và tăng doanh thu cho chủ bãi
- **Mục tiêu chi tiết:** Triển khai màn hình `OwnerSolutionsPage` (`SCR-003`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/solutions/owners``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem quy trình hợp tác, bấm CTA đăng ký bãi.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/solutions/owners``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-003`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-003-owner-solutions.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Bảng giá Dịch vụ & Gói Bãi xe (PricingPage) (SCR-004) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US03` → Task `SP-S2-FE-004`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Công bố bảng giá dịch vụ nền tảng & các gói bãi xe
- **Mục tiêu chi tiết:** Triển khai màn hình `PricingPage` (`SCR-004`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/pricing``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** So sánh gói dịch vụ, chọn gói đăng ký.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/pricing``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-004`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-004-pricing.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Tài liệu Tích hợp API & Webhooks (ApiIntegrationPage) (SCR-005) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US03` → Task `SP-S2-FE-005`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Giới thiệu API/Webhook kết nối hệ thống logistics bên thứ ba
- **Mục tiêu chi tiết:** Triển khai màn hình `ApiIntegrationPage` (`SCR-005`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/solutions/api``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Đọc tài liệu, gửi form yêu cầu cấp API key.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/solutions/api``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-005`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-005-api-integration.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Giới thiệu Doanh nghiệp & Đội ngũ (AboutUsPage) (SCR-006) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US03` → Task `SP-S2-FE-006`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Giới thiệu tầm nhìn, sứ mệnh đội ngũ SmartParking
- **Mục tiêu chi tiết:** Triển khai màn hình `AboutUsPage` (`SCR-006`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/company/about``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem thông tin công ty, giá trị cốt lõi.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/company/about``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-006`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-006-about-us.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Cơ hội Nghề nghiệp & Tuyển dụng (CareersPage) (SCR-007) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US03` → Task `SP-S2-FE-007`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Đăng tin tuyển dụng nhân sự vận hành và kỹ thuật
- **Mục tiêu chi tiết:** Triển khai màn hình `CareersPage` (`SCR-007`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/company/careers``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem vị trí tuyển dụng, bấm nộp hồ sơ.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/company/careers``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-007`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-007-careers.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Tin tức, Kiến thức Logistics & Báo cáo (BlogPage) (SCR-008) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US03` → Task `SP-S2-FE-008`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Chia sẻ bài viết kinh nghiệm đỗ xe an toàn và logistics
- **Mục tiêu chi tiết:** Triển khai màn hình `BlogPage` (`SCR-008`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/company/blog``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Tìm bài viết, xem danh mục tin tức.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/company/blog``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-008`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-008-blog.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Liên hệ Hợp tác & Hỗ trợ Kỹ thuật 24/7 (ContactPage) (SCR-009) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-01` (Public Landing & Marketing) → Story `SP-FE-MOD-01-US03` → Task `SP-S2-FE-009`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Tiếp nhận thông tin liên hệ hợp tác và hỗ trợ kỹ thuật
- **Mục tiêu chi tiết:** Triển khai màn hình `ContactPage` (`SCR-009`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/company/contact``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/landing/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-01).
  - `src/features/landing/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Điền form (Tên, Email, Nội dung), bấm Gửi.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API (Form HTML tĩnh)`
- **Vai trò truy cập (RBAC):** `GUEST, ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/company/contact``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `Không gọi API (Form HTML tĩnh)` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-009`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-009-contact.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Đăng nhập Tài khoản Đa vai trò (LoginPage) (SCR-010) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-02` (Authentication & Authorization) → Story `SP-FE-MOD-02-US01` → Task `SP-S2-FE-010`
> **Priority:** `Critical` | **Complexity:** `S` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Xác thực người dùng bằng Số điện thoại và Mật khẩu
- **Mục tiêu chi tiết:** Triển khai màn hình `LoginPage` (`SCR-010`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/login``
- **Khung giao diện (Layout):** `AuthLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/auth/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-02).
  - `src/features/auth/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Nhập SĐT, Mật khẩu, Ghi nhớ, Bấm Đăng nhập.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `POST `/api/v1/auth/login``
- **Vai trò truy cập (RBAC):** `GUEST`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng chưa đăng nhập mở `/login`,
- **When** nhập số điện thoại và mật khẩu hợp lệ rồi bấm 'Đăng nhập',
- **Then** hệ thống lưu JWT, cập nhật trạng thái auth trong Zustand và chuyển hướng đúng dashboard theo vai trò (DRIVER, MERCHANT, ADMIN).

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-010`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-010-login.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Đăng ký Tài khoản Tài xế / Chủ bãi (RegisterPage) (SCR-011) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-02` (Authentication & Authorization) → Story `SP-FE-MOD-02-US02` → Task `SP-S2-FE-011`
> **Priority:** `Critical` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Đăng ký tài khoản mới kèm vai trò DRIVER hoặc MERCHANT
- **Mục tiêu chi tiết:** Triển khai màn hình `RegisterPage` (`SCR-011`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/register``
- **Khung giao diện (Layout):** `AuthLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/auth/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-02).
  - `src/features/auth/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Chọn vai trò, nhập thông tin, nhận OTP, xác nhận.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `POST `/api/v1/auth/register`, POST `/api/v1/auth/otp/send``
- **Vai trò truy cập (RBAC):** `GUEST`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/register``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AuthLayout`, nạp dữ liệu từ API `POST `/api/v1/auth/register`, POST `/api/v1/auth/otp/send`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-011`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-011-register.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Khôi phục Mật khẩu qua Mã xác thực OTP (ForgotPasswordPage) (SCR-012) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-02` (Authentication & Authorization) → Story `SP-FE-MOD-02-US03` → Task `SP-S2-FE-012`
> **Priority:** `High` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Khôi phục mật khẩu thông qua xác thực mã OTP
- **Mục tiêu chi tiết:** Triển khai màn hình `ForgotPasswordPage` (`SCR-012`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/forgot-password``
- **Khung giao diện (Layout):** `AuthLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/auth/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-02).
  - `src/features/auth/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Nhập email/SĐT, nhập OTP, đặt mật khẩu mới.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `POST `/api/v1/auth/forgot-password/*``
- **Vai trò truy cập (RBAC):** `GUEST`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/forgot-password``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AuthLayout`, nạp dữ liệu từ API `POST `/api/v1/auth/forgot-password/*`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-012`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-012-forgot-password.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Thông báo Lỗi Truy cập 403 Forbidden (ForbiddenPage) (SCR-013) (1 STP)

> **Hierarchy:** Epic `SP-FE-MOD-02` (Authentication & Authorization) → Story `SP-FE-MOD-02-US04` → Task `SP-S2-FE-013`
> **Priority:** `High` | **Complexity:** `S` | **Estimated Effort:** `2h` | **Story Points:** `1 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Thông báo từ chối truy cập khi không đủ quyền
- **Mục tiêu chi tiết:** Triển khai màn hình `ForbiddenPage` (`SCR-013`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/403``
- **Khung giao diện (Layout):** `Standalone`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/auth/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-02).
  - `src/features/auth/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Bấm nút "Quay lại trang chủ".

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API`
- **Vai trò truy cập (RBAC):** `ALL`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/403``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `Standalone`, nạp dữ liệu từ API `Không gọi API` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-013`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-013-forbidden.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Bảng điều khiển Tổng quan Tài xế (DriverDashboardPage) (SCR-014) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US01` → Task `SP-S2-FE-014`
> **Priority:** `High` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Tổng quan các chuyến đỗ xe gần đây, lối tắt nhanh
- **Mục tiêu chi tiết:** Triển khai màn hình `DashboardHomePage` (`SCR-014`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/dashboard``
- **Khung giao diện (Layout):** `LandingLayout / DashboardLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem thống kê, bấm tìm bãi, bấm xem xe.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/bookings`, GET `/api/v1/vehicles``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/dashboard``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout / DashboardLayout`, nạp dữ liệu từ API `GET `/api/v1/bookings`, GET `/api/v1/vehicles`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-014`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-014-driver-dashboard.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Bản đồ Tương tác & Tìm kiếm Bãi đỗ Xe tải (SearchParkingPage) (SCR-015) (8 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US02` → Task `SP-S2-FE-015`
> **Priority:** `Critical` | **Complexity:** `XL` | **Estimated Effort:** `16h` | **Story Points:** `8 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Tìm kiếm bãi đỗ xe trên bản đồ Leaflet, lọc slot, ETA
- **Mục tiêu chi tiết:** Triển khai màn hình `SearchParkingPage` (`SCR-015`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/parking`, `/dashboard/search``
- **Khung giao diện (Layout):** `LandingLayout / DashboardLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Lọc xe, chỉnh bán kính, tìm kiếm địa chỉ, bấm Quick Book.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/parking-lots/search`, Nominatim Geocode`
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** tài xế mở bản đồ tìm kiếm `/parking`,
- **When** chọn loại phương tiện và vị trí GPS trên bản đồ,
- **Then** bản đồ Leaflet hiển thị các bãi xe phù hợp kèm số chỗ trống theo thời gian thực và cho phép bấm giữ chỗ nhanh 10 phút.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-015`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-015-driver-search-parking.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Chi tiết Bãi đỗ & Modal Đặt giữ chỗ 10p (ParkingDetailPage) (SCR-016) (8 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US03` → Task `SP-S2-FE-016`
> **Priority:** `Critical` | **Complexity:** `XL` | **Estimated Effort:** `16h` | **Story Points:** `8 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Chi tiết bãi đỗ, thư viện ảnh, tiện ích, slot trống, bảng giá
- **Mục tiêu chi tiết:** Triển khai màn hình `ParkingDetailPage` (`SCR-016`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/dashboard/parking/:id``
- **Khung giao diện (Layout):** `DashboardLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem bảng giá, chọn xe, tạo đặt giữ chỗ 10p, vào hàng đợi.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/parking-lots/{id}`, POST `/api/v1/bookings`, POST `/api/v1/queues``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** tài xế xem chi tiết bãi xe `/dashboard/parking/:id`,
- **When** chọn phương tiện, thời gian đỗ và bấm 'Đặt chỗ ngay',
- **Then** hệ thống kích hoạt modal giữ chỗ tạm thời (Hold TTL 10 phút đếm ngược) và kết nối PayOS tạo liên kết cọc 20%.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-016`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-016-driver-parking-detail.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Quản lý Danh sách Đơn Đặt chỗ của tôi (MyBookingsPage) (SCR-017) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US04` → Task `SP-S2-FE-017`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Quản lý toàn bộ danh sách đặt chỗ, xem mã QR, thanh toán
- **Mục tiêu chi tiết:** Triển khai màn hình `MyBookingsPage` (`SCR-017`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/bookings``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Tìm kiếm, lọc trạng thái, thanh toán cọc, hủy cọc, đánh giá.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/bookings`, POST `/cancel`, POST `/pay-deposit`, POST `/pay-final``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/bookings``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `GET `/api/v1/bookings`, POST `/cancel`, POST `/pay-deposit`, POST `/pay-final`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-017`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-017-driver-bookings.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Theo dõi Vị trí Hàng đợi Ảo Thông minh (DriverQueuesPage) (SCR-018) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US05` → Task `SP-S2-FE-018`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Theo dõi vị trí trong hàng đợi ảo, nhận slot khi có thông báo
- **Mục tiêu chi tiết:** Triển khai màn hình `DriverQueuesPage` (`SCR-018`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/queues``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Chuyển tab hoạt động/lịch sử, Nhận slot, Rời hàng đợi.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/queues/my`, POST `/accept`, POST `/leave``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/queues``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `GET `/api/v1/queues/my`, POST `/accept`, POST `/leave`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-018`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-018-driver-queues.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Sổ cái Lịch sử Thanh toán & Đối soát Cọc (DriverPaymentsPage) (SCR-019) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US06` → Task `SP-S2-FE-019`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Thống kê lịch sử giao dịch thanh toán tiền cọc và tiền phạt
- **Mục tiêu chi tiết:** Triển khai màn hình `DriverPaymentsPage` (`SCR-019`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/payments``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Tìm mã giao dịch, lọc SUCCESS/PENDING/FAILED, xem tổng tiền.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/payments/my``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/payments``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `GET `/api/v1/payments/my`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-019`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-019-driver-payments.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Quản lý Đội xe & Phương tiện Tài xế (VehiclesPage) (SCR-020) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US06` → Task `SP-S2-FE-020`
> **Priority:** `High` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Quản lý danh sách phương tiện sở hữu của tài xế
- **Mục tiêu chi tiết:** Triển khai màn hình `VehiclesPage` (`SCR-020`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/vehicles`, `/dashboard/vehicles``
- **Khung giao diện (Layout):** `LandingLayout / DashboardLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Thêm xe mới (Modal), Sửa thông tin, Xóa xe (Soft delete).

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/vehicles`, POST `/`, PUT `/{id}`, DELETE `/{id}``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/vehicles`, `/dashboard/vehicles``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout / DashboardLayout`, nạp dữ liệu từ API `GET `/api/v1/vehicles`, POST `/`, PUT `/{id}`, DELETE `/{id}`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-020`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-020-driver-vehicles.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Hồ sơ Cá nhân & Cài đặt Tài xế (ProfilePage) (SCR-021) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US06` → Task `SP-S2-FE-021`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Cập nhật hồ sơ cá nhân tài xế (Họ tên, SĐT, Email, SĐT khẩn cấp)
- **Mục tiêu chi tiết:** Triển khai màn hình `ProfilePage` (`SCR-021`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/profile``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Sửa thông tin, bấm Lưu thay đổi.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/users/me`, PUT `/api/v1/users/me``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/profile``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `GET `/api/v1/users/me`, PUT `/api/v1/users/me`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-021`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-021-driver-profile.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Thay đổi Mật khẩu Bảo mật Tài khoản (ChangePasswordPage) (SCR-022) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US06` → Task `SP-S2-FE-022`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Thay đổi mật khẩu đăng nhập tài khoản tài xế
- **Mục tiêu chi tiết:** Triển khai màn hình `ChangePasswordPage` (`SCR-022`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/change-password``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Nhập mật khẩu cũ, mật khẩu mới, xác nhận lại.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `POST `/api/v1/users/me/password``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/change-password``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `POST `/api/v1/users/me/password`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-022`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-022-driver-change-password.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Kết quả Thanh toán PayOS Thành công (PaymentSuccessPage) (SCR-023) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US06` → Task `SP-S2-FE-023`
> **Priority:** `High` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Hiển thị kết quả thanh toán PayOS thành công, đồng bộ hệ thống
- **Mục tiêu chi tiết:** Triển khai màn hình `PaymentSuccessPage` (`SCR-023`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/payment/success``
- **Khung giao diện (Layout):** `Standalone`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Bấm "Về đặt chỗ của tôi", Thử đồng bộ lại, Xác nhận demo.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `POST `/api/v1/bookings/{id}/sync-payos`, POST `/demo-deposit``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/payment/success``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `Standalone`, nạp dữ liệu từ API `POST `/api/v1/bookings/{id}/sync-payos`, POST `/demo-deposit`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-023`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-023-driver-payment-success.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Thông báo Thanh toán Bị hủy & Hướng dẫn Thử lại (PaymentCancelPage) (SCR-024) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US06` → Task `SP-S2-FE-024`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Thông báo thanh toán bị hủy, hướng dẫn thử lại
- **Mục tiêu chi tiết:** Triển khai màn hình `PaymentCancelPage` (`SCR-024`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/payment/cancel``
- **Khung giao diện (Layout):** `Standalone`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Bấm "Về đặt chỗ của tôi" để thanh toán lại trước khi hết 10p.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `Không gọi API mới`
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/payment/cancel``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `Standalone`, nạp dữ liệu từ API `Không gọi API mới` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-024`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-024-driver-payment-cancel.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Trung tâm Thông báo Vận hành Tài xế (DriverNotificationsPage) (SCR-025) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-03` (Driver Experience & Operations) → Story `SP-FE-MOD-03-US06` → Task `SP-S2-FE-025`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Xem toàn bộ thông báo đẩy (Booking, Thanh toán, Hàng đợi)
- **Mục tiêu chi tiết:** Triển khai màn hình `DriverNotificationsPage` (`SCR-025`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/notifications``
- **Khung giao diện (Layout):** `LandingLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/driver/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-03).
  - `src/features/driver/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Đọc thông báo, Đánh dấu đã đọc, Bấm vào xem chi tiết.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/notifications`, POST `/{id}/read`, POST `/read-all``
- **Vai trò truy cập (RBAC):** `DRIVER`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/notifications``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `LandingLayout`, nạp dữ liệu từ API `GET `/api/v1/notifications`, POST `/{id}/read`, POST `/read-all`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-025`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-025-driver-notifications.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Bảng Điều khiển Tổng quan Vận hành Chủ bãi (MerchantDashboardPage) (SCR-026) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US01` → Task `SP-S2-FE-026`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Thống kê số bãi, booking hôm nay, doanh thu, xe đang đỗ
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantDashboardPage` (`SCR-026`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/dashboard``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem chỉ số KPI, xem bãi xe, bấm lối tắt quản lý.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/merchant/parking-lots`, GET `/api/v1/merchant/revenue``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/dashboard``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/merchant/parking-lots`, GET `/api/v1/merchant/revenue`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-026`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-026-merchant-dashboard.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Hồ sơ Chủ bãi & Thông tin Ngân hàng Rút tiền (MerchantProfilePage) (SCR-027) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US02` → Task `SP-S2-FE-027`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Quản lý hồ sơ chủ bãi, giấy phép kinh doanh, tài khoản ngân hàng
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantProfilePage` (`SCR-027`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/profile``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Sửa thông tin ngân hàng, bấm Lưu hồ sơ.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/merchant/profile`, PUT `/api/v1/merchant/profile``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/profile``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/merchant/profile`, PUT `/api/v1/merchant/profile`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-027`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-027-merchant-profile.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Danh sách & Lưới Trạng thái Bãi đỗ xe (MerchantParkingLotsPage) (SCR-028) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US03` → Task `SP-S2-FE-028`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Danh sách bãi đỗ xe thuộc quyền sở hữu của chủ bãi
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantParkingLotsPage` (`SCR-028`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/parking-lots``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Tìm kiếm, xem trạng thái duyệt, bấm Sửa, Cấu hình Slot, Giá.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/merchant/parking-lots``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/parking-lots``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/merchant/parking-lots`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-028`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-028-merchant-parking-lots.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Đăng ký Tạo mới Bãi đỗ & Tải ảnh Mặt bằng (CreateMerchantParkingLotPage) (SCR-029) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US04` → Task `SP-S2-FE-029`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Đăng ký tạo bãi đỗ mới và tải lên bộ ảnh mặt bằng
- **Mục tiêu chi tiết:** Triển khai màn hình `CreateMerchantParkingLotPage` (`SCR-029`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/parking-lots/new``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Nhập tên, địa chỉ, GPS, tiện ích, chọn ảnh, bấm Gửi duyệt.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `POST `/api/v1/merchant/parking-lots`, POST `/{id}/images``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** chủ bãi mở form tạo bãi mới `/merchant/parking-lots/new`,
- **When** điền đầy đủ thông tin bãi, định vị GPS, tải ảnh mặt bằng và bấm 'Gửi duyệt',
- **Then** bãi đỗ được lưu ở trạng thái PENDING_APPROVAL và thông báo cho Super Admin thẩm định.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-029`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-029-merchant-create-parking-lot.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Chi tiết Vận hành & Doanh thu Bãi đỗ (MerchantParkingLotDetailPage) (SCR-030) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US05` → Task `SP-S2-FE-030`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Xem chi tiết thông số, ảnh chụp, doanh thu riêng của 1 bãi
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantParkingLotDetailPage` (`SCR-030`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/parking-lots/:parkingLotId``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem trạng thái duyệt, bấm chỉnh sửa, bấm cấu hình slot/giá.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/merchant/parking-lots/{id}`, GET `/{id}/revenue``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/parking-lots/:parkingLotId``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/merchant/parking-lots/{id}`, GET `/{id}/revenue`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-030`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-030-merchant-parking-lot-detail.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Chỉnh sửa Thông tin & Tiện ích Bãi đỗ (EditMerchantParkingLotPage) (SCR-031) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US06` → Task `SP-S2-FE-031`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Chỉnh sửa thông tin bãi đỗ, số điện thoại, mô tả tiện ích
- **Mục tiêu chi tiết:** Triển khai màn hình `EditMerchantParkingLotPage` (`SCR-031`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/parking-lots/:parkingLotId/edit``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Cập nhật thông tin, tải thêm ảnh, bấm Lưu thay đổi.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `PUT `/api/v1/merchant/parking-lots/{id}``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/parking-lots/:parkingLotId/edit``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `PUT `/api/v1/merchant/parking-lots/{id}`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-031`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-031-merchant-edit-parking-lot.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Cấu hình Sức chứa Sơ đồ 5 Loại xe (MerchantSlotsPage) (SCR-032) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US07` → Task `SP-S2-FE-032`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Cấu hình sức chứa tối đa (`totalCapacity`) cho 5 loại phương tiện
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantSlotsPage` (`SCR-032`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/parking-lots/:parkingLotId/slots``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Sửa từng loại xe, Bấm Cập nhật hàng loạt (Bulk save).

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/parking-lots/{id}/slots`, PUT `/slots`, PUT `/slots/bulk``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/parking-lots/:parkingLotId/slots``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/parking-lots/{id}/slots`, PUT `/slots`, PUT `/slots/bulk`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-032`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-032-merchant-slots.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Thiết lập Biểu phí Ma trận 4 Thông số (MerchantPricingPage) (SCR-033) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-033`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Cấu hình biểu phí: Theo giờ, qua đêm, quá giờ, cọc cho 5 loại xe
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantPricingPage` (`SCR-033`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/parking-lots/:parkingLotId/pricing``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Nhập đơn giá, bấm Lưu đơn lẻ hoặc Lưu hàng loạt (Bulk).

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/parking-lots/{id}/pricing`, PUT `/pricing`, PUT `/pricing/bulk``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/parking-lots/:parkingLotId/pricing``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/parking-lots/{id}/pricing`, PUT `/pricing`, PUT `/pricing/bulk`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-033`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-033-merchant-pricing.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Quản lý Lịch sử & Đơn Đặt chỗ Khách hàng (MerchantBookingsPage) (SCR-034) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-034`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Quản lý toàn bộ danh sách đặt chỗ của khách tại bãi của Merchant
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantBookingsPage` (`SCR-034`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/bookings``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Lọc theo bãi xe, phân trang, xem trạng thái, xem chi tiết.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/merchant/bookings``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/bookings``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/merchant/bookings`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-034`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-034-merchant-bookings.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Chi tiết Đơn Đặt chỗ & Nhật ký Barie (MerchantBookingDetailPage) (SCR-035) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-035`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Xem chi tiết 1 booking: Biển số, loại xe, giờ vào/ra, thanh toán
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantBookingDetailPage` (`SCR-035`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/bookings/:bookingId``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem hóa đơn, kiểm tra nhật ký check-in/out.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/merchant/bookings/{id}``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/bookings/:bookingId``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/merchant/bookings/{id}`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-035`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-035-merchant-booking-detail.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Camera Quét QR Barie Ra/Vào & Thu tiền mặt (MerchantQrScannerPage) (SCR-036) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-036`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Quét mã QR check-in xe vào và check-out tính tiền xe ra bãi
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantQrScannerPage` (`SCR-036`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/qr-scanner``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Bật camera quét, nhập mã bookingCode, xác nhận thu tiền mặt.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `POST `/api/v1/merchant/check-in`, POST `/check-out`, POST `/confirm-cash``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** chủ bãi mở công cụ camera QR `/merchant/qr-scanner`,
- **When** quét mã QR vé hợp lệ của tài xế lúc vào hoặc ra bãi,
- **Then** hệ thống kiểm tra bookingCode, tính toán thời gian thực đỗ/quá giờ, hiện modal xác nhận thu tiền mặt và ghi nhận check-in/out.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-036`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-036-merchant-qr-scanner.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Phân tích Biểu đồ Doanh thu & Sổ cái Ví (MerchantRevenuePage) (SCR-037) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-037`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Biểu đồ Recharts phân tích doanh thu theo Ngày, Tháng, Năm
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantRevenuePage` (`SCR-037`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/revenue``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Chọn khoảng ngày, đổi độ mịn (DAY/MONTH/YEAR), xem ví.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/merchant/revenue``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/revenue``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/merchant/revenue`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-037`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-037-merchant-revenue.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Tạo Yêu cầu Rút tiền & Quản lý Giải ngân (MerchantWithdrawalsPage) (SCR-038) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-038`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Xem số dư ví và tạo lệnh yêu cầu rút tiền về ngân hàng
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantWithdrawalsPage` (`SCR-038`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/withdrawals``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Tạo yêu cầu rút tiền mới, theo dõi trạng thái PENDING/PAID.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/withdrawals`, POST `/api/v1/withdrawals``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/withdrawals``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/withdrawals`, POST `/api/v1/withdrawals`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-038`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-038-merchant-withdrawals.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Danh sách Khiếu nại từ Tài xế (MerchantDisputesPage) (SCR-039) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-039`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Danh sách các vụ khiếu nại của tài xế liên quan đến bãi xe
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantDisputesPage` (`SCR-039`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/disputes``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem mã ticket, tên tài xế, lý do, bấm xem chi tiết.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/disputes/merchant``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/disputes``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/disputes/merchant`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-039`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-039-merchant-disputes.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Chi tiết Khiếu nại, Lời khai & Bằng chứng (MerchantDisputeDetailPage) (SCR-040) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-040`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Chi tiết khiếu nại, lời khai của tài xế và phán quyết của Admin
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantDisputeDetailPage` (`SCR-040`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/disputes/:ticketId``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Đọc phản hồi, kiểm tra bằng chứng.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/disputes/merchant/{id}``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/disputes/:ticketId``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/disputes/merchant/{id}`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-040`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-040-merchant-dispute-detail.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Trung tâm Thông báo Vận hành Bãi xe (MerchantNotificationsPage) (SCR-041) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-04` (Merchant Portal & Operations) → Story `SP-FE-MOD-04-US08` → Task `SP-S2-FE-041`
> **Priority:** `Medium` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Thông báo vận hành bãi (Duyệt bãi, Booking mới, Tiền rút)
- **Mục tiêu chi tiết:** Triển khai màn hình `MerchantNotificationsPage` (`SCR-041`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/merchant/notifications``
- **Khung giao diện (Layout):** `MerchantLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/merchant/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-04).
  - `src/features/merchant/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Đọc thông báo, đánh dấu đã đọc.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/notifications`, POST `/read``
- **Vai trò truy cập (RBAC):** `MERCHANT`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/merchant/notifications``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `MerchantLayout`, nạp dữ liệu từ API `GET `/api/v1/notifications`, POST `/read`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-041`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-041-merchant-notifications.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Trung tâm Điều hành Toàn sàn Super Admin (AdminDashboardPage) (SCR-042) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US01` → Task `SP-S2-FE-042`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Chỉ số vĩ mô toàn sàn: User, Driver, Merchant, Bãi xe, Doanh thu
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminDashboardPage` (`SCR-042`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/dashboard``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem thống kê tổng, xem bãi chờ duyệt, xem người dùng mới.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/dashboard``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/dashboard``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/admin/dashboard`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-042`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-042-admin-dashboard.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Danh sách Kiểm duyệt Bãi đỗ Toàn hệ thống (AdminParkingLotsPage) (SCR-043) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US02` → Task `SP-S2-FE-043`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Danh sách bãi đỗ toàn hệ thống với bộ lọc trạng thái duyệt
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminParkingLotsPage` (`SCR-043`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/parking-lots``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Lọc PENDING/APPROVED/REJECTED, bấm Thẩm định bãi.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/parking-lots``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/parking-lots``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/admin/parking-lots`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-043`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-043-admin-parking-lots.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Thẩm định Hồ sơ Mặt bằng & Ra quyết định Duyệt (AdminParkingLotDetailPage) (SCR-044) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US03` → Task `SP-S2-FE-044`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Thẩm định hồ sơ bãi: Bản đồ, Chủ bãi, Ảnh chụp, Slot, Biểu giá
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminParkingLotDetailPage` (`SCR-044`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/parking-lots/:parkingLotId``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Phê duyệt (Approve), Yêu cầu sửa (Request Changes), Từ chối.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/parking-lots/{id}`, PUT `/approve`, PUT `/reject``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** quản trị viên mở trang thẩm định bãi đỗ `/admin/parking-lots/:id`,
- **When** kiểm tra bản đồ, giấy phép, ảnh chụp thực tế và bấm 'Phê duyệt' hoặc 'Từ chối' kèm lý do,
- **Then** hệ thống cập nhật trạng thái bãi đỗ, ghi nhận audit log và gửi thông báo tự động tới Merchant.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-044`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-044-admin-parking-lot-detail.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Danh bạ Quản lý Tài khoản & Phân quyền Toàn sàn (AdminUsersPage) (SCR-045) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US04` → Task `SP-S2-FE-045`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Quản lý danh sách tài khoản toàn sàn, lọc theo vai trò và trạng thái
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminUsersPage` (`SCR-045`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/users``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Lọc DRIVER/MERCHANT, Tìm SĐT, Bấm Khóa tài khoản (Ban).

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/users`, PUT `/{id}/ban`, PUT `/{id}/unban``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/users``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/admin/users`, PUT `/{id}/ban`, PUT `/{id}/unban`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-045`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-045-admin-users.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Hồ sơ Người dùng, Lịch sử Đỗ & Khóa tài khoản (AdminUserDetailPage) (SCR-046) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US05` → Task `SP-S2-FE-046`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Xem chi tiết hoạt động của 1 người dùng (Số booking, khiếu nại)
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminUserDetailPage` (`SCR-046`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/users/:userId``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Khóa tài khoản có lý do, Mở khóa tài khoản.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/users/{id}`, PUT `/ban`, PUT `/unban``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/users/:userId``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/admin/users/{id}`, PUT `/ban`, PUT `/unban`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-046`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-046-admin-user-detail.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Sổ cái Giám sát Giao dịch Dòng tiền Toàn hệ thống (AdminTransactionsPage) (SCR-047) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US06` → Task `SP-S2-FE-047`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Giám sát toàn bộ dòng tiền vào/ra trên hệ thống (PayOS, VNPay)
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminTransactionsPage` (`SCR-047`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/transactions``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Lọc mã giao dịch, lọc booking, lọc người nộp, xem trạng thái.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/transactions``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/transactions``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/admin/transactions`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-047`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-047-admin-transactions.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Phê duyệt & Quyết toán Lệnh Rút tiền Ví Chủ bãi (AdminWithdrawalsPage) (SCR-048) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US06` → Task `SP-S2-FE-048`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Danh sách yêu cầu rút tiền từ ví của các chủ bãi
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminWithdrawalsPage` (`SCR-048`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/withdrawals``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem số dư, kiểm tra ngân hàng, Duyệt chi (Approve), Từ chối.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/withdrawals`, PUT `/{id}/approve`, PUT `/{id}/reject``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/withdrawals``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/admin/withdrawals`, PUT `/{id}/approve`, PUT `/{id}/reject`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-048`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-048-admin-withdrawals.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Bàn Trọng tài & Danh sách Tranh chấp Mở (AdminDisputesPage) (SCR-049) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US06` → Task `SP-S2-FE-049`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Danh sách các vụ tranh chấp đang mở giữa tài xế và chủ bãi
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminDisputesPage` (`SCR-049`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/disputes``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Lọc OPEN/IN_REVIEW/RESOLVED, bấm thụ lý giải quyết.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/disputes/admin``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/disputes``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/disputes/admin`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-049`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-049-admin-disputes.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Phán quyết Trọng tài & Phân bổ Tiền bồi thường (AdminDisputeDetailPage) (SCR-050) (5 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US06` → Task `SP-S2-FE-050`
> **Priority:** `High` | **Complexity:** `L` | **Estimated Effort:** `10h` | **Story Points:** `5 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Hồ sơ vụ tranh chấp: Bằng chứng tài xế, số tiền, thông tin bãi
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminDisputeDetailPage` (`SCR-050`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/disputes/:disputeId``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Nhập phán quyết giải quyết (Resolution), bấm Hoàn tất giải quyết.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/disputes/admin/{id}`, PUT `/resolve``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/disputes/:disputeId``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/disputes/admin/{id}`, PUT `/resolve`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-050`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-050-admin-dispute-detail.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Nhật ký Kiểm toán An ninh & Vết Quản trị (AdminAuditLogsPage) (SCR-051) (3 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US06` → Task `SP-S2-FE-051`
> **Priority:** `Medium` | **Complexity:** `M` | **Estimated Effort:** `6h` | **Story Points:** `3 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Lịch sử ghi nhận mọi hành động quản trị hệ thống nhạy cảm
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminAuditLogsPage` (`SCR-051`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/audit-logs``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Tra cứu Actor, Hành động, Loại thực thể tác động, Thời gian.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/audit-logs``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/audit-logs``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/admin/audit-logs`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-051`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-051-admin-audit-logs.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Trung tâm Phát sóng & Cảnh báo Điều hành (AdminNotificationsPage) (SCR-052) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US06` → Task `SP-S2-FE-052`
> **Priority:** `Low` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Trung tâm thông báo điều hành và cảnh báo hệ thống
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminNotificationsPage` (`SCR-052`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/notifications``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem thông báo, đánh dấu đã đọc.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/notifications`, POST `/read``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/notifications``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/notifications`, POST `/read`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-052`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-052-admin-notifications.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---

### [FE] Hồ sơ Quản trị viên & Phiên Đăng nhập Bảo mật (AdminProfilePage) (SCR-053) (2 STP)

> **Hierarchy:** Epic `SP-FE-MOD-05` (Admin Portal & Governance) → Story `SP-FE-MOD-05-US06` → Task `SP-S2-FE-053`
> **Priority:** `Low` | **Complexity:** `S` | **Estimated Effort:** `4h` | **Story Points:** `2 STP` | **Status:** `Sprint Backlog 2`

### 1. Business Objective (Mục Tiêu Nghiệp Vụ)
Thông tin hồ sơ quản trị viên và phiên đăng nhập an toàn
- **Mục tiêu chi tiết:** Triển khai màn hình `AdminProfilePage` (`SCR-053`) bảo toàn 100% logic và trường dữ liệu, nâng cấp UI/UX hiện đại theo Tailwind CSS v4 trên `smart-parking-app-v2`.

### 2. UI Structure & Component Placement (Cấu Trúc Giao Diện & Vị Trí Lưu Trữ)
- **Đường dẫn Route:** ``/admin/profile``
- **Khung giao diện (Layout):** `AdminLayout`
- **Thư mục triển khai:** `smart-parking-app-v2/src/features/admin/`
- **Phân bổ Component theo Kiến trúc 4 Lớp (Rule 15):**
  - `src/shared/components/`: Generic UI primitives dùng chung (Button, Input, Modal, Badge, Skeleton, DataTable...).
  - `src/entities/`: Business entities hiển thị chung (MOD-05).
  - `src/features/admin/components/`: Toàn bộ các phân đoạn (Sections) và component phục vụ riêng màn hình này.
- **Thao tác chính của người dùng:** Xem thông tin cá nhân, đăng xuất.

### 3. API Contracts & Backend Mapping (Tích Hợp Dữ Liệu & Quyền Hạn)
- **API phụ thuộc:** `GET `/api/v1/admin/profile``
- **Vai trò truy cập (RBAC):** `ADMIN`
- **Quản lý trạng thái (State Management):**
  - Server state: TanStack Query (React Query) với cache invalidation chính xác.
  - Client / UI state: Zustand store cho auth/filter/modal.

### 4. UI States & Edge Cases (Các Trạng Thái Giao Diện Bắt Buộc)
- **Loading State:** Skeleton / spinner hiển thị mượt mà trong khi nạp dữ liệu.
- **Empty State:** Hình minh họa và thông báo rõ ràng khi chưa có bản ghi nào.
- **Error State:** Banner/alert hiển thị mã lỗi và nút 'Thử lại' (Retry).
- **Validation:** Ràng buộc form chặt chẽ (Zod/React Hook Form) trước khi gửi request.

### 5. Acceptance Criteria (Tiêu Chí Nghiệm Thu - Given / When / Then)
- **Given** người dùng truy cập route ``/admin/profile``,
- **When** màn hình được khởi tạo,
- **Then** giao diện hiển thị đúng layout `AdminLayout`, nạp dữ liệu từ API `GET `/api/v1/admin/profile`` và xử lý đầy đủ các trạng thái Loading/Empty/Error.

### 6. Definition of Done (DoD & Rule 15 Compliance)
- [ ] Tuân thủ nghiêm ngặt 13 Quy tắc thực thi (Rule 15): Không làm gộp, không phá vỡ visual Stitch, không bịa logic.
- [ ] Vượt qua cổng Zero-Error & Zero-Warning: `npm run typecheck` (0 lỗi TypeScript), `npm run lint` (0 warning), `npm run test` (pass), `npm run build` (pass).
- [ ] Responsive 100% Mobile & Desktop, hỗ trợ bàn phím (Tab, Enter, Esc) và tiêu chuẩn Accessibility (a11y).
- [ ] Cập nhật hồ sơ Screen Inventory (`docs/09-audit/screen-inventory.md`) và Parity Matrix.

---
### 7. Metadata & Traceability
- **Screen ID:** `SCR-053`
- **Mã nguồn tài liệu đặc tả:** `docs/ui-redesign-discovery/detail-screens/SCR-053-admin-profile.md`
- **Tài liệu tham chiếu:** `docs/ui-redesign-discovery/03_SCREEN_INVENTORY.md`

---


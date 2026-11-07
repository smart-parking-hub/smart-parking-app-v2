# Screen Specification: SCR-007 CareersPage (Tuyển dụng)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-007`
- **Screen Name:** Tuyển dụng nhân sự & Cơ hội nghề nghiệp (Careers & Jobs)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/company/careers` (Định nghĩa tại [`AppRoutes.tsx:83`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L83))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx))
- **Primary Component:** `smart-parking-app/src/features/landing/pages/CareersPage.tsx`
- **Sub-components:** `LandingNavbar`, `LandingFooter`
- **Access Role:** Public (Ứng viên, Kỹ sư, Chuyên viên kinh doanh B2B)
- **Discovery Status:** `VERIFIED` (Mã nguồn đã kiểm tra đối chiếu)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp thông tin tuyển dụng nhân tài phục vụ việc mở rộng quy mô kỹ thuật và kinh doanh bến bãi:
1. Đăng tải danh sách các vị trí đang tuyển dụng tại công ty vận hành SmartTruck.
2. Cung cấp thông tin phòng ban, hình thức làm việc (Full-time/Remote) và địa điểm làm việc (Hà Nội, TP.HCM).
3. Tạo phễu tiếp nhận hồ sơ ứng tuyển (CV) từ các nhân sự tài năng.

### B. Target Users
- Kỹ sư phần mềm, lập trình viên Frontend / Backend.
- Chuyên viên phát triển thị trường B2B bãi đỗ xe và nhân viên hỗ trợ vận hành 24/7.

---

## 3. UI STRUCTURE & LAYOUT

- **Container:** `max-w-max-width-driver mx-auto px-container-padding py-24`.
- **Header:** Tiêu đề H1 `Gia nhập đội ngũ` + Mô tả chào đón ứng viên.
- **Danh sách vị trí tuyển dụng (`.space-y-6`):**
  - Danh sách 3 thẻ công việc bo tròn (`bg-surface border border-outline-variant rounded-2xl p-6`):
    1. **Vị trí 1:** `Senior Frontend Engineer (React/Vite)`
       - Phòng ban: `Engineering` (Icon `work`).
       - Hình thức: `Full-time` (Icon `schedule`).
       - Địa điểm: `Hồ Chí Minh` (Icon `location_on`).
       - Nút: `Ứng tuyển`.
    2. **Vị trí 2:** `Backend Node.js Developer`
       - Phòng ban: `Engineering`, `Full-time`, Địa điểm: `Hà Nội`.
       - Nút: `Ứng tuyển`.
    3. **Vị trí 3:** `Sales Executive (B2B)`
       - Phòng ban: `Sales`, `Full-time`, Địa điểm: `Remote`.
       - Nút: `Ứng tuyển`.

---

## 4. INTERACTION SPECIFICATION

| Tên Phần Tử | Loại UI | Hành Động | Trạng Thái Hiện Tại | Đánh Giá Kỹ Thuật |
|---|---|---|---|---|
| **Nút "Ứng tuyển"** | Button | Click | **Chưa gắn Handler** (Không có `onClick`, không mở form hay mailto) | `PARTIALLY_IMPLEMENTED` / `UI_DEAD_END` |

---

## 5. BACKEND MAPPING & EVIDENCE

- **Backend API:** `NONE`.
- Mảng dữ liệu các vị trí tuyển dụng được khai báo trực tiếp trong component `CareersPage.tsx:12-16`.

---

## 6. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật / Nghiệp vụ | Khuyến nghị thiết kế lại |
|---|---|---|
| **Nút "Ứng tuyển" không có hành động** | Người dùng bấm "Ứng tuyển" nhưng không có gì xảy ra, gây thất vọng cho ứng viên. | Gắn liên kết `mailto:hr@smarttruck.vn?subject=Ứng tuyển vị trí [Tên vị trí]` hoặc mở Modal nộp CV tải tệp PDF kèm thông tin liên hệ. |
| **Bất hợp lý trong mô tả công nghệ (Tech Stack Mismatch)** | Vị trí ghi tuyển `Backend Node.js Developer` trong khi toàn bộ mã nguồn Backend của dự án thực tế là **Java Spring Boot 3.x / JPA / MySQL**. | Điều chỉnh lại tiêu đề công việc thành `Senior Backend Java / Spring Boot Engineer` cho đúng với tech stack thực tế của dự án. |

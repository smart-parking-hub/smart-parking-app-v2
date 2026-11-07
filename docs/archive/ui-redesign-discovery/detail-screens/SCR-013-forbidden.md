# Screen Specification: SCR-013 ForbiddenPage (Trang từ chối truy cập 403)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-013`
- **Screen Name:** Trang từ chối truy cập (Access Denied / Forbidden)
- **Module:** `MOD-02: Authentication & Access Management`
- **Route URL:** `/403`
- **Layout Type:** Standalone Centered Layout (Full viewport)
- **Primary Component:** `smart-parking-app/src/features/errors/pages/ForbiddenPage.tsx`
- **Sub-components:**
  - Ant Design `Result` (`status="403"`)
  - Ant Design `Button` (`type="primary"`)
- **Access Role:** Public / Any Role (Mọi người dùng bị chuyển hướng khi không thỏa mãn điều kiện phân quyền)
- **Discovery Status:** `VERIFIED` (Source code Frontend & Route Guards đã được đối chiếu toàn diện)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp màn hình thông báo rõ ràng, thân thiện và hướng dẫn hành động khi người dùng cố gắng truy cập vào tài nguyên hoặc không gian làm việc mà tài khoản của họ không có quyền hạn tương ứng:
- Ngăn chặn người dùng bối rối hoặc tưởng hệ thống bị treo khi bị chặn truy cập.
- Cung cấp nút điều hướng thông minh tự động đưa người dùng quay trở lại không gian làm việc chính xác theo vai trò hiện tại của họ (`DRIVER` -> `/dashboard`, `MERCHANT` -> `/merchant/dashboard`, `ADMIN` -> `/admin/dashboard`) hoặc đưa về trang `/login` nếu phiên đăng nhập không tồn tại.

### B. Target Users
- Bất kỳ người dùng nào đang đăng nhập nhưng cố gắng truy cập URL thuộc quyền của vai trò khác (ví dụ: Tài xế gõ tay URL `/merchant/dashboard`, hoặc Chủ bãi gõ URL `/admin/users`).
- Người dùng chưa đăng nhập cố tình truy cập trực tiếp route `/403`.

### C. Entry Points
- Tự động chuyển hướng từ Route Guard: `smart-parking-app/src/app/routes/ProtectedRoute.tsx:19-21`:
  ```tsx
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return <Navigate to="/403" replace state={{ from: location.pathname }} />
  }
  ```
- Chuyển hướng khi Backend trả về mã lỗi HTTP 403 Access Denied từ các API được bảo vệ bởi `@PreAuthorize` hoặc `SecurityConfig`.
- Truy cập trực tiếp qua thanh địa chỉ: `/403`.

### D. Exit Points
- Nút bấm *"Về trang phù hợp"*:
  - Nếu `session` tồn tại: Điều hướng đến `getRoleHomePath(session.role)` (`replace: true`).
    - `DRIVER` -> `/dashboard`
    - `MERCHANT` -> `/merchant/dashboard`
    - `ADMIN` -> `/admin/dashboard`
  - Nếu không có `session`: Điều hướng về `/login` (`replace: true`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Layout Structure
- Giao diện tối giản căn giữa toàn màn hình (flex items-center justify-center min-h-screen bg-slate-50).
- Không có Sidebar, không có Header/Navbar, không có Footer phân tán sự chú ý.

### B. Thành phần giao diện (`Ant Design Result`)
- **Icon / Minh họa:** Hình minh họa vector chuẩn 403 của Ant Design (Biển báo cấm / Khóa bảo mật).
- **Tiêu đề chính (`title`):** `403` (Typography kích thước lớn, màu xám đậm).
- **Phụ đề (`subTitle`):** `Bạn không có quyền truy cập khu vực này.`
- **Khu vực hành động (`extra`):**
  - Primary Button: `Về trang phù hợp` (Nút bấm màu chủ đạo Teal `#0f766e`).

---

## 4. INTERACTION SPECIFICATION

| Action | Trigger | Precondition | UI Processing | API Call | Result / Success | Error Handling |
|---|---|---|---|---|---|---|
| **Về trang phù hợp** | Click button "Về trang phù hợp" | Người dùng đang ở màn hình 403 | 1. Đọc session từ `getAuthSession()`<br>2. Xác định `homePath = session ? getRoleHomePath(session.role) : '/login'`<br>3. Gọi `navigate(homePath, { replace: true })` | Không gọi API | Trình duyệt điều hướng về đúng trang chủ của vai trò hoặc về trang đăng nhập | N/A |

---

## 5. DATA SPECIFICATION

| Tên Field / Biến | Kiểu Dữ Liệu | Mục Đích | Nguồn Dữ Liệu | Giá Trị Tiêu Biểu |
|---|---|---|---|---|
| `session` | `AuthSession \| null` | Kiểm tra trạng thái đăng nhập hiện thời | `localStorage['smart-truck-parking.auth']` | `{ token: "...", role: "DRIVER", phone: "0901234567" }` |
| `home` | String (URL path) | Đường dẫn đích để đưa người dùng quay lại | Tính toán từ `roleHomePaths` | `"/dashboard"`, `"/merchant/dashboard"`, `"/admin/dashboard"`, `"/login"` |
| `state.from` | String (URL path) | Lưu trữ URL bị từ chối trước đó (từ Router State) | React Router `useLocation().state` | Ví dụ: `"/admin/users"` |

---

## 6. UI STATES & EDGE CASES

- **Trạng thái Người dùng Driver:** Đang đăng nhập tài xế, lỡ tay bấm hoặc gõ URL `/admin/dashboard` -> Chuyển về `/403` -> Bấm nút -> Quay về `/dashboard`.
- **Trạng thái Người dùng Merchant:** Đang đăng nhập chủ bãi, cố truy cập `/admin/users` -> Chuyển về `/403` -> Bấm nút -> Quay về `/merchant/dashboard`.
- **Trạng thái Người dùng Admin:** Đang đăng nhập quản trị viên, bấm nhầm URL tài xế `/booking` -> Chuyển về `/403` -> Bấm nút -> Quay về `/admin/dashboard`.
- **Trạng thái Khách vãng lai:** Chưa đăng nhập nhưng gõ thẳng `/403` vào URL -> Bấm nút -> Chuyển hướng về `/login`.
- **Trạng thái Token bị hết hạn / Session lỗi:** `getAuthSession()` trả về `null` -> Bấm nút -> Chuyển về `/login`.

---

## 7. BACKEND MAPPING & EVIDENCE

### A. Route Guard & Filter Integration
- **Frontend Guard:** `smart-parking-app/src/app/routes/ProtectedRoute.tsx:19-21`.
  - Phân quyền theo mảng `allowedRoles: ['DRIVER']`, `['MERCHANT']`, hoặc `['ADMIN']`.
- **Backend Access Denied Handler:** `smart-parking-service/src/main/java/com/backend/security/JwtAccessDeniedHandler.java`.
  - Trả về mã lỗi HTTP 403 Forbidden nếu người dùng có JWT hợp lệ nhưng không sở hữu Role được cấp phép bởi Spring Security:
    ```java
    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    response.getWriter().write("{\"status\":403,\"message\":\"Không có quyền truy cập.\",\"data\":null}");
    ```
- **Security Configuration Rules:** `smart-parking-service/src/main/java/com/backend/security/SecurityConfig.java:65-66`:
  - `.requestMatchers("/api/v1/merchant/**").hasRole("MERCHANT")`
  - `.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")`

---

## 8. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá UX / Kỹ thuật | Khuyến nghị thiết kế lại |
|---|---|---|
| **Giao diện quá đơn giản, thiếu ngữ cảnh** | Chỉ hiển thị thông điệp chung chung *"Bạn không có quyền truy cập khu vực này."*, người dùng không biết mình vừa cố vào trang nào và tại sao bị chặn. | Hiển thị thêm thông tin: *"Bạn đang đăng nhập với vai trò [Tài xế/Chủ bãi]. Trang này chỉ dành cho [Quản trị viên]."* kèm nút *"Đổi tài khoản khác"* (Logout) và nút *"Quay lại trang trước"*. |
| **Không tận dụng `state.from`** | `ProtectedRoute.tsx` có truyền `{ state: { from: location.pathname } }` khi điều hướng đến `/403`, nhưng `ForbiddenPage.tsx` hoàn toàn không đọc biến này. | Đọc `location.state?.from` để thông báo rõ ràng cho người dùng trang cụ thể mà họ vừa bị từ chối truy cập. |
| **Thiếu nút Đăng xuất trực tiếp** | Nếu người dùng có nhiều tài khoản (ví dụ vừa là Merchant vừa là Admin) và muốn chuyển đổi tài khoản ngay tại trang này thì bắt buộc phải quay về trang chủ rồi mới tìm nút đăng xuất. | Bổ sung nút *"Đăng nhập tài khoản khác"* (gọi `clearAuthSession()` và đưa về `/login`). |

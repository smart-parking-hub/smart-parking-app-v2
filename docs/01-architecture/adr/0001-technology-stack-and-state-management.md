# ADR-0001: Technology Baseline, State Separation and Quality-First Evaluation Protocol

- Status: Accepted
- Date: 2026-11-03
- Decision owner: Architecture Team & Project Maintainers
- Related tasks: Deliverable A (Governance & Knowledge Baseline), Stitch Intake Setup

---

## 1. Context
Hệ thống Frontend CRM Smart Parking Hub v2 được xây dựng để thay thế dần frontend cũ với quy mô nhiều module phức tạp (Quản lý bãi đỗ, Lượt đặt chỗ, Doanh thu, Cấu hình giá, Phân quyền người dùng, Giám sát trạng thái slot realtime).
Thực tế từ các dự án CRM quy mô lớn cho thấy:
1. Việc lạm dụng Redux để lưu trữ toàn bộ dữ liệu phản hồi từ API dẫn đến mã nguồn bị phình to (boilerplate), bất đồng bộ dữ liệu (stale state) và khó quản lý trạng thái loading/error.
2. Việc cài đặt bừa bãi hàng chục thư viện `npm` ngay từ ngày đầu làm tăng bundle size, gây xung đột phiên bản với React 19 / Tailwind v4, và làm giảm chất lượng kiểm thử.
3. Dự án cần một baseline công nghệ rõ ràng, phân định mạch lạc 3 loại state và một cơ chế thẩm định chất lượng nghiêm ngặt trước khi thêm bất kỳ dependency nào.

---

## 2. Decision

### 2.1. Phê duyệt Core Technology Stack cho CRM:
- **Application Core:** React 19 + Vite + TypeScript (strict mode) + Tailwind CSS v4.
- **Routing:** React Router (hỗ trợ nested layouts và centralized route guards).
- **Server State & Caching:** TanStack Query v5 (đảm nhiệm 100% dữ liệu bất đồng bộ từ backend).
- **Global UI State:** Redux Toolkit (chỉ sử dụng cho trạng thái giao diện toàn cục cần chia sẻ liên module).
- **HTTP Client:** Axios (cấu hình interceptor tập trung cho JWT refresh và internal headers).
- **Form & Validation:** React Hook Form + Zod (type-safe validation, tối ưu re-render).
- **UI Primitives & Design System:** shadcn/ui + Radix UI headless primitives + Lucide React.
- **Data Table:** TanStack Table v8 (phân trang server-side, multi-column sort/filter).
- **Date/Time & i18n:** date-fns (hỗ trợ múi giờ Việt Nam), i18next (khi có yêu cầu đa ngữ).

### 2.2. Phê duyệt Quality & Testing Stack:
- **Unit Testing:** Vitest (kiểm thử hàm thuần túy, mappers, formatters, utilities).
- **Component Testing:** React Testing Library (kiểm thử hành vi người dùng, a11y, state transitions).
- **API Mocking:** MSW (Mock Service Worker) chặn ở network layer.
- **E2E Testing:** Playwright (kiểm thử các luồng nghiệp vụ quan trọng).
- **Code Quality:** ESLint + Prettier.
- **Documentation & Observability:** Storybook (catalog components), Sentry (error tracking trên staging/production sau khi review bảo mật).

### 2.3. Quy định bất biến về Phân Tách 3 Loại State:
1. **Dữ liệu từ Backend:** Bắt buộc dùng **TanStack Query**. Nghiêm cấm lưu API responses vào Redux.
2. **Trạng thái UI toàn cục:** Dùng **Redux Toolkit** nếu thực sự cần chia sẻ trạng thái giữa các feature độc lập (ví dụ sidebar collapsed state, active tenant/workspace).
3. **Trạng thái riêng của Form:** Dùng **React Hook Form + Zod**.

### 2.4. Nguyên tắc "Quality-First & Just-in-Time Evaluation":
- Không cài đặt sẵn các thư viện bổ sung (OpenAPI/Orval, TanStack Virtual, Recharts, FullCalendar, TipTap, Socket.IO Client).
- Khi triển khai màn hình/tính năng cụ thể, Agent và Kỹ sư phải thực hiện đánh giá theo **5 Tiêu Chí Vàng** (Tính cần thiết, Chi phí bundle size, Tính tương thích React 19/Tailwind v4, Hỗ trợ Testing/a11y, Tính bảo trì dài hạn).
- Nếu không chứng minh được tính tối ưu và chất lượng vượt trội -> **TUYỆT ĐỐI KHÔNG THÊM**.

---

## 3. Alternatives Considered
1. **Dùng Redux Toolkit cho tất cả (Server State + Client State + Form State):**
   - *Bị loại bỏ:* Gây boilerplate khổng lồ, logic invalidation cache phức tạp, lỗi thời so với chuẩn mực React hiện đại.
2. **Chỉ dùng React Context API cho toàn bộ ứng dụng:**
   - *Bị loại bỏ:* Gây hiện tượng re-render diện rộng khi state thay đổi, thiếu caching thông minh và devtools chuyên sâu của TanStack Query và Redux DevTools.
3. **Cài đặt trước toàn bộ thư viện mở rộng (Chart, Calendar, Virtual scroll):**
   - *Bị loại bỏ:* Vi phạm nguyên tắc YAGNI (You Aren't Gonna Need It), làm phình bundle size của ứng dụng ngay từ vạch xuất phát.

---

## 4. Consequences
- **Tích cực:**
  - Kiến trúc phân lớp cực kỳ trong sáng, dễ mở rộng quy mô lên hàng chục module mà không bị xung đột.
  - Tối ưu hiệu năng render của React, giảm thiểu tối đa các re-render vô ích.
  - Type-safe 100% từ API, Form đến Component nhờ Zod và TypeScript strict mode.
  - Chất lượng mã nguồn luôn ở mức cao nhất do có bộ lọc đánh giá trước khi cài dependency.
- **Ràng buộc:**
  - Developer và AI Agent phải tuân thủ nghiêm ngặt ranh giới giữa 3 loại state; không được tiện tay đưa dữ liệu vào sai nơi.
  - Mỗi đề xuất thêm thư viện mới phải được giải trình rõ ràng qua Task Report hoặc ADR.

---

## 5. References
- Kho lưu trữ công nghệ: [`docs/01-architecture/technology-catalog.md`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/docs/01-architecture/technology-catalog.md)
- Kiến trúc mục tiêu: [`docs/01-architecture/target-architecture.md`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/docs/01-architecture/target-architecture.md)

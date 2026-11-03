# Testing Strategy & Quality Assurance Baseline

> Scope: `smart-parking-app-v2`  
> Baseline Architecture: [ADR-0001](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/docs/01-architecture/adr/0001-technology-stack-and-state-management.md)

---

## 1. Quality & Testing Stack

| Công nghệ | Vai trò & Mục tiêu kiểm thử | Phạm vi áp dụng |
|---|---|---|
| **Vitest** | Unit test runner tốc độ cao | Kiểm thử pure functions, mappers, formatters, validation utilities, custom hooks |
| **React Testing Library** | Component & Interaction testing | Kiểm thử hành vi người dùng, render UI theo state (loading, error, empty, success), form interaction |
| **Playwright** | End-to-End (E2E) testing | Kiểm thử luồng nghiệp vụ quan trọng xuyên suốt từ giao diện đến backend |
| **MSW (Mock Service Worker)** | Network-level API mocking | Giả lập response API tại tầng network, loại bỏ phụ thuộc backend thật trong integration test |
| **ESLint** | Static code analysis | Bắt lỗi cú pháp, thực thi ranh giới phụ thuộc 4 lớp, ngăn chặn memory leaks |
| **Prettier** | Code formatting | Đồng nhất chuẩn định dạng mã nguồn |
| **Storybook** | Component catalog & visual isolation | Xây dựng và kiểm thử độc lập các UI primitives (shadcn/ui) không cần backend |
| **Sentry** | Frontend error monitoring | Bắt exception và giám sát trải nghiệm người dùng thực tế trên staging/production |

---

## 2. Test Execution Tiers

- **Unit:** Pure functions, calculations (phí gửi xe, thời gian đỗ), mappers, custom hooks.
- **Component:** Form components, tables, dialogs, button actions, permission gates, UI states.
- **Integration:** Feature workflows kết hợp TanStack Query và MSW giả lập các kịch bản thành công/thất bại.
- **E2E:** Playwright cho luồng đăng nhập, đặt chỗ, thanh toán, duyệt bãi xe.
- **Visual & a11y:** So sánh giao diện với mockup Stitch, kiểm tra phím Tab/Enter và ARIA labels.

> **Nguyên tắc chất lượng:** Kiểm thử theo rủi ro thực tế (risk-based testing), không chạy theo phần trăm coverage hình thức. Một bài test có giá trị phải chứng minh được tính đúng đắn của nghiệp vụ.

# Target Frontend Architecture

## Status
Approved Baseline & Architecture Constitution. Reference: [ADR-0001](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/docs/01-architecture/adr/0001-technology-stack-and-state-management.md) and [Technology Catalog](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/docs/01-architecture/technology-catalog.md).

---

## 1. Stack Khuyên Dùng Cho CRM Phân Hệ Lớn

### Core Application Stack
- **Framework & Build:** React 19 + Vite + TypeScript (strict mode)
- **Styling & Design System:** Tailwind CSS v4 + shadcn/ui (Radix UI headless primitives) + Lucide React
- **Routing:** React Router (nested layouts, route-level authorization guards)
- **Server State & Caching:** TanStack Query v5 (quản lý 100% dữ liệu API bất đồng bộ)
- **Global Client/UI State:** Redux Toolkit (chỉ cho trạng thái UI toàn cục cần chia sẻ liên module)
- **HTTP Client:** Axios (interceptor tập trung cho JWT token refresh và error handling)
- **Form & Validation:** React Hook Form + Zod (tối ưu re-render, type-safe validation)
- **Data Tables:** TanStack Table v8 (phân trang server-side, sort, filter, column pinning)
- **Date/Time:** date-fns (hỗ trợ múi giờ Việt Nam `Asia/Ho_Chi_Minh`)
- **i18n:** i18next / react-i18next (khi có yêu cầu nghiệp vụ đa ngôn ngữ)

### Quality & Testing Stack
- **Unit Testing:** Vitest (pure functions, utilities, formatters, custom hooks)
- **Component Testing:** React Testing Library (user-centric interaction tests)
- **API Mocking:** MSW (Mock Service Worker)
- **E2E Testing:** Playwright (bắt buộc cho các luồng nghiệp vụ quan trọng)
- **Code Quality:** ESLint + Prettier
- **Documentation:** Storybook (catalog component độc lập)
- **Observability:** Sentry (frontend error monitoring sau khi review bảo mật)

---

## 2. Ranh Giới 3 Loại Dữ Liệu (Bất Biến)

| Loại dữ liệu | Bản chất | Công nghệ đảm nhiệm | Ví dụ |
|---|---|---|---|
| **Dữ liệu lấy từ Backend** | Bất đồng bộ, thuộc sở hữu server, cần cache và revalidate | **TanStack Query** | Danh sách nhân viên, bãi xe, booking, doanh thu |
| **Trạng thái UI toàn cục** | Đồng bộ, thuộc trải nghiệm client, cần chia sẻ liên module | **Redux Toolkit** | Thu gọn menu, phiên đăng nhập, bộ lọc toàn cục |
| **Trạng thái riêng của Form** | Tạm thời, cục bộ trong vòng đời form, cần validate tức thì | **React Hook Form + Zod** | Form tạo nhân viên, cấu hình giá bãi xe |

> [!CAUTION]
> **Cấm tiệt:** Không đưa API response vào Redux. Không sao chép cache server sang client store.

---

## 3. Công Nghệ Bổ Sung Đáng Cân Nhắc (On-Demand Evaluation Radar)

Chỉ bổ sung khi phân hệ nghiệp vụ cụ thể đòi hỏi và vượt qua đánh giá tối ưu:
- **OpenAPI / Orval:** Sinh API client và TypeScript types khi backend OpenAPI ổn định.
- **TanStack Virtual:** Virtual scrolling khi bảng dữ liệu CRM vượt quá 100 dòng render đồng thời.
- **Recharts:** Hiển thị biểu đồ thống kê cho Dashboard / Báo cáo tài chính.
- **FullCalendar:** Giao diện lịch đặt ca trực hoặc lịch đăng ký đỗ xe dài hạn.
- **TipTap:** Rich text editor khi cần soạn thảo nội dung thông báo, điều khoản.
- **Socket.IO Client / STOMP:** Realtime updates khi backend hỗ trợ websocket event stream.
- **Playwright:** E2E cho luồng thanh toán, đặt chỗ và đăng nhập.

---

## 4. Source Layout (4-Layer Target Architecture)
```
src/
  app/          # bootstrap, providers, router, global store configuration
  layouts/      # structural application shells (CRM layout, Auth layout)
  features/     # business capabilities (parking-lots, bookings, payments, users)
  entities/     # genuinely shared domain concepts (user profile, parking slot status)
  shared/       # domain-agnostic UI (shadcn), API client, hooks, utilities
  styles/       # global CSS and Tailwind v4 theme tokens
  assets/       # static icons, logos, illustrations
```

### Feature Layout
```
features/<feature>/
  api/          # TanStack Query queries, mutations, API calls
  components/   # Feature-specific components
  hooks/        # Feature-specific custom hooks
  pages/        # Screen-level route components
  schemas/      # Zod validation schemas
  types/        # Feature TypeScript interfaces
  utils/        # Business helper functions
  routes.tsx    # Feature sub-routes
  index.ts      # Public export boundary
```

---

## 5. Nguyên Tắc "Quality-First & Just-in-Time Evaluation"
- **Không cài đặt tất cả ngay từ đầu.**
- Trước khi thêm bất kỳ thư viện nào, phải đối chiếu 5 câu hỏi vàng tại [`docs/01-architecture/technology-catalog.md`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/docs/01-architecture/technology-catalog.md).
- Nếu không chứng minh được tính cần thiết và chất lượng vượt trội -> **KHỎI THÊM, ĐẶT CHẤT LƯỢNG LÊN HÀNG ĐẦU**.

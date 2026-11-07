# 00. PROJECT INVENTORY — SMART PARKING HUB CRM V2

> **Giai đoạn:** DISCOVERY & INVENTORY AUDIT  
> **Phiên bản tài liệu:** 1.0 · **Thời gian khảo sát:** 06/11/2026  
> **Phạm vi khảo sát:** Toàn bộ cấu trúc thư mục, tệp tin cấu hình, kiến trúc mã nguồn và thư viện phụ thuộc của `smart-parking-app-v2`.  
> **Nguyên tắc:** KHÔNG sửa mã nguồn, KHÔNG refactor, KHÔNG thay đổi logic nghiệp vụ. Chỉ ghi nhận hiện trạng có bằng chứng.

---

## 1. THÔNG TIN DỰ ÁN & HỆ THỐNG CÔNG NGHỆ (TECH STACK)

### 1.1. Package & Công nghệ chủ đạo (`package.json`)
- **Core Framework:** React 19.0.0 (`react`, `react-dom`)
- **Build Tool & Bundler:** Vite 6.2.0 (`@vitejs/plugin-react` v4.3.4)
- **Language & Type System:** TypeScript 5.7.3 (`tsconfig.app.json`, `tsconfig.node.json`, strict mode enabled)
- **Styling Architecture:** Tailwind CSS v4.3.4 (`tailwindcss`, `@tailwindcss/vite`)
- **Server State Management:** TanStack Query v5.67.1 (`@tanstack/react-query`)
- **Global Client State:** Redux Toolkit v2.6.1 (`@reduxjs/toolkit`, `react-redux` v9.2.0)
- **Form Handling & Validation:** React Hook Form v7.54.2 (`react-hook-form`), Zod v3.24.2 (`zod`), `@hookform/resolvers` v3.10.0
- **Routing:** React Router DOM v7.3.0 (`react-router-dom`)
- **Icons:** Lucide React v1.16.0 (`lucide-react`)
- **Data Table Engine:** TanStack Table v8.21.2 (`@tanstack/react-table`)
- **HTTP Client:** Axios v1.8.2 (`axios`)
- **Interactive Maps:** Leaflet v1.9.4 (`leaflet`, `@types/leaflet` v1.9.21)
- **Date Utilities:** Date-fns v4.1.0 (`date-fns`)
- **Utility Libraries:** `clsx` v2.1.1, `tailwind-merge` v3.0.2

### 1.2. Công cụ kiểm thử & Đảm bảo chất lượng (Quality Gates)
- **Unit & Component Testing:** Vitest v3.0.7 (`vitest`), Testing Library React v16.2.0, `@testing-library/jest-dom` v6.6.3, `jsdom` v26.0.0
- **Linting & Code Formatting:** ESLint v9.21.0 (`@eslint/js`, `typescript-eslint` v8.72.1, `eslint-plugin-react-hooks` v5.2.0)
- **E2E Testing:** Playwright v1.64.1 (`@playwright/test`)

### 1.3. Cấu hình môi trường & Proxy mạng
- **`vite.config.ts`:**
  - Cổng phát triển: `3000`.
  - Path alias: `@` trỏ trực tiếp đến `./src`.
  - Reverse Proxy: Mọi request bắt đầu bằng `/api` được chuyển tiếp tự động đến Gateway backend `http://localhost:8088`.
  - Tách vendor chunk tối ưu: `react-vendor` gom cụm `react`, `react-dom`, `scheduler` (khoảng 223 kB / gzip 69 kB).
- **`.env.example`:**
  - `VITE_API_BASE_URL=http://localhost:8088`
  - `VITE_APP_ENV=development`
  - `VITE_OSM_TILE_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png`

---

## 2. KHẢO SÁT CHI TIẾT CẤU TRÚC THƯ MỤC `src/`

Cấu trúc mã nguồn tuân theo kiến trúc 4 lớp phân tầng (Layered Architecture):

```
smart-parking-app-v2/src/
├── app/                  # Application bootstrap, routing, store, providers
│   ├── pages/            # Scaffold / Overview & Dev-only pages
│   ├── providers/        # Context & Query providers, AuthSession sync
│   ├── router/           # react-router tree configuration (659 lines)
│   ├── store/            # Redux store & slices
│   ├── App.tsx           # Top-level application component
│   └── main.tsx          # DOM root mount
├── entities/             # Shared domain data models & contracts
│   ├── driver/           # Driver domain types
│   ├── owner/            # Merchant / Yard owner domain components & types
│   ├── parking-lot/      # ParkingLot domain components & types
│   └── operations.ts     # Core DTO interfaces (VehicleType, Lot, Booking, Slot, Pricing...)
├── features/             # 20 Business Feature Modules
│   ├── admin/            # Admin Command Center operations (3 files)
│   ├── auth/             # Login, register, forgot-password, OTP, guards (8 files)
│   ├── bookings/         # Driver bookings & QR e-tickets (24 files)
│   ├── change-password/  # Driver password management (12 files)
│   ├── copilot/          # AI Parking Assistant Widget (1 file)
│   ├── dashboard/        # Driver Dashboard re-exports (12 files)
│   ├── disputes/         # Tripartite Dispute Workbench (1 file)
│   ├── driver/           # Driver Dashboard implementation (15 files)
│   ├── landing/          # Public marketing & solution pages (77 files)
│   ├── merchant/         # Merchant operations, yards, slots, revenue (97 files)
│   ├── notifications/    # Driver notification center (14 files)
│   ├── parking-detail/   # Lot details & reservation flow (19 files)
│   ├── parking-search/   # Map search & filters with Leaflet (17 files)
│   ├── payment-cancel/   # PayOS cancellation callback handling (13 files)
│   ├── payment-return/   # PayOS success callback & verification (14 files)
│   ├── payments/         # Driver payment history & VAT invoices (15 files)
│   ├── portal/           # Shared portal notifications & profile (1 file)
│   ├── profile/          # Driver profile & emergency contacts (12 files)
│   ├── queues/           # Virtual Queues management (13 files)
│   └── vehicles/         # Driver vehicle management & ALPR (18 files)
├── layouts/              # Structural shells
│   ├── driver/           # DriverHeader, DriverFooter
│   ├── merchant/         # MerchantSidebar, MerchantHeader
│   ├── AdminLayout.tsx   # Admin Command Center Shell with fixed aside
│   ├── AuthLayout.tsx    # Split-screen Auth Layout
│   ├── DriverLayout.tsx  # Driver Shell with responsive top bar & Copilot
│   ├── LandingLayout.tsx # Public Navigation Shell with LandingNavbar/Footer
│   ├── MerchantLayout.tsx# Merchant Shell with fixed 260px sidebar
│   └── RootLayout.tsx    # Legacy scaffold shell (for /crm)
├── shared/               # Domain-agnostic UI components, API clients, utilities
│   ├── api/              # Axios instance (client.ts), generic methods (resources.ts)
│   ├── components/       # Reusable UI widgets & Workspace primitives
│   └── utils/            # cn.ts helper (clsx + tailwind-merge)
├── styles/               # Global CSS & Design Tokens
│   ├── fonts.css         # Local / Web font declarations (Sora, Inter)
│   └── globals.css       # Tailwind v4 @theme, custom utilities, leaflet styling
└── test/                 # Test setup & mock harness (setup.ts)
```

---

## 3. KHẢO SÁT TRẠNG THÁI KIỂM ĐỊNH KỸ THUẬT THỰC TẾ

Kết quả chạy thực tế tại thời điểm khảo sát:

1. **Kiểm tra TypeScript (`npm run typecheck` / `tsc --noEmit`):**
   - Trạng thái: **THÀNH CÔNG (Exit Code 0)**.
   - Không có bất kỳ lỗi cú pháp hay thiếu kiểu dữ liệu nào.

2. **Kiểm tra ESLint (`npm run lint` / `eslint .`):**
   - Trạng thái: **THÀNH CÔNG (Exit Code 0)**.
   - 0 lỗi, 0 cảnh báo.

3. **Kiểm tra Unit/Component Test Suite (`npm run test` / `vitest run`):**
   - Trạng thái: **35/35 Test Files PASS (100%), 245/245 Tests PASS (100%)**.
   - Thời gian thực thi: ~75 giây.
   - Các bộ test kiểm tra kỹ lưỡng:
     - Luồng xác thực đăng nhập (`SCR-010`), kiểm tra hết hạn token, phân quyền vai trò.
     - Luồng thanh toán PayOS (`SCR-023`).
     - Luồng cấu hình sức chứa 5 nhóm xe (`SCR-032`).
     - Hợp đồng trạm Barie ALPR, quét QR vào/ra, xác nhận tiền mặt có chủ đích.
     - Luồng tìm kiếm bản đồ OpenStreetMap & phân bổ bán kính.

4. **Kiểm tra Production Build (`npm run build` / `tsc -b && vite build`):**
   - Trạng thái: **THÀNH CÔNG (Exit Code 0)**.
   - Thời gian biên dịch: 13.26 giây.
   - Dung lượng output chính: `dist/index.html` (1.23 kB), `dist/assets/react-vendor.js` (223 kB / gzip 69 kB). Không có cảnh báo dung lượng chunk vượt ngưỡng (> 500 kB).

---

## 4. TỔNG HỢP CÁC PHÁT HIỆN KIẾN TRÚC BAN ĐẦU

1. **Mô hình triển khai 2 phong cách (Dual UI Paradigm):**
   - *Nhóm Stitch Screens:* Các màn hình như `DriverDashboardPage`, `MerchantDashboardPage`, `SearchParkingPage`, `MyBookingsPage` được chuyển thể từ HTML/CSS của Stitch, chứa rất nhiều component bento đặc thù, bảng manifest riêng và các mã màu hardcode (`#d95f00`, `#f8f9ff`, `#131b2e`).
   - *Nhóm Workspace Screens:* Các màn hình như `AdminDashboardPage`, `AdminUsersPage`, `MerchantBookingsPage`, `MerchantLotPage`, `DisputesPage` được xây dựng dựa trên primitive dùng chung `Workspace.tsx` (`Workspace`, `Panel`, `DataTable`, `Badge`, `Metrics`), cấu trúc rất tinh gọn, đồng bộ nhưng đơn điệu hơn về mặt trực quan.

2. **Hai triển khai độc lập của các UI Component cơ bản:**
   - Đang tồn tại song song 2 phiên bản của `Button` (`Button.tsx` vs `button` class trong `Workspace.tsx`).
   - Đang tồn tại song song 2 phiên bản của `Badge` (`Badge.tsx` dựa trên variant vs `Badge` trong `Workspace.tsx` dựa trên regex status).
   - Đang tồn tại song song 2 phiên bản của `Modal` (`Modal.tsx` dựa trên custom overlay vs `Dialog` trong `Workspace.tsx` dựa trên HTML5 `<dialog>`).

3. **Cơ chế lưu trữ trạng thái (State Separation):**
   - Đa số tính năng tuân thủ nghiêm ngặt **TanStack Query** cho server state và **Zustand / Redux** cho UI state.
   - Riêng `VehiclesPage` vẫn sử dụng `useState` và `useEffect` tự quản lý vòng đời nạp dữ liệu server thay vì TanStack Query.

# Workflow Phase 2: Adaptive React & Tailwind v4 Implementation

Trong quá trình chuyển đổi mã Stitch sang React Component, Agent phải tuân thủ nghiêm ngặt các quy tắc kỹ thuật sau:

---

## 1. Tuân thủ kiến trúc 4 lớp của Frontend CRM
- **Lớp 1: Page Component** (`src/features/<feature>/pages/<Screen>Page.tsx`) — Đóng vai trò orchestrator, kết nối TanStack Query, điều phối modal và breadcrumbs.
- **Lớp 2: Feature Components** (`src/features/<feature>/components/*`) — Các khối chức năng đặc thù của màn hình.
- **Lớp 3: Shared UI & Layouts** (`src/shared/components/*`) — Nút bấm, Table, Badge, Modal dùng chung toàn hệ thống.
- **Lớp 4: Data & API Hooks** (`src/features/<feature>/api/*`, `hooks/*`) — Tách biệt hoàn toàn logic gọi Axios/TanStack Query khỏi giao diện.

---

## 2. Quy tắc chuyển đổi Tailwind CSS v4 chuẩn hóa (Canonical Rules)
- **Áp dụng scale chuẩn 4px:**
  - Kích thước `1240px` $\rightarrow$ `max-w-310`.
  - Kích thước `580px` $\rightarrow$ `w-145`, `h-145`.
  - Kích thước `420px` $\rightarrow$ `w-105`, `h-105`.
  - Kích thước `380px` $\rightarrow$ `h-95`.
  - Kích thước `440px` $\rightarrow$ `h-110`.
- **Áp dụng chuẩn Gradients v4:**
  - Linear gradient: `bg-linear-to-t`, `bg-linear-to-r` (thay vì cú pháp v3 `bg-gradient-to-*`).
  - Radial gradient: `bg-radial-[at_top]` hoặc `bg-radial` (thay vì cú pháp v3 `bg-[radial-gradient(...)]`).
- **Không để sót bất kỳ warning `suggestCanonicalClasses` nào.**

---

## 3. Quy chuẩn xử lý Icon & Images
- **Icon:** Dùng 100% component SVG từ `lucide-react`, luôn kèm `aria-hidden="true"` (trừ khi có `aria-label` riêng cho nút bấm).
- **Hero Image / Above-the-fold:** Bổ sung `fetchPriority="high"` và `loading="eager"`.
- **Card Images / Below-the-fold:** Bổ sung `loading="lazy"`.
- **Danh sách lặp (.map):** Bắt buộc dùng `key` định danh duy nhất (id, code, slug), tuyệt đối không dùng index mảng (`key={i}`).

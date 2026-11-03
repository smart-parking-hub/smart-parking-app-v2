# Design Decision Records (DDR) Repository

Thư mục này lưu trữ toàn bộ các Quyết định Thiết kế quan trọng (Design Decision Records) được ghi nhận bởi Agent và Tech Lead trong quá trình phát triển `smart-parking-app-v2`.

## Nguyên tắc:
1. Mọi quyết định thay đổi layout lớn, chuẩn hóa token, hoặc thích nghi UX đều phải được ghi nhận tại đây.
2. Trước khi Agent bắt đầu một màn hình mới, Agent **bắt buộc phải đọc các DDR đã có** để kế thừa và áp dụng đồng nhất cho toàn hệ thống.

## Danh mục quyết định:
| Mã DDR | Màn hình | Thành phần | Trạng thái | Ngày | Tóm tắt |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`DDR-001`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/.agents/records/design-decisions/DDR-001-landing-canonical-tailwind-and-icons.md) | Landing Page | Icons & Tailwind v4 scale | Approved | 2026-11-03 | Chuyển đổi toàn bộ icon sang `lucide-react` và chuẩn hóa arbitrary values sang canonical scale v4 (`max-w-310`, `w-145`, `bg-linear-to-*`, `bg-radial-*`). |

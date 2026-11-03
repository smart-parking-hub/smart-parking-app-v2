# Agent Autonomy Policy (Balanced Model)

Mô hình tự chủ của Agent được thiết lập ở mức **Balanced**: Trao quyền tự xử lý tối đa các vấn đề kỹ thuật để giữ tốc độ phát triển, nhưng thiết lập **hàng rào thép (Iron Gates)** không cho phép tự ý thay đổi nghiệp vụ, phân quyền hoặc trải nghiệm cốt lõi.

```
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 1: AUTONOMOUS (Tự xử lý hoàn toàn)                    │
│ • Sửa lỗi CSS layout, overflow, flex-wrap                   │
│ • Chuẩn hóa Tailwind v4 canonical scale                     │
│ • Tinh chỉnh Spacing (gap, padding, margin) trong hệ số 4px │
│ • Sửa kích thước/căn chỉnh Icon                             │
│ • Bổ sung semantic tags & attributes a11y (aria, role)      │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 2: PROPOSE & CONTINUE SAFE (Đề xuất & Cô lập an toàn) │
│ • Chuyển đổi Navigation sang More Dropdown khi quá nhiều mục│
│ • Thay đổi bố cục sắp xếp bộ lọc nâng cao                   │
│ • Chia Form 1 trang quá dài thành Multi-step Wizard         │
│ • Chuyển đổi Bảng dữ liệu sang Dạng Thẻ trên Mobile         │
│ • Đổi vị trí hoặc phong cách nút bấm quan trọng             │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 3: RESTRICTED (Tuyệt đối KHÔNG tự ý thay đổi)         │
│ ❌ Xóa bỏ bất kỳ chức năng hoặc nút hành động nghiệp vụ     │
│ ❌ Thay đổi điều kiện phân quyền (RBAC) theo Role/User       │
│ ❌ Bỏ qua hoặc sửa đổi quy tắc validation nghiệp vụ          │
│ ❌ Bỏ qua phân trang (Pagination) của API server            │
│ ❌ Thay đổi API contracts hoặc cấu trúc DTO                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Chi tiết Level 1 – Autonomous (Tự chủ kỹ thuật)
Agent được phép tự động triển khai và hoàn thiện mã mà không cần chờ người dùng phê duyệt khi:
- Sửa các lỗi hiển thị (Type A) gây vỡ giao diện ở các viewport khác nhau.
- Tinh chỉnh các giá trị arbitrary `[...]` sang giá trị utility scale chuẩn của Tailwind CSS v4.
- Đảm bảo hình ảnh và nội dung có `loading="lazy"`, `fetchPriority="high"`, và `alt` ngữ nghĩa.
- Thay thế các icon web font bằng icon inline SVG của thư viện `lucide-react`.

---

## 2. Chi tiết Level 2 – Propose & Continue Safe (Đề xuất có cấu trúc)
Khi phát hiện vấn đề Type C ở quy mô lớn (ảnh hưởng đến cách tương tác của người dùng):
1. **Lập đề xuất theo mẫu chuẩn:**
   - **Vấn đề:** Mô tả ngắn gọn sự cố UX.
   - **Bằng chứng:** Viewport, số lượng phần tử, hành vi bất tiện.
   - **Phương án đề xuất:** Giải pháp UX tốt hơn.
   - **Trade-off:** Được gì và mất gì?
   - **Khuyến nghị của Agent:** Đề xuất lựa chọn tối ưu.
2. **Quy tắc "Continue Safe":**
   - Không block toàn bộ màn hình.
   - Tiếp tục code toàn bộ các phần an toàn khác (Navbar, Header, Table cơ bản, v.v.).
   - Đặt phần cần duyệt ở trạng thái fallback an toàn hoặc đánh dấu `[PENDING_APPROVAL]`.

---

## 3. Chi tiết Level 3 – Restricted (Vùng cấm tuyệt đối)
Nếu Agent vi phạm bất kỳ điều nào sau đây, sản phẩm sẽ bị từ chối nghiệm thu ngay lập tức:
- Tự ý xóa cột trong bảng chỉ để bảng "đỡ bị dài ngang".
- Tự ý bỏ bớt trường nhập liệu trong Form đăng ký đối tác bãi.
- Hiển thị nút "Xóa bãi đỗ" hoặc "Duyệt đối soát" cho mọi Role mà không kiểm tra quyền `ADMIN` / `OPERATOR`.
- Thay đổi schema API gửi lên Backend.

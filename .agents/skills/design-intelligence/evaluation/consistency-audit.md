# Evaluation Dimension 9 & 10: Consistency Audit & Business Parity

## 1. Tiêu chí 10: System-wide Consistency (Tính đồng bộ toàn hệ thống) - Thang điểm 0..4
- **Điểm 4:** Đồng bộ hoàn hảo với các màn hình khác trong CRM:
  - Cùng chung kiểu dáng nút bấm (Primary button: `bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl shadow-sm`).
  - Cùng chung quy chuẩn bảng dữ liệu (Header nền xám nhạt `bg-slate-100/80`, font `font-sora text-xs uppercase`, hover hàng `hover:bg-slate-50`).
  - Cùng chung cách hiển thị badge trạng thái (`bg-emerald-100 text-emerald-700` cho Đang hoạt động, `bg-amber-100 text-amber-700` cho Đang chờ duyệt).
- **Điểm 3:** Đồng bộ cao, chỉ có khác biệt nhỏ do đặc thù riêng của module.
- **Điểm 2:** Bắt đầu có sự phân mảnh: màn hình này dùng nút bo tròn 8px (`rounded-lg`), màn hình kia dùng bo tròn 16px (`rounded-2xl`).
- **Điểm 1:** Xuất hiện phong cách thiết kế lạ lẫm, không liên quan tới Design System của dự án.
- **Điểm 0:** Hoàn toàn tách biệt như một ứng dụng khác được ghép vào.

---

## 2. Tiêu chí Tối thượng: Business & Capability Parity (Bảo toàn 100% nghiệp vụ) - Pass / Fail
Đây là **tiêu chí nhị phân (Pass / Fail)**, không chấm điểm số:
- **PASS:** Màn hình chuyển đổi mới có đầy đủ 100% trường dữ liệu, bộ lọc, hành động thao tác và ràng buộc quyền hạn so với màn hình Legacy và API Backend.
- **FAIL:** Bị mất bất kỳ trường dữ liệu bắt buộc nào, mất nút hành động nghiệp vụ, hoặc làm sai lệch logic phân quyền RBAC.

> 🛑 **Hard Blocker (Chặn nghiệm thu):** Điểm số trung bình dù đạt 40/40 nhưng nếu bị **FAIL** ở tiêu chí Business Parity thì toàn bộ task sẽ bị dừng lại lập tức, không được phép merge.

# Component Pattern: Sidebar Navigation

## 1. Bản chất & Vai trò thiết kế
Sidebar là trung tâm điều hướng của toàn bộ hệ thống quản trị CRM (Back-office). Nó thể hiện cấu trúc cây nghiệp vụ của các phòng ban (Điều vận, Tài chính, Bãi đỗ, Quản trị hệ thống).

---

## 2. Vấn đề thường gặp từ Stitch & Cách giải quyết

### Sự cố 1: Danh sách chức năng quá dài (15-20 mục), người dùng phải cuộn cả trang
- **Quan sát:** Menu sidebar dài quá chiều cao màn hình laptop 768px, chân trang bị đẩy xuống dưới cùng.
- **Giải pháp chuẩn:**
  1. *Phân nhóm ngữ nghĩa (Semantic Grouping):* Chia danh sách thành các nhóm có tiêu đề nhỏ (ví dụ: `ĐIỀU VẬN & BÃI XE`, `TÀI CHÍNH & PAYOS`, `HỆ THỐNG`).
  2. *Cuộn nội bộ độc lập (Independent Scroll):*
     - Cố định header sidebar và footer tài khoản.
     - Thiết lập phần danh sách menu: `flex-1 overflow-y-auto overscroll-contain`.
  3. *Menu đa cấp (Collapsible Accordion):* Các chức năng chi tiết được gom vào nhóm cha có thể đóng/mở (ví dụ: `Báo cáo ▾` $\rightarrow$ `Doanh thu`, `Lưu lượng xe`, `Đối soát`).

### Sự cố 2: Không gian làm việc bị hẹp khi mở bảng lớn
- **Giải pháp:** Cung cấp tính năng thu gọn Sidebar (Collapsed / Icon-only mode):
  - Trạng thái mở: chiều rộng 256px (`w-64`).
  - Trạng thái thu gọn: chiều rộng 72px (`w-[72px]`), chỉ hiện icon kèm tooltip khi hover.

---

## 3. Checklist nghiệm thu Sidebar
- [ ] Sidebar có cuộn nội bộ độc lập, không làm trôi thanh Header hay Footer.
- [ ] Nhóm menu đang active được highlight rõ ràng bằng nền `bg-brand-orange/10` và chữ `text-brand-orange font-semibold`.
- [ ] Trên mobile (< 1024px), sidebar tự động ẩn và hoạt động dưới dạng Drawer overlay có backdrop làm mờ.

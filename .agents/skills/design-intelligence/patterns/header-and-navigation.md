# Component Pattern: Header & Top Navigation

## 1. Bản chất & Vai trò thiết kế
Header là "mỏ neo nhận diện" (Anchor of Identity) và la bàn điều hướng của toàn bộ hệ thống CRM.
Các khối thành phần thông thường:
1. **Brand Logo:** Nhận diện SmartTruckHub / SmartParkingHub.
2. **Global Navigation:** Các module chức năng chính.
3. **Utility Actions:** Tìm kiếm nhanh, hotline/support, chuông thông báo.
4. **User Profile:** Avatar, tên người dùng, vai trò, menu đăng xuất.

---

## 2. Vấn đề thường gặp từ Stitch & Cách giải quyết

### Sự cố 1: Menu có quá nhiều mục và bị rớt dòng tại 1366px / 1280px (Laptop)
- **Quan sát:** Header có 8-10 mục menu. Khi mở trên laptop, nhóm menu rớt xuống hàng thứ hai đẩy nội dung chính xuống dưới.
- **Suy luận 3 bước:**
  1. *Bước 1 (Level 1 Autonomous):* Kiểm tra `gap` giữa các mục. Giảm từ `gap-8` xuống `gap-5` hoặc `gap-4`. Giảm padding `px-4` xuống `px-2.5`. Nếu hết rớt dòng $\rightarrow$ Xong!
  2. *Bước 2 (Level 1 Autonomous):* Kiểm tra `max-w-310 mx-auto`. Đảm bảo container không bị ép cứng ở kích thước nhỏ hơn vùng chứa.
  3. *Bước 3 (Level 2 Propose & Continue Safe):* Nếu đã giảm gap mà vẫn rớt dòng:
     - Giữ nguyên 5-6 mục quan trọng nhất ngoài thanh chính.
     - Gom các mục phụ (ví dụ: "Kết nối API", "Điều khoản", "Tài liệu") vào dropdown **`Thêm ▾` (More Dropdown)**.
     - Báo cáo rõ đề xuất và tiếp tục code các phần an toàn.

### Sự cố 2: Hiển thị trên Mobile & Tablet (< 1024px)
- **Quy tắc bắt buộc:** Trên màn hình nhỏ hơn `lg:` (1024px), toàn bộ thanh menu chính phải ẩn đi và thay bằng nút Hamburger Menu mở ra Drawer/Sheet trượt từ cạnh phải hoặc thả từ trên xuống.
- Hotline và nút Đăng nhập thu gọn thành icon hoặc chuyển vào bên trong Drawer.

---

## 3. Checklist nghiệm thu Header
- [ ] Không bao giờ bị rớt dòng tại bất kỳ viewport nào từ 375px đến 1920px.
- [ ] Có hiệu ứng sticky top (`sticky top-0 z-50 bg-white/95 backdrop-blur-md`).
- [ ] Icon trong header sử dụng `lucide-react` và có `aria-hidden="true"`.
- [ ] Link active có chỉ báo rõ ràng (màu cam `text-brand-orange` hoặc gạch chân).

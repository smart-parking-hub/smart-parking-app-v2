# Component Pattern: Business Forms & Validation

## 1. Bản chất & Vai trò thiết kế
Form nhập liệu là nơi người dùng thực hiện các thao tác tạo mới hoặc cập nhật dữ liệu cốt lõi (Đăng ký cụm bãi đỗ, Tạo phiếu đặt chỗ xe tải, Cấu hình biểu phí). Form phải đem lại cảm giác an tâm, rõ ràng và ngăn ngừa lỗi nhập liệu.

---

## 2. Vấn đề thường gặp từ Stitch & Cách giải quyết

### Sự cố 1: Form quá dài (20-30 trường) nằm trên một trang thẳng tuột
- **Quan sát:** Người dùng phải cuộn chuột rất dài, không biết bao giờ mới điền xong, dễ bỏ dở.
- **Giải pháp:**
  1. *Phân đoạn thông tin (Sectioning):* Gom các trường liên quan vào từng thẻ Card riêng biệt (ví dụ: `1. Thông tin doanh nghiệp`, `2. Thông số kỹ thuật bãi`, `3. Tài khoản đối soát PayOS`).
  2. *Bố cục lưới linh hoạt:*
     - Desktop: 2 cột (`grid grid-cols-1 md:grid-cols-2 gap-6`).
     - Mobile: Tự động xếp chồng thành 1 cột (`grid-cols-1`).
  3. *Form phức tạp:* Đề xuất (Level 2) chuyển sang dạng Multi-step Wizard có thanh tiến trình (Step 1 $\rightarrow$ Step 2 $\rightarrow$ Step 3).

### Sự cố 2: Hiển thị lỗi Validation mơ hồ hoặc giật layout
- **Giải pháp:**
  - Bắt buộc dùng `React Hook Form` kết hợp `Zod` schema.
  - Trường lỗi phải có:
    - Viền đỏ: `border-rose-500 focus:ring-rose-500`.
    - Thông báo lỗi bên dưới bằng chữ tiếng Việt rõ nghĩa: `text-xs text-rose-600 mt-1`.
    - Giữ chiều cao tối thiểu hoặc dùng flex để khi lỗi xuất hiện không làm giật các thành phần bên dưới.

### Sự cố 3: Đánh dấu trường bắt buộc (Required Fields)
- Mọi trường bắt buộc phải có dấu hoa thị đỏ `<span className="text-rose-500">*</span>`.
- Nút Submit phải có trạng thái Loading khi đang gửi API (`isSubmitting` $\rightarrow$ Spinner icon + disabled).

---

## 3. Checklist nghiệm thu Form
- [ ] Tất cả input đều có `<label htmlFor="...">` tương ứng với `id` của input.
- [ ] Hỗ trợ đầy đủ phím `Tab` để chuyển trường liên tục không bị gián đoạn.
- [ ] Nút Hủy và Nút Lưu đặt cạnh nhau rõ ràng ở chân form; nút Lưu dùng màu cam thương hiệu `brand-orange`.
- [ ] Tuyệt đối không xóa bất kỳ trường dữ liệu nào có trong database hoặc API Backend.

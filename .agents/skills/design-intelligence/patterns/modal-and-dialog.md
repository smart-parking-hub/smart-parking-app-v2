# Component Pattern: Modals & Confirmation Dialogs

## 1. Bản chất & Vai trò thiết kế
Modal/Dialog là cửa sổ tương tác ngắt đoạn (Disruptive Overlay), dùng cho các tác vụ quan trọng cần sự tập trung cao độ (Xác nhận hủy đặt chỗ, Chi tiết vé xe tải, Cấu hình cổng barie).

---

## 2. Vấn đề thường gặp từ Stitch & Cách giải quyết

### Sự cố 1: Modal có nội dung dài vượt quá chiều cao màn hình laptop
- **Quan sát:** Ở màn hình 1366x768px, chân modal chứa nút "Lưu" hoặc "Xác nhận" bị tràn xuống dưới màn hình, không thể click được.
- **Giải pháp bắt buộc (Level 1 Autonomous):**
  1. *Cố định Header & Footer Modal:*
     - Header chứa Tiêu đề + Nút đóng `X` (`sticky top-0 bg-white z-10 border-b border-slate-100`).
     - Footer chứa Nút Hủy + Nút Hành động (`sticky bottom-0 bg-white z-10 border-t border-slate-100 p-4 flex justify-end gap-3`).
  2. *Cuộn độc lập phần thân:*
     - Khung modal: `max-h-[90vh] flex flex-col rounded-2xl overflow-hidden`.
     - Thân modal (Body): `flex-1 overflow-y-auto p-6`.

### Sự cố 2: Khả năng tiếp cận & Focus Trap
- **Giải pháp:**
  - Khi modal mở: Bắt buộc khóa cuộn trang nền (`overflow-hidden` trên `document.body`).
  - Hỗ trợ đóng modal khi bấm phím `Escape` hoặc click vào vùng backdrop xám mờ (`bg-slate-900/60 backdrop-blur-xs`).
  - Nút đóng `X` phải có `aria-label="Đóng cửa sổ"`.

---

## 3. Checklist nghiệm thu Modal
- [ ] Chân modal chứa nút hành động luôn luôn hiển thị trên mọi độ phân giải.
- [ ] Không bao giờ có hiện tượng cuộn kép (Double Scrollbar) trên toàn màn hình.
- [ ] Thao tác nguy hiểm (ví dụ: Xóa dữ liệu) phải có cảnh báo màu đỏ và nút xác nhận màu đỏ `bg-rose-600 hover:bg-rose-700`.

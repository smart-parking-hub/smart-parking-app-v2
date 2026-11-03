# Workflow Phase 4: Detailed Reporting & Halt for Approval

## 1. Định dạng báo cáo nghiệm thu (Detailed Format)
Khi báo cáo kết quả màn hình cho người dùng, Agent phải tuân thủ đúng định dạng **Detailed** gồm 5 phần:

1. **Tổng quan màn hình:** Tên màn hình, route, vai trò nghiệp vụ, trạng thái hoàn thành.
2. **Bảng phân loại các vấn đề phát hiện & cách xử lý:**
   - Liệt kê các vấn đề Type A (Lỗi kỹ thuật đã tự sửa).
   - Liệt kê các quyết định bảo toàn Type B (Chủ ý thiết kế).
   - Báo cáo các đề xuất Type C (Lỗi lớn nếu có) và các phần áp dụng quy tắc `Continue Safe`.
3. **Bảng đối chiếu nghiệp vụ (Capability Parity Matrix):** Chứng minh 100% tính năng so với Backend/Legacy đều được bảo toàn.
4. **Bằng chứng 4 cổng kiểm định:** Kết quả chạy `typecheck`, `lint`, `test`, `build`.
5. **Đánh giá điểm chất lượng thiết kế (Design Quality Scorecard):** Điểm số trên thang 40.

---

## 2. Nguyên tắc "Continue Safe" khi gặp vấn đề lớn
- Nếu màn hình có một phần phức tạp cần người dùng duyệt thiết kế (ví dụ: Modal chia bước hay để 1 trang?):
  - Agent triển khai toàn bộ các phần an toàn khác (Navbar, Banner, Table, Logic API chính).
  - Phần đang chờ duyệt được cắm cờ `[PENDING_APPROVAL]` kèm phương án đề xuất rõ ràng.
  - Thông báo cho người dùng: *"Tôi đã triển khai an toàn 90% màn hình, chỉ còn thành phần [X] cần quyết định từ bạn để chốt phương án cuối."*

---

## 3. Dừng lại chờ nghiệm thu (Hard Stop & Halt)
> 🛑 **MANDATORY RULE:** Agent **TUYỆT ĐỐI KHÔNG** được tự ý bắt đầu màn hình tiếp theo khi người dùng chưa nghiệm thu màn hình hiện tại. Sau khi xuất báo cáo, Agent phải dừng lại và chờ lệnh tiếp theo từ người dùng.

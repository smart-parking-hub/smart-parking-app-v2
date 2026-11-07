# Báo Cáo Sai Lệch & Xung Đột Hệ Thống (Gaps and Conflicts)

Trong quá trình reverse engineering đối chiếu giữa **Tài liệu đặc tả (SRS v2.0)**, **Báo cáo kỹ thuật Backend (`reportBE.md`)**, **Mã nguồn Backend (Java Spring Boot)** và **Mã nguồn Frontend (React/TypeScript)**, chúng tôi phát hiện một số điểm sai lệch (Gaps) và xung đột (Conflicts) quan trọng cần được ghi nhận minh bạch để đội ngũ thiết kế lại giao diện không bị nhầm lẫn.

---

## 1. Bảng Tổng Hợp Các Điểm Mâu Thuẫn & Sai Lệch

| Mã Vấn Đề | Phân Loại | Khía Cạnh | Nguồn 1 (Tài Liệu / SRS) | Nguồn 2 (Mã Nguồn Frontend) | Nguồn 3 (Mã Nguồn Backend) | Kết Luận & Khuyến Nghị Thiết Kế |
|---|---|---|---|---|---|---|
| **GAP-01** | `CONFLICT` | Thu tiền mặt tại cổng bãi | **SRS v2.0 (Mục 1.3):** Tuyệt đối không hỗ trợ thanh toán ngoài hệ thống. | **`MerchantQrScannerPage.tsx`:** Có nút "Xác nhận thu tiền mặt tại cổng" (`confirmCashPayment`). | **`MerchantController.java`:** Hỗ trợ endpoint hoàn tất đơn bằng tiền mặt. | **GIỮ TÍNH NĂNG TRÊN UI:** Thực tế vận hành xe tải tại Việt Nam rất cần thu tiền mặt khi barie mở cho xe ra. Cần thiết kế modal xác nhận tiền mặt to rõ. |
| **GAP-02** | `CONFLICT` | Cấu trúc URL định tuyến | **SRS & Route Map dự kiến:** Một trang chỉ có một URL chuẩn duy nhất. | **`AppRoutes.tsx`:** Tồn tại 2 URL cho cùng 1 trang: `/parking` và `/dashboard/search`; `/vehicles` và `/dashboard/vehicles`. | **Backend API:** Độc lập với URL Frontend. | **CHUẨN HÓA KHI THIẾT KẾ:** Khi thiết kế lại bằng Stitch, chỉ giữ 1 URL chuẩn: `/parking` (cho tìm kiếm) và `/vehicles` (cho quản lý xe). Bỏ các URL alias `/dashboard/*`. |
| **GAP-03** | `VERIFIED` | Danh mục 5 loại phương tiện | **SRS v2.0 (Mục 1.0):** Liệt kê mô tả chung chung về xe con, xe tải, xe container. | **`vehicleTypes.ts`:** Định nghĩa 5 types: `SEDAN_SUV`, `BUS_COACH`, `LIGHT_TRUCK`, `HEAVY_TRUCK`, `CONTAINER`. | **`VehicleTypeEnum.java`:** Khớp 100% với 5 giá trị enum trên. | **BẢO TOÀN TUYỆT ĐỐI:** Đây là bộ từ điển chuẩn toàn hệ thống, bắt buộc mọi dropdown lọc và bảng giá phải dùng đúng 5 loại này. |
| **GAP-04** | `VERIFIED` | Các loại thanh toán (`PaymentTypeEnum`) | **SRS cũ:** Chỉ đề cập thanh toán tiền đỗ xe. | **Frontend:** Xử lý 2 loại: Tiền cọc (`DEPOSIT`) và Thanh toán cuối (`FINAL_PAYMENT`). | **`V1__init_schema.sql` (v2.1):** Định nghĩa 4 types: `DEPOSIT`, `FINAL_PAYMENT`, `PENALTY`, `REFUND`. | **BẢO TOÀN ĐẦY ĐỦ:** Thiết kế UI lịch sử giao dịch cần có đủ 4 badges cho 4 loại giao dịch này để người dùng hiểu rõ nguồn tiền. |
| **GAP-05** | `CODE_ONLY` | Cập nhật vị trí Hàng đợi thời gian thực | **SRS v2.0 (UC-06):** Hàng đợi ảo tự động thông báo khi có slot trống. | **`DriverQueuesPage.tsx`:** Có ghi chú "Dữ liệu vị trí sẽ tự cập nhật khi BE hỗ trợ realtime". | **Monolith BE:** Chưa tích hợp WebSocket/STOMP, đang dùng HTTP REST polling. | **THIẾT KẾ UI:** Thiết kế nút "Làm mới vị trí" (Refresh) kèm hiệu ứng quay loading nhẹ nhàng để tài xế chủ động cập nhật trong lúc chờ WebSocket. |
| **GAP-06** | `VERIFIED` | Nút Demo Cọc Bypass PayOS | **Tài liệu chính thức:** Không có khái niệm demo bypass. | **`MyBookingsPage.tsx`:** Có nút "Demo: Xác nhận cọc ngay" khi biến `VITE_ENABLE_DEMO_PAYMENT=true`. | **Backend API:** Cho phép nhận webhook giả lập để test local. | **LƯU Ý THIẾT KẾ:** Nút này chỉ là công cụ hỗ trợ dev/staging, khi thiết kế giao diện chính thức Stitch phải ẩn đi hoặc chỉ hiển thị trong môi trường Sandbox/Dev mode. |
| **GAP-07** | `VERIFIED` | Trạng thái bãi xe chưa duyệt không được đỗ | **Tài liệu:** Bãi đỗ chưa duyệt không hiển thị cho tài xế. | **Frontend:** Lọc bãi `APPROVED` khi tìm kiếm. | **Backend (v2.1 fix H3):** Bổ sung ném `BadRequestException` nếu cố tình tạo booking vào bãi chưa `APPROVED`. | **BẢO VỆ KÉP:** Frontend cần disable nút "Đặt chỗ" nếu bãi đang ở trạng thái khác `APPROVED`. |

---

## 2. Các Lưu Ý Kỹ Thuật Khi Triển Khai Thiết Kế Stitch

1. **Không tự ý thêm loại xe 2 bánh:**
   - Trong quá khứ, một số tài liệu nháp có đề cập xe máy. Tuy nhiên, toàn bộ logic nghiệp vụ, kích thước ô đỗ và backend đã chốt chặn: **Chỉ hỗ trợ phương tiện 4 bánh trở lên**. Tuyệt đối không thiết kế icon xe máy hoặc tùy chọn xe máy trên UI.
2. **Bảo toàn quy tắc 10 phút giữ chỗ:**
   - Khi tài xế bấm đặt chỗ, booking KHÔNG thành công ngay mà bước vào trạng thái `PENDING_PAYMENT` với đồng hồ đếm ngược 10 phút. Nếu thiết kế UI biến bước này thành "Đặt thành công ngay", luồng thanh toán cọc PayOS sẽ bị phá vỡ hoàn toàn.
3. **Quy trình Rút tiền phải có bước Admin duyệt:**
   - Merchant không thể tự động rút tiền về tài khoản ngân hàng ngay lập tức (instant withdrawal). Hệ thống tài chính nội bộ yêu cầu phải qua cổng kiểm soát của Admin (`SCR-048`) để chống gian lận và rửa tiền.

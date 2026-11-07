# Đặc Tả Các Màn Hình Phụ & Modal/Drawer Nghiệp Vụ (SCR-MOD-01 đến SCR-MOD-12)

Hệ thống **SmartParkingHub** chứa **12 modal/drawer nghiệp vụ quan trọng** chứa logic tương tác và giao tiếp API riêng biệt. Tất cả các modal này đã được đối chiếu chéo với mã nguồn Frontend (`smart-parking-app`) và Backend (`smart-parking-service` / `smart-parking-microservice`). Tuyệt đối không được phép bỏ sót khi thiết kế lại giao diện trên Stitch.

---

## 1. SCR-MOD-01: AiChatWidget (Cửa Sổ Trợ Lý AI Copilot)
- **Mã Modal:** `SCR-MOD-01`
- **Component File:** [`src/features/ai-copilot/components/AiChatWidget.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/ai-copilot/components/AiChatWidget.tsx)
- **Vị trí xuất hiện:** Nút launcher nổi cố định góc dưới bên phải màn hình Tài xế.
- **Mục đích:** Tìm bãi đỗ xe tức thời theo GPS và trả lời chính sách bằng AI.
- **Cấu trúc giao diện:**
  - Tiêu đề modal: "SmartParking AI Copilot" + icon robot + nút đóng (X).
  - Vùng hiển thị tin nhắn có scrollbar mượt: Tin nhắn người dùng (căn phải, nền xanh), Tin nhắn Bot (căn trái, nền xám nhạt).
  - Thẻ bãi xe đề xuất (`SuggestedParkingLotCard`): Tên bãi, Khoảng cách (km), Số slot trống, Mức giá giờ, Nút "Đặt chỗ ngay".
  - Thanh câu hỏi gợi ý nhanh (3 Quick prompt chips).
  - Ô nhập liệu câu hỏi + nút Gửi có icon mũi tên.
- **Tương tác đặc biệt:** Tự động lấy tọa độ GPS từ trình duyệt khi bấm gửi.
- **API:** `POST /api/v1/ai/chat` (`ai-service` trên port 8088).

---

## 2. SCR-MOD-02: ReviewModal (Đánh Giá & Chấm Điểm Bãi Đỗ)
- **Mã Modal:** `SCR-MOD-02`
- **Component File:** [`src/features/reviews/components/ReviewModal.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/reviews/components/ReviewModal.tsx)
- **Vị trí xuất hiện:** Mở ra khi bấm nút "Đánh giá bãi" tại đơn hàng `COMPLETED` trong `SCR-017: MyBookingsPage`.
- **Mục đích:** Cho phép tài xế chấm điểm chất lượng bãi và viết nhận xét sau khi đã đỗ xe xong.
- **Cấu trúc giao diện:**
  - Tiêu đề modal: "Đánh giá bãi đỗ xe".
  - Tên bãi xe và thời gian đỗ vừa hoàn tất.
  - Bộ chấm điểm sao: 1 đến 5 sao kèm nhãn cảm xúc (`Rất tệ`, `Chưa tốt`, `Bình thường`, `Tốt`, `Tuyệt vời`).
  - Ô nhập nội dung nhận xét (`textarea`): Tối đa 500 ký tự kèm bộ đếm ký tự.
  - Cụm 2 nút bấm: "Hủy bỏ" và "Gửi đánh giá" (Disable nếu chưa chọn sao).
- **API:** `POST /api/v1/reviews` `{ bookingId, rating, comment }`.

---

## 3. SCR-MOD-03: CancelBookingModal (Hủy Đặt Chỗ & Chính Sách Hoàn Cọc)
- **Mã Modal:** `SCR-MOD-03`
- **Component File:** [`src/features/bookings/components/CancelBookingModal.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/bookings/components/CancelBookingModal.tsx)
- **Vị trí xuất hiện:** Mở ra khi bấm nút "Hủy chỗ / hoàn tiền" tại booking `PENDING_CHECKIN` trong `SCR-017: MyBookingsPage`.
- **Mục đích:** Thông báo rõ chính sách hoàn tiền cọc trước khi tài xế quyết định hủy slot đỗ.
- **Cấu trúc giao diện:**
  - Tiêu đề modal: "Xác nhận hủy đặt chỗ".
  - Hộp cảnh báo màu xanh dương (`Alert`): Thông báo số tiền cọc được hoàn theo mốc giờ hủy (>60 phút: 100%, <60 phút: mất cọc).
  - Nhóm chọn lý do hủy: Thay đổi lộ trình, Tìm được bãi khác, Xe gặp sự cố kỹ thuật, Lý do cá nhân khác.
  - Ô nhập lý do chi tiết và số điện thoại liên hệ nhận tiền hoàn.
  - Cụm 2 nút bấm: "Giữ lại đặt chỗ" (Cancel) và "Xác nhận hủy đơn" (Nút đỏ nguy hiểm).
- **API:** `POST /api/v1/bookings/{id}/cancel` `{ reason, contactPhone, preferredResolution, note }`.

---

## 4. SCR-MOD-04: AddEditVehicleModal (Thêm Mới / Sửa Phương Tiện)
- **Mã Modal:** `SCR-MOD-04`
- **Component File:** Nằm trong [`src/features/vehicles/pages/VehiclesPage.tsx:145-200`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/vehicles/pages/VehiclesPage.tsx#L145-L200)
- **Vị trí xuất hiện:** Mở ra khi bấm "Thêm phương tiện" hoặc bấm icon bút chì chỉnh sửa tại `SCR-020: VehiclesPage`.
- **Mục đích:** Khai báo phương tiện của tài xế vào cơ sở dữ liệu.
- **Cấu trúc giao diện:**
  - Tiêu đề: "Thêm phương tiện mới" hoặc "Cập nhật phương tiện".
  - Ô nhập: Biển số xe (Regex: `/^[0-9A-Z.-]{5,20}$/i`, tự động viết hoa).
  - Dropdown chọn Loại xe: Bắt buộc chọn 1 trong 5 loại xe chuẩn hệ thống.
  - Ô nhập số: Tải trọng xe (Tấn, bước nhảy 0.5 tấn, min 0.5, max 100).
  - Ô nhập: Hãng xe & Model (Tùy chọn, ví dụ `Hino 500 Series`).
  - Cụm nút: "Hủy" và "Lưu phương tiện".
- **API:** `POST /api/v1/vehicles` hoặc `PUT /api/v1/vehicles/{id}`.

---

## 5. SCR-MOD-05: CreateWithdrawalModal (Tạo Lệnh Rút Tiền Merchant)
- **Mã Modal:** `SCR-MOD-05`
- **Component File:** Nằm trong [`src/features/merchant/withdrawals/pages/MerchantWithdrawalsPage.tsx:76`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/withdrawals/pages/MerchantWithdrawalsPage.tsx#L76)
- **Vị trí xuất hiện:** Mở ra khi bấm "Tạo yêu cầu rút tiền" tại `SCR-038`.
- **Mục đích:** Cho phép Merchant yêu cầu rút số dư ví doanh thu về tài khoản ngân hàng.
- **Cấu trúc giao diện:**
  - Tiêu đề modal: "Yêu cầu rút tiền từ ví".
  - Thẻ thông tin tài khoản thụ hưởng: Tên ngân hàng, Số tài khoản, Tên chủ tài khoản (đồng bộ từ hồ sơ `SCR-027`).
  - Dòng hiển thị: Số dư ví khả dụng hiện tại (`walletBalance`).
  - Ô nhập số tiền muốn rút: Bắt buộc tối thiểu 50.000 đ và nhỏ hơn hoặc bằng số dư ví.
  - Phím chọn nhanh số tiền: `[500.000 đ]` • `[1.000.000 đ]` • `[5.000.000 đ]` • `[Rút toàn bộ số dư]`.
  - Cụm nút: "Hủy" và "Xác nhận rút tiền".
- **API:** `POST /api/v1/withdrawals` `{ amount, bankName, bankAccount }`.

---

## 6. SCR-MOD-06: InlineQuickBookPanel (Panel Giữ Chỗ Nhanh Tại Bản Đồ)
- **Mã Modal/Drawer:** `SCR-MOD-06`
- **Component File:** [`src/features/parking-search/components/InlineQuickBookPanel.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/parking-search/components/InlineQuickBookPanel.tsx)
- **Vị trí xuất hiện:** Mở trượt ngay trên màn hình `SCR-015: SearchParkingPage` khi tài xế bấm "Đặt chỗ nhanh" trên thẻ bãi đỗ.
- **Mục đích:** Cho phép tài xế giữ chỗ khẩn cấp trong 10 phút mà không cần chuyển trang.
- **Cấu trúc giao diện (2 Bước):**
  - **Bước 1 (Chọn xe & Thời gian):**
    - Bộ chọn xe tương thích (`compatibleVehicles`) khớp với slot còn trống của bãi.
    - Bộ chọn giờ vào dự kiến (`startTime`) và giờ ra dự kiến (`endTime`) kèm các nút chọn nhanh `+2h`, `+4h`, `+8h`, `+24h`.
    - Tính toán tức thì: Tổng số giờ, Đơn giá/giờ, Tổng tiền dự kiến, và Tiền cọc giữ chỗ 20%.
    - Nút bấm: "Giữ chỗ 10 phút" (Gọi `createBooking`).
  - **Bước 2 (Thanh toán cọc & Đếm ngược 10 phút):**
    - Đồng hồ đếm ngược 10 phút giữ chỗ.
    - Nút "Thanh toán cọc qua PayOS" (Chuyển hướng cổng PayOS).
    - Nút "Thanh toán demo" (Sandbox testing).
    - Tự động gọi `cancelBooking` nếu tài xế bấm nút đóng (X) trong lúc đơn đang ở trạng thái giữ chỗ.
- **API:** `POST /api/v1/bookings`, `POST /api/v1/payments`, `POST /api/v1/bookings/{id}/cancel`.

---

## 7. SCR-MOD-07: BookingFlowModal (Modal Đặt Chỗ Chi Tiết 2 Bước)
- **Mã Modal:** `SCR-MOD-07`
- **Component File:** [`src/features/bookings/components/BookingFlowModal.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/bookings/components/BookingFlowModal.tsx)
- **Vị trí xuất hiện:** Mở ra khi bấm "Đặt chỗ ngay" tại màn hình `SCR-016: ParkingDetailPage`.
- **Mục đích:** Modal chính thức cho phép đặt chỗ từ trang chi tiết bãi đỗ xe.
- **Cấu trúc giao diện (2 Bước):**
  - Tương tự quy trình 2 bước của `SCR-MOD-06` nhưng hiển thị dạng Modal Dialog hộp thoại lớn ở giữa màn hình.
  - Kiểm tra xe tương thích: `lot.slots.some(slot => slot.vehicleType === vehicle.vehicleType && slot.totalCapacity > 0)`.
  - Hiển thị bảng tóm tắt: Tên bãi, Loại phương tiện, Biển số xe, Khoảng thời gian, Đơn giá theo giờ, Tiền cọc 20%.
  - Bấm thanh toán chuyển hướng sang PayOS checkout URL.
- **API:** `POST /api/v1/bookings`, `POST /api/v1/payments`, `POST /api/v1/bookings/{id}/cancel`.

---

## 8. SCR-MOD-08: GenerateDescriptionModal (Trợ Lý AI Sinh Nội Dung Bãi Xe)
- **Mã Modal:** `SCR-MOD-08`
- **Component File:** [`src/features/ai-copilot/components/GenerateDescriptionModal.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/ai-copilot/components/GenerateDescriptionModal.tsx)
- **Vị trí xuất hiện:** Mở ra khi chủ bãi bấm nút "✨ Điền nhanh bằng AI" tại `SCR-029: CreateMerchantParkingLotPage`.
- **Mục đích:** Tự động sinh văn bản mô tả bãi xe, nội quy an toàn PCCC và hướng dẫn đường đi cho xe tải lớn bằng AI.
- **Cấu trúc giao diện:**
  - Ô nhập: Tên bãi, Địa chỉ thực tế, Nhóm tiện ích nổi bật (Camera 24/7, Có mái che, Cổng barie tự động, Gần quốc lộ).
  - Nút: "Tạo nội dung bằng AI" (Hiển thị hiệu ứng loading lấp lánh).
  - Vùng hiển thị kết quả 3 phần: Mô tả quảng bá (`marketingDescription`), Nội quy an toàn bãi xe (`regulations`), Hướng dẫn lộ trình vào bãi (`wayfinding`).
  - Nút: "Áp dụng vào form" (Tự động điền dữ liệu vào form `SCR-029`).
- **API:** `POST /api/v1/ai/generate-description`.

---

## 9. SCR-MOD-09: DriverPaymentDetailDialog (Chi Tiết Giao Dịch Tài Xế)
- **Mã Modal:** `SCR-MOD-09`
- **Component File:** Nằm trong [`src/features/payments/pages/DriverPaymentsPage.tsx:140-174`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/payments/pages/DriverPaymentsPage.tsx#L140-L174)
- **Vị trí xuất hiện:** Kích hoạt khi tài xế click vào bất kỳ dòng giao dịch nào trong bảng `SCR-019: DriverPaymentsPage`.
- **Mục đích:** Xem biên lai chi tiết của giao dịch tiền cọc hoặc thanh toán cuối.
- **Cấu trúc giao diện:**
  - Accessible Dialog Overlay (`role="dialog"`, `aria-modal="true"`).
  - Tiêu đề: Mã giao dịch ngân hàng / PayOS (`transactionCode`).
  - Danh sách định nghĩa (`<dl>`): Mã Booking liên kết (`bookingCode`), Ngày giờ thanh toán chính xác, Số tiền giao dịch (định dạng VND in đậm lớn), Trạng thái giao dịch.
  - Nút đóng (X) góc trên phải hoặc click backdrop để đóng.
- **API:** Dữ liệu đọc từ Client Cache của dòng bảng đã tải qua `GET /api/v1/payments/my`.

---

## 10. SCR-MOD-10: MerchantBarieConfirmModal (Xác Nhận Xe Ra/Vào & Quyết Toán Barie)
- **Mã Modal:** `SCR-MOD-10`
- **Component File:** Nằm trong [`src/features/merchant/qr-scanner/pages/MerchantQrScannerPage.tsx:80, 114`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/qr-scanner/pages/MerchantQrScannerPage.tsx#L80)
- **Vị trí xuất hiện:** Tự động mở ra khi máy quét camera nhận diện mã QR của tài xế tại cổng barie.
- **Mục đích:** Kiểm soát xe vào/ra bãi và quyết toán số tiền đỗ thực tế.
- **Cấu trúc giao diện (2 Trường Hợp):**
  - **Trường hợp Check-in:** Hiển thị tên tài xế, biển số xe, loại xe, thời gian đặt chỗ hợp lệ. Nút "Xác nhận vào bãi & Mở barie" (Gọi `POST /api/v1/merchant/check-in`).
  - **Trường hợp Check-out:** Hiển thị giờ vào thực tế, giờ ra thực tế, tổng thời gian đỗ, phụ phí quá giờ (nếu có), số tiền cọc đã trừ, và số tiền mặt cần thu thêm tại cổng. Nút "Đã thu tiền mặt & Cho xe xuất bãi" (Gọi `POST /api/v1/merchant/confirm-cash` kèm `{ bookingCode, parkingLotId, amount }`).
- **API:** `POST /api/v1/merchant/check-in`, `POST /api/v1/merchant/check-out`, `POST /api/v1/merchant/confirm-cash`.

---

## 11. SCR-MOD-11: AdminDecisionModal (Quyết Định Phê Duyệt / Từ Chối Hành Chính)
- **Mã Modal:** `SCR-MOD-11`
- **Component File:** Nằm trong [`AdminParkingLotDetailPage.tsx:106`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L106), [`AdminWithdrawalsPage.tsx:32`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L32), [`AdminUserDetailPage.tsx:67`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUserDetailPage.tsx#L67)
- **Vị trí xuất hiện:** Mở ra khi Admin thực hiện các hành động nhạy cảm: Duyệt/từ chối bãi đỗ, Duyệt/từ chối chi tiền rút ví, Khóa/mở khóa tài khoản người dùng.
- **Mục đích:** Yêu cầu quản trị viên bắt buộc phải nhập lý do/ghi chú đối soát trước khi tác động thay đổi trạng thái thực thể.
- **Cấu trúc giao diện:**
  - Tiêu đề modal: Tùy biến theo hành động ("Xác nhận duyệt bãi", "Từ chối hồ sơ", "Khóa tài khoản", "Duyệt yêu cầu rút tiền").
  - Ô nhập liệu bắt buộc: `Input.TextArea` có bộ đếm ký tự (tối đa 500 ký tự).
  - Nút "Xác nhận" (có spinner loading) và nút "Hủy". Khóa đóng khi đang gửi request (`confirmLoading={submitting}`).
- **API:** `PUT /api/v1/admin/parking-lots/{id}/approve`, `PUT /api/v1/admin/withdrawals/{id}/approve`, `PUT /api/v1/admin/users/{id}/ban`.

---

## 12. SCR-MOD-12: AdminDisputeResolutionModal (Ban Hành Phán Quyết Tranh Chấp)
- **Mã Modal:** `SCR-MOD-12`
- **Component File:** Nằm trong [`src/features/admin/disputes/AdminDisputeDetailPage.tsx:23`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputeDetailPage.tsx#L23)
- **Vị trí xuất hiện:** Mở ra khi Admin bấm nút "Cập nhật kết quả" trong hồ sơ chi tiết tranh chấp `SCR-050`.
- **Mục đích:** Ghi nhận biên bản phân xử chính thức giữa tài xế và chủ bãi xe.
- **Cấu trúc giao diện:**
  - Tiêu đề: "Cập nhật kết quả tranh chấp".
  - Dropdown chọn trạng thái phân xử: `IN_REVIEW` (Đang xử lý), `WAITING_EVIDENCE` (Chờ bổ sung bằng chứng), `RESOLVED` (Đã giải quyết), `CLOSED` (Đã đóng hồ sơ).
  - Ô nhập biên bản phán quyết: `Input.TextArea` tối đa 1000 ký tự (Ghi rõ căn cứ, trách nhiệm của hai bên và kết quả giải quyết).
  - Cụm nút: "Hủy" và "Lưu kết quả".
- **API:** `PUT /api/v1/disputes/{id}/resolve` `{ status, resolution }`.

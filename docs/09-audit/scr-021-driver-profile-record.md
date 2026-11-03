# Audit Record: SCR-021 Driver Profile & eKYC Operations Workbench (Hồ Sơ Bác Tài & Thông Tin Trực Ban)

## 1. Thông Tin Nhận Diện Màn Hình
- **Screen ID**: `SCR-021`
- **Tên màn hình**: Hồ Sơ Bác Tài & Thông Tin Trực Ban (Driver Profile & eKYC Operations Workbench)
- **Module**: MOD-03: Driver Operations Portal
- **Routes**: `/profile`, `/dashboard/profile`, `/driver/profile`
- **Primary Component**: [`ProfilePage.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/pages/ProfilePage.tsx)
- **Feature Directory**: `smart-parking-app-v2/src/features/profile/`
- **Vai trò truy cập**: `ROLE_DRIVER` (Yêu cầu đăng nhập tài khoản tài xế vận hành)

---

## 2. Các Thành Phần Giao Diện Đã Triển Khai
1. [`ProfileCommandHeader.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ProfileCommandHeader.tsx): Breadcrumb điều hướng phân hệ, tiêu đề H1 và badge trạm trực ban trực tuyến (`CẢNG CÁT LÁI (SP-PSA)`).
2. [`DriverIdentityCard.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/DriverIdentityCard.tsx): Ảnh định danh kèm khiên xác thực eKYC, mã định danh `DRV-VTP-88412`, số điện thoại, tag trạng thái trực ban, chứng chỉ Hạng FC, rating 4.95/5.0 và 4 thẻ Bento KPI (Chuyến Hoàn Thành 48, Vi Phạm Quá Giờ 0, Check-in Đúng Hạn 100%, Sự Cố Khiếu Nại 0).
3. [`ProfileSidebarNav.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ProfileSidebarNav.tsx): 5 mục điều hướng cấu hình tài khoản (Thông tin cá nhân & Giấy phép, Đội xe của tôi `3 XE`, Lịch sử cước & Hóa đơn VAT `18 HÓA ĐƠN`, Đổi mật khẩu bảo mật, Thiết lập thông báo hệ thống).
4. [`DispatchHelpNote.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/DispatchHelpNote.tsx): Cảnh báo điều lệ trực ban 20 phút và quy định đối soát eKYC của Cục Đường Bộ.
5. [`PersonalInfoSection.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/PersonalInfoSection.tsx): Khối 1 gồm họ tên, SĐT OTP, số CCCD có nút tương tác Hiện/Ẩn (`079088******` <-> `079088019482`), GPLX Hạng FC, cơ quan cấp GPLX và địa chỉ thường trú.
6. [`EmergencyContactsSection.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/EmergencyContactsSection.tsx): Khối 2 gồm 2 kênh liên lạc khẩn cấp 24/7 (Điều phối đội xe + Người thân gia đình).
7. [`EnterpriseInvoiceSection.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/EnterpriseInvoiceSection.tsx): Khối 3 cấu hình xuất hóa đơn VAT điện tử (Tên công ty, MST, Email kế toán, mẫu số hóa đơn, chuẩn ký số Viettel-CA).
8. [`ProfileActionsBar.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ProfileActionsBar.tsx): Mốc thời gian cập nhật gần nhất, nút khôi phục dữ liệu gốc và nút lưu thay đổi hồ sơ.
9. [`ChangePasswordModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ChangePasswordModal.tsx): Hộp thoại đổi mật khẩu 3 trường an toàn kết nối `POST /api/v1/users/me/password`.
10. [`NotificationSettingsModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/NotificationSettingsModal.tsx): Hộp thoại bật/tắt nhận SMS slot, Push App và Email XML+PDF.
11. [`AvatarUploadModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/AvatarUploadModal.tsx): Hộp thoại xem trước và tải lên ảnh định danh chân dung mới.
12. [`ProfileSkeleton.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ProfileSkeleton.tsx): Shimmer loading bảo toàn layout 4 cột + 8 cột.

---

## 3. Tinh Chỉnh Bổ Sung Cho SCR-020 (Danh Mục Phương Tiện Quản Lý)
- Chuẩn hóa layout bảng phương tiện thành `table-fixed` với tỷ lệ cột cố định (`24%`, `23%`, `15%`, `14%`, `12%`, `12%`), loại bỏ triệt để thanh cuộn ngang (horizontal scrollbar) trên desktop.
- Khớp 100% nội dung cột theo mẫu thực tế:
  - Cột 1: Biển số, badge Mặc định / Rơ-moóc / Dự phòng, Tên xe, Xuất xứ & Đời xe.
  - Cột 2: Cấu hình quy cách, tổ hợp reefer/dry, tag điện 3-pha bãi, dải nhiệt.
  - Cột 3: Tải trọng trục (bản thân, kéo theo in đậm màu cam, cấu hình trục).
  - Cột 4: Hạn kiểm định (badge đen, số tháng còn lại, số bảo hiểm/tem kiểm định).
  - Cột 5: Barie ALPR (chấm xanh + ĐỒNG BỘ 100%, chi tiết nhận diện).
  - Cột 6: Thao tác (nút "Chọn mặc định" cho xe phụ, icon Sửa, Xem chi tiết, Xóa).
- Đồng bộ hóa modal "Khai Báo Hồ Sơ Vận Hành" (`RegisterVehicleModal.tsx`) với nút cam 100% chiều rộng `+ Đăng Ký & Đồng Bộ ALPR` và form 2 cột đối xứng.
- Tinh chỉnh nút `+ ĐĂNG KÝ PHƯƠNG TIỆN MỚI` bo góc mềm mại chuẩn UI.

---

## 4. Báo Cáo Quality Gate
- **TypeScript**: `tsc --noEmit` -> 0 lỗi.
- **ESLint**: `eslint .` -> 0 cảnh báo, 0 lỗi.
- **Vitest Unit Tests**: 73/73 tests passed (100% pass rate across 9 suites).
- **Vite Production Build**: `tsc -b && vite build` -> Hoàn thành thành công trong 7.87s.

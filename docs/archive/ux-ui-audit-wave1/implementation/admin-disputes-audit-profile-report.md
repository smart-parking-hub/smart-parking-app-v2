# Báo Cáo Triển Khai Cải Thiện UX/UI: Nhóm 12 (Admin Disputes Docket, Audit Trail & Security Profile)

> **Mã công việc:** IMPLEMENT-GRP-12  
> **Nhóm màn hình:** Nhóm 12: Admin Disputes Docket, Audit Trail & Security Profile  
> **Thời gian thực hiện:** Tháng 11/2026  
> **Phạm vi triển khai & nghiệm thu:**  
> - `/admin/disputes` (`SCR-049` — Sổ Tiếp Nhận Trọng Tài Khiếu Nại Toàn Hệ Thống)  
> - `/admin/disputes/:id` (`SCR-050` — Phòng Phân Xử Trọng Tài & Ban Hành Phán Quyết Khiếu Nại)  
> - `/admin/audit-logs` (`SCR-051` — Nhật Ký Kiểm Toán An Ninh Bất Biến Toàn Hệ Thống)  
> - `/admin/notifications` (`SCR-052` — Trung Tâm Thông Báo Quản Trị Hệ Thống)  
> - `/admin/profile` (`SCR-053` — Hồ Sơ Bảo Mật & Thông Tin Quản Trị Viên)  
> - `/merchant/disputes` (`SCR-039` — Sổ Theo Dõi Khiếu Nại Bãi Đỗ Của Chủ Bãi)  
> - `/merchant/disputes/:id` (`SCR-040` — Chi Tiết Khiếu Nại & Giải Trình Phía Chủ Bãi)  
>
> **Tiêu chuẩn tuân thủ:** MASTER INSTRUCTIONS · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Vitest · ESLint

---

## 1. Tổng Quan Kết Quả Triển Khai

Giai đoạn triển khai Nhóm 12 đã hoàn thiện trọn vẹn quy trình trọng tài phân xử tranh chấp toàn hệ thống, tối ưu hóa giao diện di động cho bảng kiểm toán an ninh bất biến, củng cố bảo mật hồ sơ Admin và chuẩn hóa toàn bộ nút bấm hành động theo token cam thương hiệu chữ trắng:

| Mã Issue / Task | Mức Độ | Màn Hình / Component | Hiện Trạng Trước Khi Sửa | Giải Pháp Kỹ Thuật Đã Triển Khai | Trạng Thái Sau Sửa |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **Arbitration-Verdict-Workflow-Polish (AC1)** | **P1 HIGH** | `/admin/disputes/:id` (`DisputeDetail`), `ResolveDispute` | Quy trình ban hành phán quyết chưa có cơ chế chống bấm trùng (double-click guard), nút bấm chưa tuân thủ token cam thương hiệu, thiếu trạng thái đang xử lý (`aria-busy`, "Đang ban hành phán quyết…"). | Nâng cấp `ResolveDispute` với form validation chặt chẽ (resolution bắt buộc), chống double-click (`if (mutation.isPending) return`), `aria-busy` và loading indicator. Nút kích hoạt và nút xác nhận đổi sang `bg-[#d95f00] text-white hover:bg-[#b84e00] shadow-xs`. Khi lưu thành công, hệ thống tự động refetch và hiển thị trạng thái `RESOLVED` ("Đã giải quyết") cùng nội dung phán quyết trong bảng kết quả. | **ĐÃ HOÀN TẤT TRIỆT ĐỂ** |
| **Immutable-Log-Card-View / TSK-P1-03 (AC2)** | **P1 HIGH** | `/admin/audit-logs` (`AdminAuditLogsPage`), `DataTable` | Bảng nhật ký kiểm toán an ninh trên thiết bị di động (`< 768px`) bị cuộn ngang kéo dài, gây khó khăn cho quản trị viên khi duyệt nhanh vết kiểm toán trên điện thoại/máy tính bảng nhỏ. | Bổ sung cơ chế `renderMobileCard` vào `DataTable` (kết hợp `md:hidden` và `hidden md:block`). Trong `AdminAuditLogsPage`, định nghĩa thẻ Card View di động hiển thị nổi bật Actor ID (`Actor #${r.actorUserId}`), nhãn hành động (`{r.action}`), đối tượng (`${r.targetType} #${r.targetId}`), hộp chi tiết thao tác và huy hiệu kết quả hành động (`<Badge value={r.result} />`). | **ĐÃ TỐI ƯU HOÀN TOÀN** |
| **TSK-P2-03 / Button-Harmonization (AC3)** | **P2 MEDIUM** | Toàn bộ các màn hình Nhóm 12 | Các nút bấm hành động phân tán về phong cách, một số nút dùng class cũ hoặc màu xanh xám chưa đồng bộ hệ thống. | Chuẩn hóa toàn bộ nút chính sang chuẩn cam chữ trắng `bg-[#d95f00] text-white hover:bg-[#b84e00] active:bg-[#9e4300] shadow-xs`: nút gửi khiếu nại tài xế, nút ban hành phán quyết admin, nút "Đánh dấu tất cả đã đọc" thông báo, nút "Lưu hồ sơ" và "Cập nhật mật khẩu" hồ sơ Admin. | **ĐÃ ĐỒNG BỘ 100%** |
| **Merchant Dispute Inspection Parity** | **P2 MEDIUM** | `/merchant/disputes`, `/merchant/disputes/:id` | Chủ bãi cần theo dõi tình hình khiếu nại phát sinh từ bãi xe của mình nhưng không được phép tự ban hành phán quyết trọng tài. | Bảo toàn phân quyền RBAC: Chủ bãi xem được chi tiết khiếu nại, phản ánh của tài xế và phán quyết giải quyết từ Admin, ẩn hoàn toàn nút can thiệp phán quyết `Ghi nhận phán quyết`. | **ĐÃ BẢO TOÀN PARITY** |

---

## 2. Chi Tiết Các Tệp Mã Nguồn Đã Chỉnh Sửa & Bổ Sung

### 2.1. `src/shared/components/Workspace.tsx` (`DataTable`)
- Mở rộng giao diện `DataTable` hỗ trợ thuộc tính tùy chọn `renderMobileCard?: (row: T) => ReactNode`.
- Tối ưu hóa layout đa điểm nhìn:
  - Khi có `renderMobileCard` và có dữ liệu: render khối thẻ di động trong `<div className="space-y-3 md:hidden">`, đồng thời ẩn bảng trên mobile với `<div className="overflow-x-auto hidden md:block">`.
  - Tối ưu hóa trạng thái trống (empty state): chỉ xuất hiện duy nhất 1 thông báo `"Không có dữ liệu phù hợp."` trên toàn trang, ngăn ngừa lỗi trùng lặp text node trên DOM.

### 2.2. `src/features/disputes/index.tsx`
- **Tài xế & Khởi tạo khiếu nại:**
  - Nút "+ Gửi khiếu nại": chuyển sang chuẩn cam `bg-[#d95f00] text-white hover:bg-[#b84e00] shadow-xs`.
  - Hộp thoại `CreateDispute`: bổ sung nút "Hủy", nút gửi cam chữ trắng kèm trạng thái `{mutation.isPending ? 'Đang gửi…' : 'Gửi khiếu nại'}` và bảo vệ chống submit liên tục.
- **Phòng phân xử Admin (`DisputeDetail` & `ResolveDispute`):**
  - Nút "Ghi nhận phán quyết": hiển thị nổi bật với cam chữ trắng tại panel thông tin liên quan khi hồ sơ chưa `RESOLVED`.
  - Hộp thoại `ResolveDispute`: bổ sung form validation (bắt buộc nhập `resolution`), bảo vệ submit trùng lặp, thông báo hướng dẫn trọng tài, nút "Hủy" và nút submit `bg-[#d95f00] text-white` với text loading `"Đang ban hành phán quyết…"`.
  - Cột mã hồ sơ (`KN-{id}`) và mã booking (`#{bookingId}`) trong danh sách áp dụng `tabular-nums font-mono font-semibold` căn phải chính xác.

### 2.3. `src/features/admin/index.tsx`
- **`AdminList`:** Hỗ trợ nhận và truyền `renderMobileCard` xuống `DataTable`.
- **`AdminAuditLogsPage`:**
  - Thiết kế `renderMobileCard` hiển thị dạng card độc lập trên thiết bị di động:
    - Hàng 1: `Actor #{actorUserId}` + badge hành động `action` + badge kết quả `result` (`Thành công` / `Thất bại`).
    - Hàng 2: Đối tượng bị tác động (`targetType #targetId`) + thời gian thao tác `date(createdAt)`.
    - Hàng 3: Hộp chi tiết thao tác có viền và background dịu mắt.
  - Cột máy tính để bàn (Desktop Table): bổ sung font mono cho Actor ID, badge nền xám cho `action`, badge trạng thái cho `result`.

### 2.4. `src/features/portal/AccountPages.tsx` (`PortalNotificationsPage`)
- Nút "Đánh dấu tất cả đã đọc" tại header được chuyển sang chuẩn cam thương hiệu chữ trắng `bg-[#d95f00] text-white hover:bg-[#b84e00] shadow-xs`.
- Giữ nguyên cơ chế loading spinner (`Loader2 animate-spin`) và chống click lặp lại khi request đang được xử lý.

### 2.5. `src/features/admin/pages/AdminProfilePage.tsx`
- Chuẩn hóa nút submit "Lưu hồ sơ" sang `bg-[#d95f00] text-white hover:bg-[#b84e00]` kèm `aria-busy` và loading text `"Đang lưu…"`.
- Chuẩn hóa nút submit "Cập nhật mật khẩu" sang `bg-[#d95f00] text-white hover:bg-[#b84e00]` kèm `aria-busy` và loading text `"Đang cập nhật…"`.
- Bổ sung double-click guard trên cả 2 form xử lý (`if (save.isPending) return`, `if (change.isPending) return`).
- Chuẩn hóa định dạng file về UTF-8 LF đồng bộ với toàn bộ kho mã nguồn.

### 2.6. `src/features/admin/__tests__/AdminDisputesAuditProfile.test.tsx` (Tạo mới)
- Xây dựng 8 kịch bản kiểm thử tự động toàn diện:
  1. `AdminDisputesPage`: Render sổ tiếp nhận tranh chấp với mã `KN-10`, `Booking #50`, lý do và badge trạng thái `Chờ xử lý`.
  2. `AdminDisputeDetail (AC1)`: Admin mở chi tiết, bấm "Ghi nhận phán quyết", nhập kết luận phân xử, ban hành phán quyết qua `PUT /api/v1/disputes/10/resolve` và cập nhật giao diện sang `Đã giải quyết` (`RESOLVED`).
  3. `ResolveDispute Validation`: Kiểm chứng validation bắt buộc phải nhập nội dung giải quyết trước khi gửi.
  4. `MerchantDisputesPage`: Truy vấn đúng endpoint `/api/v1/disputes/merchant` và render danh sách cho chủ bãi.
  5. `MerchantDisputeDetail`: Render chi tiết tranh chấp và phán quyết giải quyết, đồng thời ẩn nút can thiệp phán quyết của Admin.
  6. `AdminAuditLogsPage (AC2)`: Render nhật ký kiểm toán trên cả desktop table và mobile card view với Actor ID, thời gian và huy hiệu kết quả `Thành công`.
  7. `PortalNotificationsPage (AC3)`: Nút "Đánh dấu tất cả đã đọc" mang màu cam thương hiệu và kích hoạt `PUT /api/v1/notifications/read-all`.
  8. `AdminProfilePage (AC3)`: Các nút "Lưu hồ sơ" và "Cập nhật mật khẩu" mang chuẩn cam chữ trắng và gửi dữ liệu thành công qua API.
- Kết quả kiểm thử: **8/8 test cases PASS 100%**.

---

## 3. Kết Quả Kiểm Tra Chất Lượng (Quality Gates Verification)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BÁO CÁO KIỂM THỬ TỰ ĐỘNG ZERO REGRESSION (NHÓM 12)                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. TypeScript Compile (tsc --noEmit):    0 LỖI (PASS 100%)             │
│ 2. ESLint Static Analysis (eslint .):    0 ERRORS, 0 WARNINGS (PASS)   │
│ 3. Vitest Unit & Integration Tests:      41/41 TEST SUITES PASS        │
│                                          310/310 TESTS PASS (100%)     │
│ 4. Vite Production Build (tsc -b & vite):BUILT IN 19.94s (2579 modules)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Kiểm Thử Luồng Thao Tác (Workflow Checks)

1. **Luồng Trọng Tài Phân Xử Khiếu Nại Toàn Hệ Thống:**
   - Admin truy cập `/admin/disputes` → Chọn hồ sơ khiếu nại `KN-10` → Chuyển sang `/admin/disputes/10`.
   - Xem thông tin booking, tài xế, chủ bãi và phản ánh ban đầu.
   - Bấm nút cam "Ghi nhận phán quyết" → Modal mở ra → Nhập phương án giải quyết và bồi hoàn → Nhấn "Xác nhận phán quyết".
   - API `PUT /api/v1/disputes/10/resolve` hoàn tất → Modal đóng → Query cache tự động refresh → Badge chuyển sang xanh lục `Đã giải quyết` (`RESOLVED`) → Khung kết quả hiển thị văn bản phán quyết rõ ràng.
2. **Luồng Kiểm Toán An Ninh Đa Thiết Bị:**
   - Màn hình Desktop: Hiển thị bảng kiểm toán đầy đủ với các thẻ căn chỉnh chuẩn mực, cột Actor ID và Action nổi bật.
   - Màn hình Mobile (viewport `< 768px`): Tự động chuyển đổi sang Card View độc lập, hiển thị rõ ràng từng thao tác nhạy cảm của quản trị viên mà không cần quẹt cuộn ngang.
3. **Luồng Quản Trị Hồ Sơ Bảo Mật:**
   - Admin truy cập `/admin/profile` → Cập nhật thông tin liên hệ khẩn cấp → Nhấn "Lưu hồ sơ" → Toast thông báo thành công.
   - Nhập mật khẩu hiện tại và mật khẩu mới → Nhấn "Cập nhật mật khẩu" → Form tự động reset an toàn.

---

## 5. Kết Luận & Đề Xuất Tiếp Theo

- Nhóm 12 đã **hoàn thành 100% các tiêu chí nghiệm thu (AC1, AC2, AC3)** và đạt tiêu chuẩn sản xuất cao nhất.
- Toàn bộ 41 bộ test và 310 unit tests trong kho mã nguồn đều vượt qua thành công với Zero Regression.
- Đã sẵn sàng commit và push lên nhánh `main`, sau đó dừng lại chờ người phụ trách phê duyệt trước khi chuyển sang **Nhóm 13: Authentication & Access Control Guards Hardening**.

# Danh Mục Đặc Tả Nhóm Màn Hình Cổng Quản Trị Viên (SCR-042 đến SCR-053)

Phân hệ Quản trị viên hệ thống (Admin Portal) bao gồm 12 màn hình nghiệp vụ chuyên sâu, được đặc tả chi tiết tại các tài liệu độc lập theo chuẩn Discovery Master Prompt:

---

## Danh Sách Chi Tiết Các Màn Hình

| Mã Màn Hình | Tên Màn Hình | URL Route | Tài Liệu Đặc Tả Chi Tiết |
|---|---|---|---|
| `SCR-042` | `AdminDashboardPage` | `/admin/dashboard` | [SCR-042-admin-dashboard.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-042-admin-dashboard.md) |
| `SCR-043` | `AdminParkingLotsPage` | `/admin/parking-lots` | [SCR-043-admin-parking-lots.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-043-admin-parking-lots.md) |
| `SCR-044` | `AdminParkingLotDetailPage` | `/admin/parking-lots/:parkingLotId` | [SCR-044-admin-parking-lot-detail.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-044-admin-parking-lot-detail.md) |
| `SCR-045` | `AdminUsersPage` | `/admin/users` | [SCR-045-admin-users.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-045-admin-users.md) |
| `SCR-046` | `AdminUserDetailPage` | `/admin/users/:userId` | [SCR-046-admin-user-detail.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-046-admin-user-detail.md) |
| `SCR-047` | `AdminTransactionsPage` | `/admin/transactions` | [SCR-047-admin-transactions.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-047-admin-transactions.md) |
| `SCR-048` | `AdminWithdrawalsPage` | `/admin/withdrawals` | [SCR-048-admin-withdrawals.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-048-admin-withdrawals.md) |
| `SCR-049` | `AdminDisputesPage` | `/admin/disputes` | [SCR-049-admin-disputes.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-049-admin-disputes.md) |
| `SCR-050` | `AdminDisputeDetailPage` | `/admin/disputes/:disputeId` | [SCR-050-admin-dispute-detail.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-050-admin-dispute-detail.md) |
| `SCR-051` | `AdminAuditLogsPage` | `/admin/audit-logs` | [SCR-051-admin-audit-logs.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-051-admin-audit-logs.md) |
| `SCR-052` | `AdminNotificationsPage` | `/admin/notifications` | [SCR-052-admin-notifications.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-052-admin-notifications.md) |
| `SCR-053` | `AdminProfilePage` | `/admin/profile` | [SCR-053-admin-profile.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-053-admin-profile.md) |

---

## Tóm Lược Nhóm Màn Hình

1. **Nhóm Vận Hành Vĩ Mô & Sự Kiện:** `SCR-042` (Dashboard tổng quan toàn sàn), `SCR-052` (Luồng thông báo sự kiện hệ thống), `SCR-053` (Hồ sơ phiên bảo mật Admin).
2. **Nhóm Thẩm Định Bãi Đỗ:** `SCR-043` (Hàng đợi kiểm duyệt bãi), `SCR-044` (Bàn thẩm định chi tiết kèm bản đồ Leaflet OSM và thư viện ảnh lightbox).
3. **Nhóm Kiểm Soát Người Dùng:** `SCR-045` (Danh bạ tài khoản đa vai trò), `SCR-046` (Hồ sơ người dùng kèm chế tài Khóa/Mở khóa tài khoản).
4. **Nhóm Quản Trị Tài Chính & Đối Soát:** `SCR-047` (Nhật ký giao dịch cổng thanh toán), `SCR-048` (Bàn duyệt chi rút tiền Merchant kèm cơ chế tự động hoàn ví).
5. **Nhóm Trọng Tài & An Ninh Tuân Thủ:** `SCR-049` (Hàng đợi khiếu nại tài xế - chủ bãi), `SCR-050` (Bàn thụ lý ban hành phán quyết tranh chấp), `SCR-051` (Sổ cái kiểm toán bất biến Audit Trail).

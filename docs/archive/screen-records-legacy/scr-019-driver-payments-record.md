# Screen Implementation Record: SCR-019 Driver Payment History & VAT Invoices

- Screen: `SCR-019 Driver Payment History & VAT Invoices (Lịch sử thanh toán & Hóa đơn điện tử VAT)`
- Route: `/payments`, `/dashboard/payments`, `/driver/payments`
- Owning feature: `features/payments`
- Stitch source supplied: Yes (`SmartTruckHub Driver Ops - Driver Payment History` HTML/CSS)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_DRIVER`
- Layout: `DriverLayout` (Kế thừa header cố định 68px, active state tại `/payments`)
- Git branch: `feat/scr-19-driver-payments`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Context Ticker | Huy hiệu đồng bộ thời gian thực Tổng Cục Thuế Thông tư 78, Mã đơn vị vận tải VTP-VN-51C-LOGISTICS, MST công ty | `PaymentsCommandHeader.tsx` | Verified |
| Header & CTA | Eyebrow "Sổ cái chi phí & đối soát hóa đơn", Title, 2 nút CTA cấu hình hóa đơn và xuất báo cáo | `PaymentsCommandHeader.tsx` | Verified |
| Financial Metrics Bento | 4 Thẻ Bento tài chính Zero-Green: Tổng chi phí tháng, Tiền cọc đã hoàn trả, Phạt quá giờ, HĐĐT VAT đồng bộ | `FinancialMetricsBento.tsx` | Verified |
| Filter & Search Matrix | Ô tìm kiếm đa trường, badge kỳ đối soát Tháng 02/2026, 5 tag phân loại chi phí, 2 tag trạng thái | `TransactionFilterToolbar.tsx` | Verified |
| Master Transaction Table | Bảng kê 8 cột chi tiết với hover highlight, badge TT78, nút PDF VAT / Phiếu thu, phân trang đầy đủ | `MasterTransactionTable.tsx` | Verified |
| Receipt Inspector Panel | Chi tiết biên lai điện tử 7 cột: Đơn vị thụ hưởng, MST, Berth 114, Bảng kê phụ phí điện lạnh 380V, nút Tải PDF, Gửi email | `ReceiptInspectorPanel.tsx` | Verified |
| Enterprise Accounting | Panel đồng bộ hóa đơn với phần mềm MISA/FAST và quy định hoàn cọc tự động 10 phút qua ALPR | `EnterpriseAccountingPanel.tsx` | Verified |
| Company Invoice Modal | Hộp thoại cấu hình xuất hóa đơn doanh nghiệp: MST, Tên cty, Email kế toán, đính kèm XML gốc | `CompanyInvoiceConfigModal.tsx` | Verified |
| Export Report Modal | Hộp thoại xuất báo cáo sổ cái đối soát định dạng Excel (.xlsx) hoặc văn bản PDF có chữ ký số | `ExportReportModal.tsx` | Verified |
| Send Receipt Email Modal | Hộp thoại gửi biên lai và hóa đơn VAT trực tiếp tới hòm thư kế toán trưởng | `SendReceiptEmailModal.tsx` | Verified |
| Loading Skeleton | Shimmer loading đồng bộ cấu trúc trang | `PaymentsSkeleton.tsx` | Verified |

## Component Reusability & Placement Assessment
| Component | Classification | Destination Directory | Rationale |
|---|---|---|---|
| `PaymentsCommandHeader` | Feature-specific | `src/features/payments/components/` | Header phân hệ và ticker CQT Thông tư 78 |
| `FinancialMetricsBento` | Feature-specific | `src/features/payments/components/` | 4 thẻ Bento thống kê tài chính dành riêng cho lái xe |
| `TransactionFilterToolbar` | Feature-specific | `src/features/payments/components/` | Thanh lọc tìm kiếm và phân loại chi phí chuyên biệt |
| `MasterTransactionTable` | Feature-specific | `src/features/payments/components/` | Bảng kê giao dịch chi tiết hỗ trợ chọn dòng và phân trang |
| `ReceiptInspectorPanel` | Feature-specific | `src/features/payments/components/` | Thanh tra biên lai chi tiết với bóc tách chi phí điện lạnh & VAT |
| `EnterpriseAccountingPanel` | Feature-specific | `src/features/payments/components/` | Khối đồng bộ kế toán MISA/FAST và chính sách cọc |
| `CompanyInvoiceConfigModal` | Feature-specific | `src/features/payments/components/` | Hộp thoại cấu hình doanh nghiệp cho tài xế |
| `ExportReportModal` | Feature-specific | `src/features/payments/components/` | Hộp thoại xuất báo cáo chi phí Excel / PDF |
| `SendReceiptEmailModal` | Feature-specific | `src/features/payments/components/` | Hộp thoại gửi email hóa đơn cho kế toán |
| `PaymentsSkeleton` | Feature-specific | `src/features/payments/components/` | Placeholder loading cho module payments |

## Verification Gate (100% Zero-Error & Zero-Warning)
- [x] Typecheck: `npm run typecheck` (`tsc --noEmit`) -> **0 Errors**
- [x] Lint: `npm run lint` (`eslint .`) -> **0 Errors, 0 Warnings**
- [x] Unit/component tests: `npm run test` (`vitest run`) -> **53/53 Tests Passed (100% across all 7 test suites)**
- [x] Build: `npm run build` (`tsc -b && vite build`) -> **Built successfully in 7.78s**
- [x] Layout integrity: Kế thừa `DriverLayout`, tự động active tab "Lịch sử cước" trên header navigation
- [x] Git branch: Cô lập hoàn toàn trên nhánh độc lập `feat/scr-19-driver-payments`

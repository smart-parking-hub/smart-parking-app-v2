# Screen Implementation Record: SCR-020 Driver Vehicles Management & Fleet Operations

- Screen: `SCR-020 Driver Vehicles Management & Fleet Operations (Quản lý phương tiện của tôi & Đồng bộ ALPR)`
- Route: `/vehicles`, `/dashboard/vehicles`, `/driver/vehicles`
- Owning feature: `features/vehicles`
- Stitch source supplied: Yes (`SmartTruckHub Driver Ops - Driver Vehicles Management` HTML/CSS)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_DRIVER`
- Layout: `DriverLayout` (Kế thừa header cố định 68px, active state tại `/vehicles`)
- Git branch: `feat/scr-20-driver-vehicles`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Context Ticker | Dải ticker cổng kiểm soát đăng kiểm & ALPR Gateway v3.8-TLS trực tuyến 100%, đồng bộ Cục Đăng Kiểm & Cát Lái/Tân Cảng | `VehiclesCommandHeader.tsx` | Verified |
| Header & CTA | Eyebrow "ĐỘI XE VẬN TẢI THƯƠNG MẠI", Title H1, nút Xuất danh sách đội xe và nút + Đăng ký phương tiện mới | `VehiclesCommandHeader.tsx` | Verified |
| Bento Fleet KPI | 4 Thẻ Bento KPI: Tổng số xe (3 xe: 2 đầu kéo, 1 rơ-moóc), Xe mặc định vận hành (51D-894.12), Xác thực ALPR & Đăng kiểm (100%), Tổng tải trọng lưu hành (48.5 Tấn) | `VehiclesKpiBento.tsx` | Verified |
| Filter & Search Matrix | Ô tìm kiếm đa trường (biển số, nhãn hiệu...), dropdown phân loại (Đầu kéo, Rơ-moóc, Xe tải nặng), dropdown trạng thái, nút reset | `VehicleFilterToolbar.tsx` | Verified |
| Master Vehicle Table | Bảng 6 cột toàn màn hình (full-width), kiểu chữ to rõ ràng, ngăn ngắt dòng chữ với whitespace-nowrap cho biển số, tải trọng, hạn KĐ, ALPR và thao tác | `VehicleMasterTable.tsx` | Verified |
| ALPR Gate Sync Banner | Banner cam kết đồng bộ ALPR tại trạm cân & barie với tốc độ mở gate ≤ 0.2 Giây | `AlprGateSyncBanner.tsx` | Verified |
| Register Vehicle Modal | Hộp thoại modal khai báo hồ sơ xe mới (mở ra khi ấn nút + Đăng ký phương tiện mới): Biển số KKS, Phân loại kỹ thuật, Tải trọng, Model & Năm SX, AI OCR sổ đăng kiểm, Checkbox mặc định | `RegisterVehicleModal.tsx` | Verified |
| Edit Vehicle Modal | Hộp thoại cập nhật thông tin xe (SCR-MOD-04) với các trường kỹ thuật, trọng tải và trạng thái vận hành | `EditVehicleModal.tsx` | Verified |
| View Inspection Dossier Modal | Hộp thoại xem hồ sơ kỹ thuật & kiểm định quốc gia: Số sổ KĐ, Hạn hiệu lực, Tải trọng trục, Số khung VIN, Số máy, BH TNDS bắt buộc, Nút In phiếu kiểm định | `ViewInspectionDossierModal.tsx` | Verified |
| Delete Vehicle Confirm Modal | Hộp thoại xác nhận hủy liên kết phương tiện (soft delete an toàn, chặn xóa xe mặc định với tooltip giải thích) | `DeleteVehicleConfirmModal.tsx` | Verified |
| Export Fleet Modal | Hộp thoại xuất danh sách đội xe định dạng Excel (.xlsx), PDF Manifest hoặc CSV phục vụ đối soát cảng | `ExportFleetModal.tsx` | Verified |
| Loading Skeleton | Shimmer loading đồng bộ cấu trúc trang 8 cols table + 4 cols form panel | `VehiclesSkeleton.tsx` | Verified |

## Component Reusability & Placement Assessment
| Component | Classification | Destination Directory | Rationale |
|---|---|---|---|
| `vehicleTypes.ts` | Feature-specific | `src/features/vehicles/types/` | Kiểu dữ liệu đặc thù cho phương tiện vận tải và đăng kiểm |
| `vehicleApi.ts` | Feature-specific | `src/features/vehicles/api/` | Gọi API `/api/v1/vehicles` và dữ liệu fallback bám sát thực địa |
| `VehiclesCommandHeader` | Feature-specific | `src/features/vehicles/components/` | Header phân hệ và dải ticker ALPR gateway |
| `VehiclesKpiBento` | Feature-specific | `src/features/vehicles/components/` | 4 thẻ Bento chỉ số đội xe |
| `VehicleFilterToolbar` | Feature-specific | `src/features/vehicles/components/` | Bộ lọc tìm kiếm và phân loại phương tiện |
| `VehicleMasterTable` | Feature-specific | `src/features/vehicles/components/` | Bảng quản lý đội xe thực chiến |
| `AlprGateSyncBanner` | Feature-specific | `src/features/vehicles/components/` | Banner kiểm định ALPR tại trạm cân & barie |
| `RegisterVehicleFormPanel` | Feature-specific | `src/features/vehicles/components/` | Form khai báo hồ sơ xe mới inline |
| `EditVehicleModal` | Feature-specific | `src/features/vehicles/components/` | Hộp thoại cập nhật phương tiện (SCR-MOD-04) |
| `ViewInspectionDossierModal` | Feature-specific | `src/features/vehicles/components/` | Hộp thoại xem hồ sơ kiểm định quốc gia |
| `DeleteVehicleConfirmModal` | Feature-specific | `src/features/vehicles/components/` | Hộp thoại xác nhận xóa xe an toàn |
| `ExportFleetModal` | Feature-specific | `src/features/vehicles/components/` | Hộp thoại xuất danh sách đội xe |
| `VehiclesSkeleton` | Feature-specific | `src/features/vehicles/components/` | Shimmer loading placeholder |
| `VehiclesPage` | Feature-specific | `src/features/vehicles/pages/` | Trang quản lý đội xe trung tâm |

## Verification Gate (100% Zero-Error & Zero-Warning)
- [x] Typecheck: `npm run typecheck` (`tsc --noEmit`) -> **0 Errors**
- [x] Lint: `npm run lint` (`eslint .`) -> **0 Errors, 0 Warnings**
- [x] Unit/component tests: `npm run test` (`vitest run`) -> **63/63 Tests Passed (100% across all 8 test suites)**
- [x] Build: `npm run build` (`tsc -b && vite build`) -> **Built successfully in 8.13s**
- [x] Layout integrity: Kế thừa `DriverLayout`, tự động active tab "Đội xe của tôi" trên header navigation
- [x] Git branch: Cô lập hoàn toàn trên nhánh độc lập `feat/scr-20-driver-vehicles`

import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Circle,
  ShieldCheck,
  Info,
  Sliders,
  DollarSign,
  QrCode,
  FileText,
  FileEdit,
  Headset,
  Truck,
  Zap,
  Scale,
  Camera,
  Shield,
  Droplets,
  Layers,
  Video,
  ShowerHead,
  Utensils,
  Fuel,
  Flame,
  Router,
} from 'lucide-react'
import type { MerchantParkingLotCardData } from '../types/merchantParkingLotTypes'

interface MerchantParkingLotCardItemProps {
  lot: MerchantParkingLotCardData
  onContactSupport: (lotCode: string) => void
}

const AMENITY_ICONS: Record<string, typeof Zap> = {
  Zap,
  Scale,
  Camera,
  Shield,
  Droplets,
  Layers,
  Video,
  ShowerHead,
  Utensils,
  Fuel,
  FileCheck: ShieldCheck,
  Flame,
  Router,
}

export function MerchantParkingLotCardItem({
  lot,
  onContactSupport,
}: MerchantParkingLotCardItemProps) {
  const navigate = useNavigate()

  const isApproved = lot.status === 'APPROVED'
  const isPending = lot.status === 'PENDING_APPROVAL'

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val)
  }

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col transition-all hover:shadow-xs">
      {/* Card Strip Header */}
      <div className="p-4 sm:p-5 lg:p-6 bg-[#eff4ff]/80 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {isApproved ? (
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold uppercase rounded-md border border-emerald-300">
                ĐÃ PHÊ DUYỆT (APPROVED)
              </span>
            ) : isPending ? (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-mono text-[11px] font-bold uppercase rounded-md border border-amber-300">
                ĐANG CHỜ DUYỆT (PENDING_APPROVAL)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 font-mono text-[11px] font-bold uppercase rounded-md">
                {lot.status}
              </span>
            )}

            <span className="font-mono text-xs text-slate-500 font-bold tracking-wider">
              MÃ BÃI: {lot.code}
            </span>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <span className="font-mono text-[11px] text-[#455f87] flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#455f87]" />
              {lot.gateSystem}
            </span>
          </div>

          <h2 className="font-sora text-base sm:text-lg lg:text-xl font-bold text-[#0d1c2e] mt-0.5">
            {lot.name}
          </h2>

          <div className="flex items-center gap-1.5 text-slate-600 text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-[#455f87] shrink-0" />
            <span className="truncate">{lot.address}</span>
          </div>
        </div>

        {/* Right Header Stats / Pending Badge */}
        {isApproved ? (
          <div className="flex items-center gap-3 self-start lg:self-center shrink-0 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="flex flex-col text-right">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                Doanh thu tháng
              </span>
              <span className="font-sora text-sm sm:text-base font-bold text-[#0d1c2e]">
                {formatCurrency(lot.monthlyRevenue)} ₫
              </span>
            </div>

            <div className="h-7 w-px bg-slate-200" />

            <div className="flex items-center gap-1.5">
              <span className="font-sora text-base font-bold text-[#d95f00]">
                {lot.ratingAverage ? lot.ratingAverage.toFixed(1) : '5.0'}
              </span>
              <div className="flex flex-col text-[10px] font-mono text-slate-500">
                <div className="flex text-amber-500">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </div>
                <span>{lot.reviewCount} lượt</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <Clock className="w-4 h-4 text-[#d95f00]" />
            <span className="font-mono text-xs text-[#0d1c2e] font-bold uppercase">
              Đang Thẩm Định Pháp Lý
            </span>
          </div>
        )}
      </div>

      {/* Main Visual & Specs Grid Split */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Visual & Spot Matrix Indicator (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="relative w-full h-44 sm:h-48 bg-slate-100 overflow-hidden rounded-xl border border-slate-200">
            <img
              src={lot.imageUrl}
              alt={lot.name}
              className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                isPending ? 'grayscale contrast-125' : ''
              }`}
            />
            {isPending && <div className="absolute inset-0 bg-[#131b2e]/25" />}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#131b2e]/90 text-white font-mono text-[10px] sm:text-[11px] uppercase tracking-wider rounded-md backdrop-blur-xs font-semibold">
              {lot.yardTag}
            </div>
          </div>

          {/* Spot Fill Gauge (Only for Approved Yards) */}
          {isApproved ? (
            <div className="bg-[#eff4ff] p-3 sm:p-4 rounded-xl border border-slate-200/60 flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-600">Tải trọng vị trí:</span>
                <span className="font-bold text-[#d95f00]">
                  {lot.usedSlots} / {lot.totalCapacity} Slot đang dùng ({lot.occupancyRate}%)
                </span>
              </div>

              {/* Strip meter */}
              <div className="w-full h-3 bg-slate-200 overflow-hidden rounded-full flex">
                <div
                  className={`h-full transition-all duration-500 ${
                    lot.occupancyRate >= 85 ? 'bg-[#d95f00]' : 'bg-[#455f87]'
                  }`}
                  style={{ width: `${lot.occupancyRate}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Còn trống: {lot.totalCapacity - lot.usedSlots} Slot</span>
                {lot.alertStatus === 'NEAR_FULL' ? (
                  <span className="text-[#d95f00] font-bold uppercase tracking-wider">
                    Cảnh Báo: Sắp Đầy
                  </span>
                ) : (
                  <span className="text-[#455f87] font-semibold uppercase tracking-wider">
                    Hoạt Động Bình Thường
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#eff4ff] p-3 sm:p-4 rounded-xl border border-slate-200/60 flex flex-col gap-1.5">
              <span className="font-mono text-xs text-slate-500 font-semibold uppercase tracking-wider">
                NĂNG LỰC DỰ KIẾN:
              </span>
              <span className="font-sora text-base font-bold text-[#0d1c2e]">
                {lot.totalCapacity} Chỗ Đỗ Container
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Chuyên dụng xe đầu kéo 40FT / 45FT High Cube
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Specs / Compliance & Action Hub (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-5">
          {isApproved ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fleet Standards */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#455f87]" />
                    Quy Chuẩn Phương Tiện Tiếp Nhận
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {lot.supportedFleets.map((fleet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-1.5 shrink-0" />
                        <span className={idx === 0 ? 'font-bold text-[#0d1c2e]' : ''}>{fleet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Amenities */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#455f87]" />
                    Hạ Tầng Kỹ Thuật Bến Bãi
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lot.amenities.map((item, idx) => {
                      const IconComp = AMENITY_ICONS[item.iconName] || ShieldCheck
                      return (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-[#eff4ff] text-[#0d1c2e] font-mono text-[11px] font-medium rounded-lg border border-slate-200/70 flex items-center gap-1.5"
                        >
                          <IconComp className="w-3.5 h-3.5 text-[#455f87]" />
                          <span>{item.label}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Spot Matrix Mini Status Strip */}
              {lot.sections && lot.sections.length > 0 && (
                <div className="bg-[#eff4ff] p-3 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-500">BẢN ĐỒ KHU VỰC:</span>
                    {lot.sections.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white text-[#0d1c2e] font-bold rounded-md border border-slate-200/80 shadow-2xs"
                      >
                        {sec.sectionName}: {sec.usedSlots}/{sec.totalSlots}
                      </span>
                    ))}
                  </div>

                  {lot.systemIntegrationNote && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#455f87] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{lot.systemIntegrationNote}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Pending Approval Compliance Box */
            <div className="bg-[#eff4ff] p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#0d1c2e] font-sora text-sm font-bold">
                <ShieldCheck className="w-5 h-5 text-[#d95f00]" />
                <span>TIẾN TRÌNH THẨM ĐỊNH MẶT BẰNG &amp; HỒ SƠ</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {lot.complianceNotice}
              </p>

              {/* Verification Checklist */}
              {lot.verificationMilestones && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {lot.verificationMilestones.map((m) => (
                    <div
                      key={m.step}
                      className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs"
                    >
                      {m.status === 'COMPLETED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : m.status === 'IN_PROGRESS' ? (
                        <Clock className="w-4 h-4 text-[#d95f00] shrink-0 animate-pulse" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span
                        className={`font-mono text-xs truncate ${
                          m.status === 'IN_PROGRESS'
                            ? 'text-[#d95f00] font-bold'
                            : m.status === 'COMPLETED'
                              ? 'text-[#0d1c2e] font-medium'
                              : 'text-slate-400'
                        }`}
                      >
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Card Actions Hub */}
          <div className="pt-2 flex flex-wrap items-center justify-end gap-2 sm:gap-2.5 border-t border-slate-100">
            {isApproved ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/merchant/parking-lots/${lot.id}`)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-slate-600" />
                  <span>Xem Chi Tiết Bãi</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/merchant/parking-lots/${lot.id}/slots`)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-slate-600" />
                  <span>Cấu Hình Sức Chứa Slot</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/merchant/parking-lots/${lot.id}/pricing`)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-slate-600" />
                  <span>Biểu Phí Niêm Yết</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/merchant/qr-scanner?yardId=${lot.id}`)}
                  className="px-4 py-2 bg-[#d95f00] hover:bg-[#b84e00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Trạm Quét QR Barie</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/merchant/parking-lots/${lot.id}`)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Xem Hồ Sơ Đăng Ký</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/merchant/parking-lots/${lot.id}/edit`)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileEdit className="w-4 h-4 text-slate-600" />
                  <span>Chỉnh Sửa Hồ Sơ Bãi</span>
                </button>

                <button
                  type="button"
                  onClick={() => onContactSupport(lot.code)}
                  className="px-4 py-2 bg-[#131b2e] text-white hover:bg-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Headset className="w-4 h-4 text-[#d95f00]" />
                  <span>Liên Hệ Admin Thẩm Định</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

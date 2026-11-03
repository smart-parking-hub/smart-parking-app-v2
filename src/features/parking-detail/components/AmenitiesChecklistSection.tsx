import {
  Shield,
  Video,
  DoorOpen,
  ShowerHead,
  Wind,
  Zap,
  Scale,
  Utensils,
} from 'lucide-react'
import type { AmenityItem } from '../types/parkingDetailTypes'

interface AmenitiesChecklistSectionProps {
  amenities: AmenityItem[]
}

export function AmenitiesChecklistSection({ amenities }: AmenitiesChecklistSectionProps) {
  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'security':
        return <Shield className="w-6 h-6 text-[#455f87]" />
      case 'videocam':
        return <Video className="w-6 h-6 text-[#455f87]" />
      case 'sensor_occupied':
        return <DoorOpen className="w-6 h-6 text-[#455f87]" />
      case 'shower':
        return <ShowerHead className="w-6 h-6 text-[#455f87]" />
      case 'mode_fan':
        return <Wind className="w-6 h-6 text-[#455f87]" />
      case 'bolt':
        return <Zap className="w-6 h-6 text-[#d95f00]" />
      case 'scale':
        return <Scale className="w-6 h-6 text-[#455f87]" />
      case 'restaurant':
      default:
        return <Utensils className="w-6 h-6 text-[#455f87]" />
    }
  }

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Hạ Tầng Dịch Vụ &amp; Hỗ Trợ Bác Tài
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Trang bị tiêu chuẩn công trường đạt kiểm định an toàn của SmartTruck Network
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        {amenities.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/60 rounded-lg flex flex-col gap-2"
          >
            <div className="p-2 w-fit rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              {getAmenityIcon(item.iconName)}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-snug">
                {item.title}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

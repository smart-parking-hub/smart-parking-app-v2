import { AlertTriangle, PhoneCall, Users, ShieldAlert } from 'lucide-react'

interface EmergencyContactsSectionProps {
  contact1Name: string
  onContact1NameChange: (val: string) => void
  contact1Phone: string
  onContact1PhoneChange: (val: string) => void
  contact2Name: string
  onContact2NameChange: (val: string) => void
  contact2Phone: string
  onContact2PhoneChange: (val: string) => void
}

export function EmergencyContactsSection({
  contact1Name,
  onContact1NameChange,
  contact1Phone,
  onContact1PhoneChange,
  contact2Name,
  onContact2NameChange,
  contact2Phone,
  onContact2PhoneChange,
}: EmergencyContactsSectionProps) {
  return (
    <section className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="font-sora font-bold text-slate-900 text-base md:text-lg">
            2. Liên hệ khẩn cấp trực ban 24/7
          </h3>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 font-bold w-max">
          QUAN TRỌNG KHI SỰ CỐ ĐÊM
        </span>
      </div>

      {/* Guidance Alert Banner */}
      <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
          Bắt buộc cung cấp ít nhất 02 kênh liên lạc khả dụng 24/7. Được ban quản lý bãi sử dụng để liên hệ khẩn cấp trong trường hợp cần di dời xe gấp, phòng chống hỏa hoạn, ngập triều cường hoặc sự cố container tại cầu cảng.
        </p>
      </div>

      {/* 2 Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact 1: Dispatch */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
            <span className="font-mono text-xs font-bold text-slate-800 uppercase">
              LIÊN HỆ KHẨN CẤP 1 (ĐIỀU PHỐI ĐỘI XE)
            </span>
            <PhoneCall className="w-4 h-4 text-orange-600" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact1-name" className="text-xs font-bold font-mono text-slate-700">
              Họ tên &amp; Chức vụ
            </label>
            <input
              id="contact1-name"
              type="text"
              value={contact1Name}
              onChange={(e) => onContact1NameChange(e.target.value)}
              placeholder="VD: Trần Văn Nam (Phó điều phối)"
              className="h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact1-phone" className="text-xs font-bold font-mono text-slate-700">
              Số điện thoại khẩn cấp
            </label>
            <div className="relative">
              <input
                id="contact1-phone"
                type="text"
                value={contact1Phone}
                onChange={(e) => onContact1PhoneChange(e.target.value)}
                placeholder="VD: 0918 239 485"
                className="h-10 pl-3 pr-9 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs md:text-sm text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <PhoneCall className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>
        </div>

        {/* Contact 2: Family */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
            <span className="font-mono text-xs font-bold text-slate-800 uppercase">
              LIÊN HỆ KHẨN CẤP 2 (NGƯỜI THÂN GIA ĐÌNH)
            </span>
            <Users className="w-4 h-4 text-slate-600" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact2-name" className="text-xs font-bold font-mono text-slate-700">
              Họ tên &amp; Mối quan hệ
            </label>
            <input
              id="contact2-name"
              type="text"
              value={contact2Name}
              onChange={(e) => onContact2NameChange(e.target.value)}
              placeholder="VD: Nguyễn Thị Mai (Vợ)"
              className="h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact2-phone" className="text-xs font-bold font-mono text-slate-700">
              Số điện thoại khẩn cấp
            </label>
            <div className="relative">
              <input
                id="contact2-phone"
                type="text"
                value={contact2Phone}
                onChange={(e) => onContact2PhoneChange(e.target.value)}
                placeholder="VD: 0908 776 554"
                className="h-10 pl-3 pr-9 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs md:text-sm text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <PhoneCall className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

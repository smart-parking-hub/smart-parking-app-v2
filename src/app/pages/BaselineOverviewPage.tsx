import { CheckCircle2, Shield, Sparkles, Box, Database, FormInput } from 'lucide-react'

export function BaselineOverviewPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Application Foundation Ready (Deliverable B)
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Smart Parking CRM Hub v2 — Kiến Trúc Nền Tảng
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Hệ thống đã khởi tạo hoàn tất theo chuẩn React 19 + TypeScript Strict + Tailwind CSS v4.
        </p>
      </div>

      {/* Grid thẻ 3 loại State */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Database className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Server State</h3>
          </div>
          <p className="text-xs text-slate-600">
            <strong>TanStack Query v5:</strong> Đảm nhiệm 100% dữ liệu API bất đồng bộ từ microservice, tự động cache và revalidate.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Box className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Global UI State</h3>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Redux Toolkit:</strong> Chỉ lưu trữ trạng thái giao diện toàn cục cần chia sẻ liên module (sidebar, theme).
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <FormInput className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Form State</h3>
          </div>
          <p className="text-xs text-slate-600">
            <strong>React Hook Form + Zod:</strong> Quản lý form nghiệp vụ với type-safe validation và tối ưu hóa re-render.
          </p>
        </div>
      </div>

      {/* Checklist sẵn sàng tiếp nhận Stitch screen */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            Trạng Thái Sẵn Sàng Tiếp Nhận Giao Diện Stitch (Rule 15)
          </h3>
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-sm">
            Active & Enforced
          </span>
        </div>

        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Đã cấu hình Alias path <code>@/*</code> tương thích tuyệt đối cho import sạch sẽ.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Đã tích hợp Tailwind CSS v4 với engine <code>@tailwindcss/vite</code> siêu tốc.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Sẵn sàng tiếp nhận mã HTML/CSS màn hình đầu tiên theo quy trình 8 bước.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

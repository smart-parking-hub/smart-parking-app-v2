import { Link } from 'react-router-dom'

export function AccessPage({ notFound = false }: { notFound?: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy p-8 text-white">
      <div className="max-w-xl">
        <p className="font-mono text-brand-orange text-xs tracking-widest uppercase mb-2">
          SMARTTRUCK / {notFound ? '404' : '403'}
        </p>
        <h1 className="my-4 font-sora text-3xl sm:text-4xl font-bold">
          {notFound ? 'Không tìm thấy trang.' : 'Bạn chưa có quyền truy cập.'}
        </h1>
        <p className="mb-8 text-slate-300 leading-relaxed text-sm sm:text-base">
          {notFound
            ? 'Liên kết có thể đã thay đổi hoặc không tồn tại. Hãy trở về trang chủ để tiếp tục.'
            : 'Đăng nhập bằng tài khoản có vai trò phù hợp hoặc liên hệ quản trị viên.'}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy transition-colors shadow-xs"
            to="/"
          >
            Về trang chủ
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy transition-colors"
            to="/login"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  )
}

import { CheckCircle2 } from 'lucide-react'

interface CreateParkingLotStepperProps {
  currentStep: number // 0, 1, 2
  onStepClick?: (step: number) => void
}

export function CreateParkingLotStepper({ currentStep, onStepClick }: CreateParkingLotStepperProps) {
  const steps = [
    {
      stepIndex: 0,
      labelNumber: '01',
      eyebrowDone: 'Bước 01 · Đã Xác Nhận',
      eyebrowActive: 'Đang Khai Báo Cơ Bản',
      eyebrowPending: 'Chờ Khai Báo',
      title: 'Thông Tin Cơ Bản & Tiện Ích',
    },
    {
      stepIndex: 1,
      labelNumber: '02',
      eyebrowDone: 'Bước 02 · Đã Xác Nhận',
      eyebrowActive: 'Đang Khai Báo Thực Địa',
      eyebrowPending: 'Chờ Tọa Độ GPS',
      title: 'Tọa Độ GPS & Ranh Giới Mặt Bằng',
    },
    {
      stepIndex: 2,
      labelNumber: '03',
      eyebrowDone: 'Bước 03 · Đã Gửi Duyệt',
      eyebrowActive: 'Xác Nhận & Gửi Duyệt',
      eyebrowPending: 'Chờ Thẩm Định Hồ Sơ',
      title: 'Hồ Sơ PCCC & Xác Nhận Gửi Duyệt',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-[#eff4ff] p-2 rounded-xl border border-slate-200/80 select-none">
      {steps.map((item) => {
        const isDone = currentStep > item.stepIndex
        const isActive = currentStep === item.stepIndex

        return (
          <div
            key={item.stepIndex}
            onClick={() => {
              if (isDone && onStepClick) {
                onStepClick(item.stepIndex)
              }
            }}
            className={`flex items-center gap-3 p-3.5 rounded-lg transition-all ${
              isDone
                ? 'bg-white shadow-2xs cursor-pointer hover:bg-slate-50 border border-slate-200/60'
                : isActive
                  ? 'bg-[#0d1c2e] text-white shadow-xs relative overflow-hidden'
                  : 'bg-[#dce9ff]/50 opacity-80 border border-transparent'
            }`}
          >
            {/* Active accent strip */}
            {isActive && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#d95f00]" />}

            {/* Icon / Number badge */}
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 font-mono font-bold text-sm ${
                isDone
                  ? 'bg-[#341100] text-[#d95f00]'
                  : isActive
                    ? 'bg-[#d95f00] text-white ring-2 ring-[#d95f00]/40'
                    : 'bg-[#d5e3fc] text-[#45464d]'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-[#d95f00]" />
              ) : (
                <span>{item.labelNumber}</span>
              )}
            </div>

            {/* Step text */}
            <div className="flex flex-col min-w-0">
              <span
                className={`font-mono text-[11px] uppercase tracking-wider font-bold ${
                  isDone
                    ? 'text-[#d95f00]'
                    : isActive
                      ? 'text-[#ffb690]'
                      : 'text-[#45464d]'
                }`}
              >
                {isDone ? item.eyebrowDone : isActive ? item.eyebrowActive : item.eyebrowPending}
              </span>
              <span
                className={`text-xs sm:text-sm truncate ${
                  isActive ? 'text-white font-bold' : isDone ? 'text-[#0d1c2e] font-semibold' : 'text-[#45464d] font-medium'
                }`}
              >
                {item.title}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

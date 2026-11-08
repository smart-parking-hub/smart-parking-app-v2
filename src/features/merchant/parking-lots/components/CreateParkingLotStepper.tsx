import { Check, ChevronRight } from 'lucide-react'

interface CreateParkingLotStepperProps {
  currentStep: number
  onStepClick?: (step: number) => void
  disabled?: boolean
}

const steps = [
  { title: 'Thông tin bãi đỗ', description: 'Tên, địa chỉ & hình ảnh' },
  { title: 'Vị trí trên bản đồ', description: 'Xác định tọa độ bãi đỗ' },
  { title: 'Kiểm tra & gửi duyệt', description: 'Xác nhận thông tin hồ sơ' },
]

export function CreateParkingLotStepper({ currentStep, onStepClick, disabled }: CreateParkingLotStepperProps) {
  return (
    <nav aria-label="Các bước đăng ký bãi đỗ" className="registration-stepper">
      <ol>
        {steps.map((step, index) => (
          <li key={step.title} data-state={index === currentStep ? 'active' : index < currentStep ? 'done' : 'pending'}>
            <button
              type="button"
              aria-label={`${step.title}${index < currentStep ? ' — Đã hoàn thành, chỉnh sửa' : ''}`}
              aria-current={index === currentStep ? 'step' : undefined}
              disabled={disabled || index >= currentStep || !onStepClick}
              onClick={() => onStepClick?.(index)}
            >
              <span className="registration-step-number" aria-hidden="true">
                {index < currentStep ? <Check size={19} /> : `0${index + 1}`}
              </span>
              <span className="registration-step-copy">
                <strong>{step.title}</strong>
                <span>{index < currentStep ? 'Đã hoàn thành · Chỉnh sửa' : step.description}</span>
              </span>
            </button>
            {index < steps.length - 1 && <ChevronRight className="registration-step-divider" size={18} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}

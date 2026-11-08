import { ArrowLeft, ArrowRight, Save, Check, LoaderCircle } from 'lucide-react'

interface CreateParkingLotActionFooterProps {
  currentStep: number
  submitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  onSaveDraft: () => void
  draftSaved: boolean
}

export function CreateParkingLotActionFooter({ currentStep, submitting, onBack, onNext, onSubmit, onSaveDraft, draftSaved }: CreateParkingLotActionFooterProps) {
  return (
    <footer className="registration-actions">
      <button type="button" onClick={onBack} disabled={submitting} className="registration-button registration-button-quiet">
        <ArrowLeft size={17} />
        {currentStep === 0 ? 'Về danh sách' : 'Quay lại'}
      </button>
      <div className="registration-action-group">
        <button type="button" onClick={onSaveDraft} disabled={submitting} className="registration-button registration-button-secondary">
          {draftSaved ? <Check size={17} /> : <Save size={17} />}
          {draftSaved ? 'Đã lưu nháp' : 'Lưu bản nháp'}
        </button>
        <button
          type="button"
          onClick={currentStep < 2 ? onNext : onSubmit}
          disabled={submitting}
          aria-busy={submitting}
          className="registration-button registration-button-primary"
        >
          {submitting ? <><LoaderCircle size={18} className="animate-spin" /> Đang gửi hồ sơ…</> : <>
            {currentStep === 0 ? 'Tiếp tục: Vị trí bãi đỗ' : currentStep === 1 ? 'Tiếp tục: Kiểm tra hồ sơ' : 'Gửi hồ sơ đăng ký'}
            <ArrowRight size={18} />
          </>}
        </button>
      </div>
    </footer>
  )
}

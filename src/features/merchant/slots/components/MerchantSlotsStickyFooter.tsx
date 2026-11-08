import { RotateCcw, Save, Loader2 } from 'lucide-react'
interface Props { hasChanges: boolean; isSaving: boolean; isLocked?: boolean; onReset: () => void; onSave: () => void }
export function MerchantSlotsStickyFooter({ hasChanges, isSaving, isLocked, onReset, onSave }: Props) {
  return <footer className="slots-footer"><div><strong>{hasChanges ? 'Có thay đổi chưa lưu' : 'Chưa có thay đổi'}</strong><p>{hasChanges ? 'Kiểm tra số chỗ trước khi lưu cấu hình.' : 'Số liệu hiển thị theo cấu hình hiện tại của bãi.'}</p></div><div className="slots-footer-actions"><button type="button" onClick={onReset} disabled={!hasChanges || isSaving || isLocked}><RotateCcw size={16} />Hủy thay đổi</button><button className="slots-save" type="button" onClick={onSave} disabled={!hasChanges || isSaving || isLocked} aria-busy={isSaving}>{isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{isSaving ? 'Đang lưu...' : 'Lưu sức chứa'}</button></div></footer>
}

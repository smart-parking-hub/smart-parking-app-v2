import React from 'react'
import { RotateCcw, Check } from 'lucide-react'
import { Drawer } from './Drawer'
import { Button } from './Button'

export interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  onReset?: () => void
  children: React.ReactNode
  title?: string
  description?: string
  applyText?: string
  resetText?: string
  isApplying?: boolean
}

export function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  onReset,
  children,
  title = 'Bộ lọc nâng cao',
  description = 'Tùy chỉnh tiêu chí tìm kiếm và sắp xếp kết quả',
  applyText = 'Áp dụng bộ lọc',
  resetText = 'Đặt lại',
  isApplying = false,
}: FilterDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      placement="right"
      size="md"
      footer={
        <div className="flex items-center justify-between gap-3">
          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              {resetText}
            </Button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Đóng
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onApply()
                onClose()
              }}
              isLoading={isApplying}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              {applyText}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 py-2">{children}</div>
    </Drawer>
  )
}

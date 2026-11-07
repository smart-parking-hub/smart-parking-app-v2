import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/shared/utils/cn'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (val: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (val: string) => void
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultValue || '')
  const activeTab = value !== undefined ? value : internalTab

  const handleTabChange = (val: string) => {
    if (value === undefined) {
      setInternalTab(val)
    }
    onValueChange?.(val)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  badge?: React.ReactNode
}

export function TabTrigger({
  value,
  badge,
  className,
  children,
  ...props
}: TabTriggerProps) {
  const ctx = useContext(TabsContext)
  const isSelected = ctx?.activeTab === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => ctx?.setActiveTab(value)}
      className={cn(
        'px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer select-none flex items-center gap-2',
        isSelected
          ? 'text-[#d95f00] border-b-2 border-[#d95f00]'
          : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
      {badge && <span className="shrink-0">{badge}</span>}
    </button>
  )
}

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabContent({
  value,
  className,
  children,
  ...props
}: TabContentProps) {
  const ctx = useContext(TabsContext)
  if (ctx?.activeTab !== value) return null

  return (
    <div role="tabpanel" className={cn('pt-4 animate-in fade-in duration-150', className)} {...props}>
      {children}
    </div>
  )
}

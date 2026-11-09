import { clearSession } from '@/features/auth'
import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ScrollToTop } from '@/shared/components/ScrollToTop'
import { Dialog } from '@/shared/components/Dialog'
import { ShieldCheck, Menu, LogOut, LayoutDashboard, Warehouse, Users, CreditCard, ArrowDownToLine, Scale, ScrollText, Bell, UserCheck, ChevronRight, ArrowUpRight } from 'lucide-react'
import './admin-layout.css'

const navGroups = [
  { label: 'ĐIỀU HÀNH', items: [
    { path: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { path: 'parking-lots', label: 'Kiểm duyệt bãi', icon: Warehouse },
    { path: 'users', label: 'Người dùng', icon: Users },
  ] },
  { label: 'TÀI CHÍNH & KIỂM SOÁT', items: [
    { path: 'transactions', label: 'Giao dịch', icon: CreditCard },
    { path: 'withdrawals', label: 'Duyệt rút tiền', icon: ArrowDownToLine },
    { path: 'disputes', label: 'Tranh chấp', icon: Scale },
  ] },
  { label: 'HỆ THỐNG', items: [
    { path: 'audit-logs', label: 'Nhật ký kiểm toán', icon: ScrollText },
    { path: 'notifications', label: 'Thông báo', icon: Bell },
    { path: 'profile', label: 'Hồ sơ quản trị', icon: UserCheck },
  ] },
]

function AdminNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return <>
    <NavLink to="/admin/dashboard" className="admin-brand" onClick={onNavigate}>
      <img src="/image-smart-parking-hub.png" alt="" className="admin-brand-logo" />
      <span><strong>SMARTTRUCK<span>HUB</span></strong><small>KHÔNG GIAN QUẢN TRỊ</small></span>
    </NavLink>
    <nav aria-label="Quản trị" className="admin-navigation">
      {navGroups.map(group => <div className="admin-nav-group" key={group.label}>
        <p>{group.label}</p>
        {group.items.map(({ path, label, icon: Icon }) => <NavLink key={path} to={`/admin/${path}`} onClick={onNavigate} className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}>
          <Icon size={18} aria-hidden="true" /><span>{label}</span><ChevronRight size={14} className="admin-nav-arrow" aria-hidden="true" />
        </NavLink>)}
      </div>)}
    </nav>
    <div className="admin-sidebar-footer">
      <ShieldCheck size={18} aria-hidden="true" /><div><strong>Quản trị có trách nhiệm</strong><p>Thao tác được lưu trong nhật ký</p></div>
    </div>
  </>
}

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const cache = useQueryClient()

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const breakpoint = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (breakpoint.matches) setOpen(false) }
    breakpoint.addEventListener('change', closeOnDesktop)
    return () => breakpoint.removeEventListener('change', closeOnDesktop)
  }, [])

  const currentItem = navGroups.flatMap(group => group.items).find(item => location.pathname.startsWith(`/admin/${item.path}`))

  return <div className="admin-shell">
    <ScrollToTop />
    <a className="admin-skip-link" href="#admin-content">Đến nội dung chính</a>
    <aside className="admin-sidebar"><AdminNavigation /></aside>
    <div className="admin-body">
      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <button type="button" className="admin-menu-button" onClick={() => setOpen(true)} aria-label="Mở menu quản trị" aria-expanded={open} aria-haspopup="dialog"><Menu size={21} /></button>
          <span className="admin-breadcrumb-label">Không gian quản trị</span><ChevronRight size={14} className="admin-breadcrumb-label" aria-hidden="true" />
          <span className="admin-current-page">{currentItem?.label ?? 'Tổng quan'}</span>
        </div>
        <div className="admin-topbar-actions">
          <NavLink to="/admin/profile" className="admin-account" aria-label="Hồ sơ quản trị"><span>AD</span><div><strong>Quản trị viên</strong><small>SmartTruck Hub</small></div></NavLink>
          <button type="button" className="admin-logout" onClick={() => {
            clearSession()
            localStorage.removeItem('smart-truck-parking.auth')
            cache.clear()
            navigate('/login')
          }}><LogOut size={17} aria-hidden="true" /><span>Đăng xuất</span></button>
        </div>
      </header>
      <main id="admin-content" className="admin-main" tabIndex={-1}><Outlet /></main>
      <footer className="admin-page-footer"><span>SMARTTRUCK HUB <span aria-hidden="true">/</span> ADMIN</span><NavLink to="/admin/audit-logs">Nhật ký hoạt động <ArrowUpRight size={13} aria-hidden="true" /></NavLink></footer>
    </div>
    {open && <Dialog title="Điều hướng quản trị" onClose={() => setOpen(false)} className="admin-mobile-drawer"><AdminNavigation onNavigate={() => setOpen(false)} /></Dialog>}
  </div>
}

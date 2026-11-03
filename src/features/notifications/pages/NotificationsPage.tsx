import { useState, useEffect, useMemo } from 'react'
import {
  fetchNotificationsApi,
  markAsReadApi,
  markAllAsReadApi,
  fetchStoredChannelsConfig,
  saveStoredChannelsConfig,
  fallbackNotificationsList,
  fallbackDriverStats,
} from '../api/notificationApi'
import type {
  NotificationItemDto,
  NotificationStatusFilter,
  NotificationCategoryFilter,
  DriverNotificationChannelsConfig,
  DriverNotificationStats,
} from '../types/notificationTypes'
import { NotificationsHeader } from '../components/NotificationsHeader'
import { NotificationsFilterBar } from '../components/NotificationsFilterBar'
import { NotificationCardItem } from '../components/NotificationCardItem'
import { NotificationChannelsSidebarCard } from '../components/NotificationChannelsSidebarCard'
import { DailyOperationsKpiSidebarCard } from '../components/DailyOperationsKpiSidebarCard'
import { DispatchHotlineSupportCard } from '../components/DispatchHotlineSupportCard'
import { NotificationsPagination } from '../components/NotificationsPagination'
import { NotificationsEmptyState } from '../components/NotificationsEmptyState'
import { NotificationsSkeleton } from '../components/NotificationsSkeleton'
import { ProfileSidebarNav } from '../../profile/components/ProfileSidebarNav'
import { useNavigate } from 'react-router-dom'

export function NotificationsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<NotificationItemDto[]>(
    fallbackNotificationsList
  )
  const [statusFilter, setStatusFilter] = useState<NotificationStatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategoryFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const [refreshCountdown, setRefreshCountdown] = useState(5)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const [channelsConfig, setChannelsConfig] = useState<DriverNotificationChannelsConfig>(
    fetchStoredChannelsConfig
  )
  const [stats, setStats] = useState<DriverNotificationStats>(fallbackDriverStats)

  // Initial load
  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        const res = await fetchNotificationsApi({ page: 0, size: 20 })
        if (isMounted && res.items && res.items.length > 0) {
          setNotifications(res.items)
        }
      } catch {
        // Fallback initialized
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Auto-refresh 5-second ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          return 5
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // 1. Status filter
      let matchStatus = true
      if (statusFilter === 'unread') {
        matchStatus = item.readAt === null
      } else if (statusFilter === 'urgent') {
        matchStatus = item.isUrgent === true
      }

      // 2. Category filter
      let matchCategory = true
      if (categoryFilter !== 'all') {
        matchCategory = item.category === categoryFilter
      }

      return matchStatus && matchCategory
    })
  }, [notifications, statusFilter, categoryFilter])

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredNotifications.slice(start, start + pageSize)
  }, [filteredNotifications, currentPage, pageSize])

  // Dynamic counts
  const unreadCount = useMemo(() => {
    return notifications.filter((item) => item.readAt === null).length
  }, [notifications])

  const urgentCount = useMemo(() => {
    return notifications.filter((item) => item.isUrgent).length
  }, [notifications])

  // Update stats dynamically
  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      totalCount: notifications.length,
      unreadCount,
      urgentCount,
    }))
  }, [notifications.length, unreadCount, urgentCount])

  // Reset page when filters change
  const handleStatusChange = (status: NotificationStatusFilter) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleCategoryChange = (cat: NotificationCategoryFilter) => {
    setCategoryFilter(cat)
    setCurrentPage(1)
  }

  // Handlers
  const handleMarkRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, readAt: new Date().toISOString() } : item
      )
    )
    await markAsReadApi(id)
  }

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true)
    try {
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, readAt: new Date().toISOString() }))
      )
      await markAllAsReadApi()
    } finally {
      setIsMarkingAll(false)
    }
  }

  const handleToggleChannel = (key: keyof DriverNotificationChannelsConfig) => {
    setChannelsConfig((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      saveStoredChannelsConfig(updated)
      return updated
    })
  }

  const handleClaimSlot = (notification: NotificationItemDto) => {
    navigate('/queues', { state: { claimBookingId: notification.id } })
  }

  const handleResetFilters = () => {
    setStatusFilter('all')
    setCategoryFilter('all')
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <NotificationsSkeleton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        {/* Hero Header */}
        <NotificationsHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          isMarkingAll={isMarkingAll}
        />

        {/* Dual Filter Bar */}
        <NotificationsFilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusChange}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={handleCategoryChange}
          totalCount={notifications.length}
          unreadCount={unreadCount}
          urgentCount={urgentCount}
          refreshSecondsCountdown={refreshCountdown}
        />

        {/* 12-Column Responsive Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Event articles list & Pagination */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            {paginatedItems.length === 0 ? (
              <NotificationsEmptyState onResetFilters={handleResetFilters} />
            ) : (
              <>
                {paginatedItems.map((item) => (
                  <NotificationCardItem
                    key={item.id}
                    notification={item}
                    onMarkRead={handleMarkRead}
                    onClaimSlot={handleClaimSlot}
                  />
                ))}

                <NotificationsPagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={filteredNotifications.length}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>

          {/* Right Column (4 cols): Profile Sidebar Nav, Channels Settings, Daily Stats & Hotline */}
          <aside className="xl:col-span-4 flex flex-col gap-5">
            <ProfileSidebarNav activeTab="notifications" />

            <NotificationChannelsSidebarCard
              config={channelsConfig}
              onToggleChannel={handleToggleChannel}
            />

            <DailyOperationsKpiSidebarCard stats={stats} />

            <DispatchHotlineSupportCard />
          </aside>
        </div>
      </div>
    </main>
  )
}

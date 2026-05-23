import React, { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { getSocket } from '@/socket/socket'
import { NotificationsScreen as _NotificationsScreen } from '../screens/shared'

const NotificationsScreen = _NotificationsScreen as React.ComponentType<{
  notifications: object[]
  onMarkRead: (id: string) => void
}>

export function NotificationsContainer() {
  const qc = useQueryClient()

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get('/v1/notifications').then((r) => r.data as object[]),
    staleTime: 10000,
  })

  useEffect(() => {
    const socket = getSocket()
    socket.on('notification:new', () => {
      void qc.invalidateQueries({ queryKey: ['notifications'] })
    })
    return () => { socket.off('notification:new') }
  }, [qc])

  const markRead = async (id: string) => {
    await apiClient.patch(`/v1/notifications/${id}/read`)
    void qc.invalidateQueries({ queryKey: ['notifications'] })
  }

  return (
    <NotificationsScreen
      notifications={notifications || []}
      onMarkRead={markRead}
    />
  )
}

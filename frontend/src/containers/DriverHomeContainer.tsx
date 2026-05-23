import React, { useCallback, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/api/client'
import { useAssignment } from '@/socket/useTracking'
import { getSocket } from '@/socket/socket'
import { DriverHome as _DriverHome } from '../screens/driver'

const DriverHome = _DriverHome as React.ComponentType<{
  courier: object
  pendingAssignment: object | null
  onToggleOnline: () => void
  onAcceptAssignment: () => void
  onRejectAssignment: () => void
}>

export function DriverHomeContainer() {
  const { name } = useAuthStore.getState()
  const [online, setOnline] = useState(false)
  const [pendingAssignment, setPendingAssignment] = useState<object | null>(null)

  const handleAssignment = useCallback((data: object) => setPendingAssignment(data), [])
  useAssignment(handleAssignment)

  const toggleOnline = async () => {
    if (online) {
      await apiClient.post('/v1/couriers/offline')
    } else {
      await apiClient.post('/v1/couriers/online')
      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition((pos) => {
          void apiClient.patch('/v1/couriers/location', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            bearing: pos.coords.heading,
            speed_kmh: pos.coords.speed != null ? pos.coords.speed * 3.6 : null,
          })
        }, undefined, { enableHighAccuracy: true, maximumAge: 3000 })
      }
    }
    setOnline(!online)
  }

  const respondAssignment = async (accept: boolean) => {
    if (!pendingAssignment) return
    const deliveryId = (pendingAssignment as { delivery_id: string }).delivery_id
    await apiClient.post('/v1/couriers/assignments/respond', { delivery_id: deliveryId, accept })
    getSocket().emit(accept ? 'assignment:accept' : 'assignment:reject', { delivery_id: deliveryId })
    setPendingAssignment(null)
  }

  return (
    <DriverHome
      courier={{ name: name || 'Livreur', online }}
      pendingAssignment={pendingAssignment}
      onToggleOnline={() => { void toggleOnline() }}
      onAcceptAssignment={() => { void respondAssignment(true) }}
      onRejectAssignment={() => { void respondAssignment(false) }}
    />
  )
}

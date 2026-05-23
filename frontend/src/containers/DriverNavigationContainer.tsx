import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import { apiClient } from '@/api/client'
import { DriverNavigation as _DriverNavigation } from '../screens/driver'

const DriverNavigation = _DriverNavigation as React.ComponentType<{
  order: object | null
  myLocation: { lat: number; lng: number } | null
  step: 'to_vendor' | 'to_client'
  onPickedUp: () => void
  onArrived: () => void
  onBack: () => void
}>

export function DriverNavigationContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null)

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.get(orderId!).then((r) => r.data),
    enabled: !!orderId,
    refetchInterval: 5000,
  })

  // GPS continu
  useEffect(() => {
    if (!('geolocation' in navigator)) return
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setMyLocation(loc)
        void apiClient.patch('/v1/couriers/location', {
          ...loc,
          bearing: pos.coords.heading,
          speed_kmh: pos.coords.speed != null ? pos.coords.speed * 3.6 : null,
        })
      },
      undefined,
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const step = order?.status === 'en_route_vers_vendeur' ? 'to_vendor' : 'to_client'

  const markPickedUp = async () => {
    await apiClient.post(`/v1/orders/${orderId}/status`, { status: 'en_route_vers_client' })
  }

  const markArrived = () => {
    navigate(`/driver/orders/${orderId}/proof`)
  }

  return (
    <DriverNavigation
      order={order || null}
      myLocation={myLocation}
      step={step}
      onPickedUp={markPickedUp}
      onArrived={markArrived}
      onBack={() => navigate('/driver')}
    />
  )
}

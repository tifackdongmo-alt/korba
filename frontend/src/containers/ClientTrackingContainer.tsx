import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import { useTracking, useOrderStatus } from '@/socket/useTracking'
import { ClientTracking as _ClientTracking } from '../screens/client'

const ClientTracking = _ClientTracking as React.ComponentType<{ order: object }>

export function ClientTrackingContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.get(orderId!).then((r) => r.data),
    enabled: !!orderId,
    refetchInterval: 10000,
  })

  const { courierLocation } = useTracking(orderId ?? null)
  useOrderStatus(orderId ?? null, setCurrentStatus)

  if (!order) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40, fontFamily: 'var(--font-sans)' }}>Chargement...</div>

  return (
    <ClientTracking
      order={{
        ...order,
        status: currentStatus || order.status,
        courierLocation,
        total_fcfa: Math.round(order.total_centimes / 100).toLocaleString('fr-FR'),
      }}
    />
  )
}
